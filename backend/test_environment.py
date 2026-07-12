import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient

from app.main import app
from app.database import seed_database, EMISSION_FACTORS_DB, CARBON_TRANSACTIONS_DB, ENVIRONMENTAL_GOALS_DB
from app.utils.calculator import calculate_environment_score

# Ensure database is seeded
seed_database()

client = TestClient(app)


# Helper function to get Authorization headers
def get_auth_header(email: str, password: str) -> dict:
    login_data = {"username": email, "password": password}
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200, f"Login failed: {response.json()}"
    token = response.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_emission_factors_endpoints():
    headers = get_auth_header("admin@ecosphere.com", "AdminPass123")

    # 1. Get factors
    response = client.get("/api/v1/environment/factors", headers=headers)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert len(res_json["data"]) >= 4  # Seeded factors (Electricity, Diesel, Natural Gas, Flight)

    # 2. Create a factor
    new_factor = {
        "category": "Coal",
        "factor": 1.25,
        "unit": "kg",
        "description": "Coal energy generation"
    }
    response = client.post("/api/v1/environment/factors", json=new_factor, headers=headers)
    assert response.status_code == 201
    res_json = response.json()
    assert res_json["success"] is True
    assert res_json["data"]["category"] == "Coal"
    factor_id = res_json["data"]["id"]

    # 3. Update factor
    update_data = {"factor": 1.30}
    response = client.put(f"/api/v1/environment/factors/{factor_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    assert response.json()["data"]["factor"] == 1.30

    # 4. Delete factor
    response = client.delete(f"/api/v1/environment/factors/{factor_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_carbon_transactions_endpoints():
    headers = get_auth_header("admin@ecosphere.com", "AdminPass123")

    # Get a seeded factor ID (e.g. fac-2 for Diesel)
    diesel_factor = None
    for f in EMISSION_FACTORS_DB.values():
        if f["category"] == "Diesel":
            diesel_factor = f
            break
    assert diesel_factor is not None

    # 1. Create a transaction
    tx_data = {
        "department_id": "dep-2",  # Logistics
        "emission_factor_id": diesel_factor["id"],
        "activity_name": "Delivery truck run",
        "quantity": 10.0
    }
    response = client.post("/api/v1/environment/transactions", json=tx_data, headers=headers)
    assert response.status_code == 201
    res_json = response.json()
    assert res_json["success"] is True
    assert res_json["data"]["emission_value"] == 26.8  # 10.0 * 2.68
    tx_id = res_json["data"]["id"]

    # 2. Get transactions
    response = client.get("/api/v1/environment/transactions", headers=headers)
    assert response.status_code == 200
    assert len(response.json()["data"]) >= 1

    # 3. Update transaction quantity
    response = client.put(f"/api/v1/environment/transactions/{tx_id}", json={"quantity": 20.0}, headers=headers)
    assert response.status_code == 200
    assert response.json()["data"]["emission_value"] == 53.6  # 20.0 * 2.68

    # 4. Delete transaction
    response = client.delete(f"/api/v1/environment/transactions/{tx_id}", headers=headers)
    assert response.status_code == 200


def test_sustainability_goals_endpoints():
    headers = get_auth_header("admin@ecosphere.com", "AdminPass123")
    deadline = (datetime.now(timezone.utc) + timedelta(days=20)).isoformat()

    # 1. Create goal
    goal_data = {
        "title": "Reduce Office Paper Use",
        "target_value": 150.0,
        "deadline": deadline
    }
    response = client.post("/api/v1/environment/goals", json=goal_data, headers=headers)
    assert response.status_code == 201
    res_json = response.json()
    assert res_json["success"] is True
    assert res_json["data"]["title"] == "Reduce Office Paper Use"
    assert res_json["data"]["status"] == "Active"
    goal_id = res_json["data"]["id"]

    # 2. Patch goal progress
    response = client.patch(f"/api/v1/environment/goals/{goal_id}", json={"current_value": 50.0}, headers=headers)
    assert response.status_code == 200
    assert response.json()["data"]["current_value"] == 50.0

    # 3. Delete goal
    response = client.delete(f"/api/v1/environment/goals/{goal_id}", headers=headers)
    assert response.status_code == 200


def test_calculator_esg_scoring():
    # Clear goal DB and test specific cases
    ENVIRONMENTAL_GOALS_DB.clear()

    # Base score
    assert calculate_environment_score() == 100.0

    # 1. Add active overdue goal -> -5 points
    ENVIRONMENTAL_GOALS_DB["goal-temp-1"] = {
        "id": "goal-temp-1",
        "title": "Overdue goal",
        "target_value": 200.0,
        "current_value": 100.0,
        "deadline": datetime.now(timezone.utc) - timedelta(days=2),
        "status": "Active"
    }
    # Score: 95
    assert calculate_environment_score() == 95.0

    # 2. Add goal exceeding target by 250 kg -> -6 points (3 points per 100kg exceeded)
    ENVIRONMENTAL_GOALS_DB["goal-temp-2"] = {
        "id": "goal-temp-2",
        "title": "Exceeded goal",
        "target_value": 100.0,
        "current_value": 350.0, # exceeds by 250kg
        "deadline": datetime.now(timezone.utc) + timedelta(days=2),
        "status": "Active"
    }
    # Score: 95 - 6 = 89
    assert calculate_environment_score() == 89.0

    # 3. Add achieved goal -> +5 points
    ENVIRONMENTAL_GOALS_DB["goal-temp-3"] = {
        "id": "goal-temp-3",
        "title": "Achieved goal",
        "target_value": 50.0,
        "current_value": 50.0,
        "deadline": datetime.now(timezone.utc) + timedelta(days=2),
        "status": "Achieved"
    }
    # Score: 89 + 5 = 94
    assert calculate_environment_score() == 94.0


def test_dashboard_and_report_aggregates():
    headers = get_auth_header("admin@ecosphere.com", "AdminPass123")

    # Clear DB tables to isolate test
    CARBON_TRANSACTIONS_DB.clear()
    ENVIRONMENTAL_GOALS_DB.clear()

    # Create helper factors
    electricity_id = None
    for f in EMISSION_FACTORS_DB.values():
        if f["category"] == "Electricity":
            electricity_id = f["id"]
            break
    assert electricity_id is not None

    # Add transaction (Logistics - dep-2: 200 units * 0.85 = 170.0 kg CO2)
    client.post(
        "/api/v1/environment/transactions",
        json={
            "department_id": "dep-2",
            "emission_factor_id": electricity_id,
            "activity_name": "Logistics electricity",
            "quantity": 200.0
        },
        headers=headers
    )

    # 1. Dashboard request
    response = client.get("/api/v1/environment/dashboard", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["total_emission"] == 170.0
    assert "Operations & Logistics" in data["top_department"]
    assert data["environment_score"] == 100.0

    # 2. Report request
    response = client.get("/api/v1/environment/report", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["total_emissions"] == 170.0
    assert data["emissions_summary"]["Operations & Logistics"] == 170.0
