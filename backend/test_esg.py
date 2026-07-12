import pytest
from uuid import UUID, uuid4

# Helper function to get Authorization headers
def get_auth_header(client, email: str, password: str) -> dict:
    login_data = {"username": email, "password": password}
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200, f"Login failed for {email}: {response.json()}"
    token = response.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_environmental_endpoints(client):
    """Verify Environmental emission factors, carbon ledger calculations, and goals."""
    admin_headers = get_auth_header(client, "admin@ecosphere.com", "AdminPass123")
    employee_headers = get_auth_header(client, "employee@ecosphere.com", "EmployeePass123")

    # 1. Register Emission Factor
    factor_payload = {
        "activity_name": "Server Electricity",
        "category": "Scope 2 (Electricity)",
        "factor_value": 0.52,
        "unit": "kg CO2e/kWh",
        "description": "Grid electricity usage emissions factor"
    }
    res = client.post("/api/v1/environment/emission-factors", json=factor_payload, headers=admin_headers)
    assert res.status_code == 201
    factor_id = res.json()["data"]["id"]

    # 2. Employees blocked from creating emission factors
    res = client.post("/api/v1/environment/emission-factors", json=factor_payload, headers=employee_headers)
    assert res.status_code == 403

    # 3. Log Carbon Transaction (Admin only)
    # Let's get user and department IDs first
    users_res = client.get("/api/v1/users", headers=admin_headers)
    admin_user_id = users_res.json()["data"][0]["id"]
    dep_id = users_res.json()["data"][0]["department"] or str(uuid4())

    tx_payload = {
        "user_id": admin_user_id,
        "department_id": dep_id,
        "emission_factor_id": factor_id,
        "activity_name": "Server Farm Electricity Usage",
        "quantity": 1000.0,
        "remarks": "Datacenter usage for the month of July"
    }
    res = client.post("/api/v1/environment/carbon", json=tx_payload, headers=admin_headers)
    assert res.status_code == 201
    # Check that emissions were calculated: quantity (1000) * factor_value (0.52) = 520.0 kg CO2e
    assert res.json()["data"]["carbon_emission"] == 520.0
    tx_id = res.json()["data"]["id"]

    # 4. Create and update Environmental Goal
    goal_payload = {
        "title": "Reduce Carbon Footprint",
        "description": "Decrease server hosting footprint by 20%",
        "target_value": 100.0,
        "current_value": 0.0,
        "unit": "Tons CO2e",
        "deadline": "2026-12-31T23:59:59Z"
    }
    res = client.post("/api/v1/environment/goals", json=goal_payload, headers=admin_headers)
    assert res.status_code == 201
    goal_id = res.json()["data"]["id"]
    assert res.json()["data"]["status"] == "In Progress"

    # Update goal progress to completion
    res = client.put(f"/api/v1/environment/goals/{goal_id}", json={"current_value": 120.0}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["data"]["status"] == "Completed"

def test_social_endpoints(client):
    """Verify social CSR activity logs and volunteer points assignment."""
    admin_headers = get_auth_header(client, "admin@ecosphere.com", "AdminPass123")
    
    # 1. Create CSR Activity
    activity_payload = {
        "title": "Community Tree Planting",
        "description": "Planted 50 native trees in green areas.",
        "location": "Local Park",
        "activity_date": "2026-08-15T09:00:00Z",
        "max_points": 50
    }
    res = client.post("/api/v1/social/csr", json=activity_payload, headers=admin_headers)
    assert res.status_code == 201
    act_id = res.json()["data"]["id"]

    # 2. Log Employee Participation
    users_res = client.get("/api/v1/users", headers=admin_headers)
    employee_user_id = next(u["id"] for u in users_res.json()["data"] if u["role"] == "Employee")
    
    part_payload = {
        "employee_id": employee_user_id,
        "activity_id": act_id,
        "proof_url": "http://example.com/tree_planting_proof.jpg"
    }
    res = client.post("/api/v1/social/participation", json=part_payload, headers=admin_headers)
    assert res.status_code == 201
    part_id = res.json()["data"]["id"]
    assert res.json()["data"]["approval_status"] == "Pending"
    assert res.json()["data"]["points_earned"] == 0

    # 3. Approve Participation to Award Points (Admin/Manager only)
    res = client.put(f"/api/v1/social/participation/{part_id}", json={"approval_status": "Approved"}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["data"]["approval_status"] == "Approved"
    assert res.json()["data"]["points_earned"] == 50

def test_governance_endpoints(client):
    """Verify policies, policy acknowledgements, audits, and compliance issues."""
    admin_headers = get_auth_header(client, "admin@ecosphere.com", "AdminPass123")
    
    # 1. Create Policy
    policy_payload = {
        "title": "Anti-Corruption Policy",
        "description": "Zero tolerance for bribery and extortion.",
        "version": "v1.2",
        "effective_date": "2026-07-01T00:00:00Z"
    }
    res = client.post("/api/v1/governance/policies", json=policy_payload, headers=admin_headers)
    assert res.status_code == 201
    policy_id = res.json()["data"]["id"]

    # 2. Acknowledge Policy
    users_res = client.get("/api/v1/users", headers=admin_headers)
    employee_user_id = next(u["id"] for u in users_res.json()["data"] if u["role"] == "Employee")

    ack_payload = {
        "policy_id": policy_id,
        "employee_id": employee_user_id
    }
    res = client.post("/api/v1/governance/acknowledgements", json=ack_payload, headers=admin_headers)
    assert res.status_code == 201
    assert res.json()["data"]["policy_id"] == policy_id

    # 3. Create Audit report
    dep_id = users_res.json()["data"][0]["department"] or str(uuid4())
    audit_payload = {
        "department_id": dep_id,
        "auditor_name": "KPMG ESG Assurance Team",
        "audit_date": "2026-07-20T10:00:00Z",
        "remarks": "Annual sustainability reporting audits"
    }
    res = client.post("/api/v1/governance/audits", json=audit_payload, headers=admin_headers)
    assert res.status_code == 201
    audit_id = res.json()["data"]["id"]

    # 4. Log Compliance Issue
    issue_payload = {
        "audit_id": audit_id,
        "severity": "Medium",
        "description": "Missing energy consumption log reports for secondary datacenter.",
        "owner_id": employee_user_id,
        "due_date": "2026-08-20T17:00:00Z"
    }
    res = client.post("/api/v1/governance/compliance", json=issue_payload, headers=admin_headers)
    assert res.status_code == 201

def test_gamification_endpoints(client):
    """Verify challenges, badge achievements, and reward redemptions."""
    admin_headers = get_auth_header(client, "admin@ecosphere.com", "AdminPass123")
    
    # 1. Create a challenge
    challenge_payload = {
        "title": "Bike to Work Week",
        "description": "Commute via bicycle to save emissions.",
        "points": 100,
        "difficulty": "Medium",
        "deadline": "2026-08-30T18:00:00Z"
    }
    res = client.post("/api/v1/gamification/challenges", json=challenge_payload, headers=admin_headers)
    assert res.status_code == 201
    chal_id = res.json()["data"]["id"]

    # 2. Join challenge
    users_res = client.get("/api/v1/users", headers=admin_headers)
    employee_user_id = next(u["id"] for u in users_res.json()["data"] if u["role"] == "Employee")
    
    join_payload = {
        "challenge_id": chal_id,
        "employee_id": employee_user_id
    }
    res = client.post("/api/v1/gamification/challenges/join", json=join_payload, headers=admin_headers)
    assert res.status_code == 201
    part_id = res.json()["data"]["id"]

    # 3. Update progress to complete (awards points)
    res = client.put(f"/api/v1/gamification/challenges/participation/{part_id}", json={"progress": 100.0}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["data"]["completed"] is True
    assert res.json()["data"]["points_awarded"] == 100

    # 4. Create and award Badge
    badge_payload = {
        "name": "Eco Rider",
        "description": "Awarded for green transit initiatives.",
        "required_points": 100,
        "icon": "bicycle-icon"
    }
    res = client.post("/api/v1/gamification/badges", json=badge_payload, headers=admin_headers)
    assert res.status_code == 201
    badge_id = res.json()["data"]["id"]

    res = client.post("/api/v1/gamification/badges/award", json={"employee_id": employee_user_id, "badge_id": badge_id}, headers=admin_headers)
    assert res.status_code == 201

    # 5. Create Reward and Redeem (deducts stock)
    reward_payload = {
        "name": "Eco Mug",
        "description": "Reusable stainless mug.",
        "points_required": 50,
        "stock": 1
    }
    res = client.post("/api/v1/gamification/rewards", json=reward_payload, headers=admin_headers)
    assert res.status_code == 201
    rew_id = res.json()["data"]["id"]

    # Redeem first (succeeds, stock drops to 0)
    res = client.post("/api/v1/gamification/rewards/redeem", json={"employee_id": employee_user_id, "reward_id": rew_id}, headers=admin_headers)
    assert res.status_code == 201

    # Redeem second (fails with 400 Out of Stock)
    res = client.post("/api/v1/gamification/rewards/redeem", json={"employee_id": employee_user_id, "reward_id": rew_id}, headers=admin_headers)
    assert res.status_code == 400
    assert "out of stock" in res.json()["message"].lower()

def test_reports_endpoints(client):
    """Verify aggregated read-only ESG analytical reports."""
    admin_headers = get_auth_header(client, "admin@ecosphere.com", "AdminPass123")

    # Fetch report summaries
    res = client.get("/api/v1/reports/environment", headers=admin_headers)
    assert res.status_code == 200
    assert "total_carbon_emission" in res.json()["data"]

    res = client.get("/api/v1/reports/social", headers=admin_headers)
    assert res.status_code == 200
    assert "volunteer_participation_rate" in res.json()["data"]

    res = client.get("/api/v1/reports/governance", headers=admin_headers)
    assert res.status_code == 200
    assert "acknowledgement_compliance_rate" in res.json()["data"]

    res = client.get("/api/v1/reports/esg-score", headers=admin_headers)
    assert res.status_code == 200
    assert "composite_esg_score" in res.json()["data"]
