import pytest

# Helper function to get Authorization headers
def get_auth_header(client, email: str, password: str) -> dict:
    login_data = {"username": email, "password": password}
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200, f"Login failed for {email}: {response.json()}"
    token = response.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_health_check(client):
    """Verify that root healthcheck endpoint returns successfully with standardized envelope."""
    response = client.get("/")
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert "EcoSphere" in res_json["message"]
    assert "docs_url" in res_json["data"]

def test_auth_registration_and_login(client):
    """Verify registration logic (validating requirements) and login token distribution."""
    # 1. Registration with short password should fail
    bad_reg = {
        "name": "Testing User",
        "email": "test_bad@ecosphere.com",
        "password": "short",
        "role": "Employee"
    }
    response = client.post("/api/v1/auth/register", json=bad_reg)
    assert response.status_code == 422
    assert response.json()["success"] is False
    assert "Validation failed" in response.json()["message"]

    # 2. Registration with valid details should succeed
    good_reg = {
        "name": "Testing User",
        "email": "test_good@ecosphere.com",
        "password": "ValidPassword123!",
        "role": "Employee"
    }
    response = client.post("/api/v1/auth/register", json=good_reg)
    assert response.status_code == 201
    res_json = response.json()
    assert res_json["success"] is True
    assert res_json["data"]["email"] == "test_good@ecosphere.com"
    assert res_json["data"]["role"] == "Employee"

    # 3. Duplicate registration should return 409 conflict
    response = client.post("/api/v1/auth/register", json=good_reg)
    assert response.status_code == 409
    assert response.json()["success"] is False
    assert "already registered" in response.json()["message"]

    # 4. Login with bad credentials should return 401
    response = client.post("/api/v1/auth/login", data={"username": "test_good@ecosphere.com", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json()["success"] is False

    # 5. Successful login
    headers = get_auth_header(client, "test_good@ecosphere.com", "ValidPassword123!")
    
    # 6. Retrieve profile of logged in user
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert res_json["data"]["email"] == "test_good@ecosphere.com"

def test_rbac_authorization(client):
    """Verify that RBAC correctly permits and blocks resources based on user roles."""
    # Seed data details:
    # admin@ecosphere.com -> AdminPass123 (Admin)
    # manager@ecosphere.com -> ManagerPass123 (Manager)
    # employee@ecosphere.com -> EmployeePass123 (Employee)
    
    admin_headers = get_auth_header(client, "admin@ecosphere.com", "AdminPass123")
    manager_headers = get_auth_header(client, "manager@ecosphere.com", "ManagerPass123")
    employee_headers = get_auth_header(client, "employee@ecosphere.com", "EmployeePass123")

    # Scenario: Reading Users list
    # Admin - Yes
    res = client.get("/api/v1/users", headers=admin_headers)
    assert res.status_code == 200
    assert len(res.json()["data"]) > 0

    # Manager - Yes
    res = client.get("/api/v1/users", headers=manager_headers)
    assert res.status_code == 200

    # Employee - No (403 Forbidden)
    res = client.get("/api/v1/users", headers=employee_headers)
    assert res.status_code == 403
    assert res.json()["success"] is False
    assert "Access denied" in res.json()["message"]

    # Scenario: Department creation
    # Admin - Yes
    new_dep = {
        "name": "Verification Operations",
        "code": "VOP",
        "head": "Tester McTest"
    }
    res = client.post("/api/v1/departments", json=new_dep, headers=admin_headers)
    assert res.status_code == 201
    dep_id = res.json()["data"]["id"]

    # Employee - No (403 Forbidden)
    res = client.post("/api/v1/departments", json=new_dep, headers=employee_headers)
    assert res.status_code == 403

def test_user_crud(client):
    """Test full user management lifecycle (Admin-only)."""
    admin_headers = get_auth_header(client, "admin@ecosphere.com", "AdminPass123")
    
    # 1. Create a user
    user_payload = {
        "name": "Audit Officer",
        "email": "audit@ecosphere.com",
        "password": "PasswordAudit999!",
        "role": "Manager",
        "department": "dep-1"
    }
    response = client.post("/api/v1/users", json=user_payload, headers=admin_headers)
    assert response.status_code == 201
    user_id = response.json()["data"]["id"]
    
    # 2. Get user details
    response = client.get(f"/api/v1/users/{user_id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["data"]["name"] == "Audit Officer"
    
    # 3. Update user profile details
    update_payload = {
        "name": "Senior Audit Officer",
        "status": "Inactive"
    }
    response = client.put(f"/api/v1/users/{user_id}", json=update_payload, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["data"]["name"] == "Senior Audit Officer"
    assert response.json()["data"]["status"] == "Inactive"
    
    # 4. Clean up user
    response = client.delete(f"/api/v1/users/{user_id}", headers=admin_headers)
    assert response.status_code == 200
    
    # 5. Verify deleted user returns 404
    response = client.get(f"/api/v1/users/{user_id}", headers=admin_headers)
    assert response.status_code == 404

def test_department_crud(client):
    """Test department creation, updates, listing, and cascade effects on deletion."""
    admin_headers = get_auth_header(client, "admin@ecosphere.com", "AdminPass123")
    employee_headers = get_auth_header(client, "employee@ecosphere.com", "EmployeePass123")

    # 1. List departments (accessible to employees)
    res = client.get("/api/v1/departments", headers=employee_headers)
    assert res.status_code == 200
    initial_count = len(res.json()["data"])

    # 2. Create department
    dep_payload = {
        "name": "Compliance Audits",
        "code": "CMP",
        "head": "Marcus Aurelius"
    }
    res = client.post("/api/v1/departments", json=dep_payload, headers=admin_headers)
    assert res.status_code == 201
    dep_id = res.json()["data"]["id"]

    # Verify duplicate department code returns 409
    res = client.post("/api/v1/departments", json=dep_payload, headers=admin_headers)
    assert res.status_code == 409

    # 3. Assign a user to the new department
    user_payload = {
        "name": "Compliance Inspector",
        "email": "inspector@ecosphere.com",
        "password": "SecureInspector12!",
        "role": "Employee",
        "department": dep_id
    }
    res = client.post("/api/v1/users", json=user_payload, headers=admin_headers)
    assert res.status_code == 201
    user_id = res.json()["data"]["id"]
    assert res.json()["data"]["department"] == dep_id

    # 4. Delete department and test cascade cleanup in mock repository
    res = client.delete(f"/api/v1/departments/{dep_id}", headers=admin_headers)
    assert res.status_code == 200

    # Verify that the user's department is now set to None (cascade set-null logic)
    res = client.get(f"/api/v1/users/{user_id}", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["data"]["department"] is None

    # Clean up inspector user
    client.delete(f"/api/v1/users/{user_id}", headers=admin_headers)
