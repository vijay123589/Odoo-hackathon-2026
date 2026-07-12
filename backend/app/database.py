from typing import Dict, Any
from datetime import datetime, timezone
import sqlite3
import json
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "ecosphere.db"

def init_sqlite():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS carbon_transactions (
            id TEXT PRIMARY KEY,
            data TEXT
        )
    ''')
    conn.commit()
    
    cursor.execute('SELECT id, data FROM carbon_transactions')
    rows = cursor.fetchall()
    for row in rows:
        tx_id, tx_data_str = row
        tx_data = json.loads(tx_data_str)
        if isinstance(tx_data.get('date'), str):
            tx_data['date'] = datetime.fromisoformat(tx_data['date'].replace('Z', '+00:00'))
        CARBON_TRANSACTIONS_DB[tx_id] = tx_data
        
    conn.close()

def save_transaction_to_sqlite(tx_data):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    tx_data_copy = dict(tx_data)
    if isinstance(tx_data_copy.get('date'), datetime):
        tx_data_copy['date'] = tx_data_copy['date'].isoformat()
    cursor.execute('''
        INSERT OR REPLACE INTO carbon_transactions (id, data)
        VALUES (?, ?)
    ''', (tx_data['id'], json.dumps(tx_data_copy)))
    conn.commit()
    conn.close()

def delete_transaction_from_sqlite(tx_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM carbon_transactions WHERE id = ?', (tx_id,))
    conn.commit()
    conn.close()

# Thread-safe mockup dictionaries for global storage
USERS_DB: Dict[str, Dict[str, Any]] = {}
DEPARTMENTS_DB: Dict[str, Dict[str, Any]] = {}
EMISSION_FACTORS_DB: Dict[str, Dict[str, Any]] = {}
CARBON_TRANSACTIONS_DB: Dict[str, Dict[str, Any]] = {}
ENVIRONMENTAL_GOALS_DB: Dict[str, Dict[str, Any]] = {}

def seed_database():
    """Seed the in-memory database with initial departments, users, and environmental data."""
    from app.security import get_password_hash
    
    # Check if already seeded to avoid duplicates
    if USERS_DB or DEPARTMENTS_DB or EMISSION_FACTORS_DB or ENVIRONMENTAL_GOALS_DB:
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
            "password_hash": get_password_hash("password123"),
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

    # Seed Emission Factors
    factors = [
        {
            "id": "fac-1",
            "category": "Electricity",
            "factor": 0.85,
            "unit": "kWh",
            "description": "Grid electricity Scope 2 emissions"
        },
        {
            "id": "fac-2",
            "category": "Diesel",
            "factor": 2.68,
            "unit": "Liters",
            "description": "Transportation diesel Scope 1 emissions"
        },
        {
            "id": "fac-3",
            "category": "Natural Gas",
            "factor": 1.90,
            "unit": "m3",
            "description": "Building heating gas emissions"
        },
        {
            "id": "fac-4",
            "category": "Flight",
            "factor": 0.18,
            "unit": "km",
            "description": "Business flight Scope 3 travel emissions"
        }
    ]
    for fac in factors:
        EMISSION_FACTORS_DB[fac["id"]] = fac

    # Seed Environmental Goals
    from datetime import timedelta
    goals = [
        {
            "id": "goal-1",
            "title": "Reduce Logistics Emissions",
            "target_value": 1000.0,
            "current_value": 0.0,
            "deadline": datetime.now(timezone.utc) + timedelta(days=30),
            "status": "Active"
        },
        {
            "id": "goal-2",
            "title": "Switch HQ to Green Energy",
            "target_value": 500.0,
            "current_value": 0.0,
            "deadline": datetime.now(timezone.utc) + timedelta(days=15),
            "status": "Active"
        },
        {
            "id": "goal-3",
            "title": "Offset HQ Travel",
            "target_value": 2000.0,
            "current_value": 2000.0,
            "deadline": datetime.now(timezone.utc) - timedelta(days=5),
            "status": "Achieved"
        },
        {
            "id": "goal-4",
            "title": "Overdue Recycling Target",
            "target_value": 300.0,
            "current_value": 0.0,
            "deadline": datetime.now(timezone.utc) - timedelta(days=2),
            "status": "Active"
        }
    ]
    for goal in goals:
        ENVIRONMENTAL_GOALS_DB[goal["id"]] = goal

    init_sqlite()

    # Seed Carbon Transactions (Synthetic Data)
    if not CARBON_TRANSACTIONS_DB:
        transactions = [
        {
            "id": "tx-1",
            "department_id": "dep-2", # Operations & Logistics
            "emission_factor_id": "fac-2", # Diesel
            "activity_name": "Diesel Transport Run",
            "quantity": 350.0,
            "emission_value": 938.0, # 350.0 * 2.68
            "created_by": "employee@ecosphere.com",
            "date": datetime.now(timezone.utc) - timedelta(days=1)
        },
        {
            "id": "tx-2",
            "department_id": "dep-1", # Sustainability & ESG
            "emission_factor_id": "fac-1", # Electricity
            "activity_name": "HQ Office Electricity",
            "quantity": 4500.0,
            "emission_value": 3825.0, # 4500.0 * 0.85
            "created_by": "manager@ecosphere.com",
            "date": datetime.now(timezone.utc) - timedelta(days=3)
        },
        {
            "id": "tx-3",
            "department_id": "dep-3", # Human Resources
            "emission_factor_id": "fac-4", # Flight
            "activity_name": "Recruitment team business flights",
            "quantity": 12000.0,
            "emission_value": 2160.0, # 12000.0 * 0.18
            "created_by": "admin@ecosphere.com",
            "date": datetime.now(timezone.utc) - timedelta(days=5)
        },
        {
            "id": "tx-hist-1",
            "department_id": "dep-2",
            "emission_factor_id": "fac-2",
            "activity_name": "June transport runs",
            "quantity": 300.0,
            "emission_value": 804.0,
            "created_by": "employee@ecosphere.com",
            "date": datetime.now(timezone.utc) - timedelta(days=30)
        },
        {
            "id": "tx-hist-2",
            "department_id": "dep-1",
            "emission_factor_id": "fac-1",
            "activity_name": "June office electricity",
            "quantity": 4000.0,
            "emission_value": 3400.0,
            "created_by": "manager@ecosphere.com",
            "date": datetime.now(timezone.utc) - timedelta(days=35)
        },
        {
            "id": "tx-hist-3",
            "department_id": "dep-2",
            "emission_factor_id": "fac-2",
            "activity_name": "May transport runs",
            "quantity": 250.0,
            "emission_value": 670.0,
            "created_by": "employee@ecosphere.com",
            "date": datetime.now(timezone.utc) - timedelta(days=60)
        },
        {
            "id": "tx-hist-4",
            "department_id": "dep-1",
            "emission_factor_id": "fac-1",
            "activity_name": "May office electricity",
            "quantity": 3800.0,
            "emission_value": 3230.0,
            "created_by": "manager@ecosphere.com",
            "date": datetime.now(timezone.utc) - timedelta(days=65)
        }
    ]
        for tx in transactions:
            CARBON_TRANSACTIONS_DB[tx["id"]] = tx
            save_transaction_to_sqlite(tx)


