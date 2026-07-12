from typing import Dict, Any
from datetime import datetime, timezone

# Thread-safe mockup dictionaries for global storage
USERS_DB: Dict[str, Dict[str, Any]] = {}
DEPARTMENTS_DB: Dict[str, Dict[str, Any]] = {}

def seed_database():
    """Seed the in-memory database with initial departments and users with hashed passwords."""
    from app.security import get_password_hash
    
    # Check if already seeded to avoid duplicates
    if USERS_DB or DEPARTMENTS_DB:
        return
        
    # Seed Departments
    departments = [
        {
            "id": "dep-1",
            "name": "Sustainability & ESG",
            "code": "SUS",
            "head": "Jane Doe",
            "status": "Active"
        },
        {
            "id": "dep-2",
            "name": "Operations & Logistics",
            "code": "OPS",
            "head": "John Smith",
            "status": "Active"
        },
        {
            "id": "dep-3",
            "name": "Human Resources",
            "code": "HR",
            "head": "Alice Johnson",
            "status": "Active"
        }
    ]
    for dep in departments:
        DEPARTMENTS_DB[dep["id"]] = dep

    # Seed Users
    users = [
        {
            "id": "usr-1",
            "name": "Global ESG Administrator",
            "email": "admin@ecosphere.com",
            "password_hash": get_password_hash("AdminPass123"),
            "role": "Admin",
            "department": "dep-1",
            "status": "Active",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "usr-2",
            "name": "Sustainability Manager",
            "email": "manager@ecosphere.com",
            "password_hash": get_password_hash("ManagerPass123"),
            "role": "Manager",
            "department": "dep-1",
            "status": "Active",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "usr-3",
            "name": "ESG Associate Employee",
            "email": "employee@ecosphere.com",
            "password_hash": get_password_hash("EmployeePass123"),
            "role": "Employee",
            "department": "dep-2",
            "status": "Active",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    for user in users:
        USERS_DB[user["id"]] = user
