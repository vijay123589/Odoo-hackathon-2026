import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
import uuid

from app.main import app
from app.database import engine, SessionLocal, get_db
from app.models.role import Role
from app.models.department import DepartmentORM
from app.models.user import UserORM
from app.security import get_password_hash

def clean_database(db):
    """Clean all transactional tables (users, departments) while preserving roles lookup table."""
    dialect_name = db.bind.dialect.name
    try:
        if dialect_name == "postgresql":
            db.execute(text("TRUNCATE TABLE users, departments RESTART IDENTITY CASCADE;"))
        else:
            db.execute(text("DELETE FROM users;"))
            db.execute(text("DELETE FROM departments;"))
        db.commit()

    except Exception as exc:
        db.rollback()
        raise RuntimeError(f"Database cleanup failed: {str(exc)}") from exc

def seed_test_data(db):
    """Seed baseline roles, departments, and users dynamically within the transaction context."""
    try:
        NAMESPACE_ECOSPHERE = uuid.uuid5(uuid.NAMESPACE_DNS, "ecosphere.com")
        def to_uuid(name: str) -> uuid.UUID:
            try:
                return uuid.UUID(name)
            except ValueError:
                return uuid.uuid5(NAMESPACE_ECOSPHERE, name)

        # 1. Seed Roles
        roles_to_seed = ["Admin", "Manager", "Employee"]
        seeded_roles = {}
        for r_name in roles_to_seed:
            role = db.query(Role).filter(Role.name == r_name).first()
            if not role:
                role = Role(id=to_uuid(f"role-{r_name.lower()}"), name=r_name)
                db.add(role)
                db.flush()
            seeded_roles[r_name] = role

        # 2. Seed Departments
        deps_to_seed = [
            {"id": "dep-1", "name": "Sustainability & ESG", "code": "SUS", "head": "Jane Doe"},
            {"id": "dep-2", "name": "Operations & Logistics", "code": "OPS", "head": "John Smith"},
            {"id": "dep-3", "name": "Human Resources", "code": "HR", "head": "Alice Johnson"},
            {"id": "dep-it", "name": "Information Technology", "code": "IT", "head": "Head of IT"},
            {"id": "dep-fin", "name": "Finance & Accounting", "code": "FIN", "head": "Head of Finance"},
            {"id": "dep-mkt", "name": "Marketing & Communications", "code": "MKT", "head": "Head of Marketing"},
        ]
        seeded_deps = {}
        for d_info in deps_to_seed:
            dep = db.query(DepartmentORM).filter(DepartmentORM.code == d_info["code"]).first()
            if not dep:
                dep = DepartmentORM(
                    id=to_uuid(d_info["id"]),
                    name=d_info["name"],
                    code=d_info["code"],
                    head=d_info["head"],
                    status="Active"
                )
                db.add(dep)
                db.flush()
            seeded_deps[d_info["code"]] = dep

        # 3. Seed Users
        users_to_seed = [
            {
                "id": "usr-1",
                "name": "Global ESG Administrator",
                "email": "admin@ecosphere.com",
                "password_hash": get_password_hash("AdminPass123"),
                "role": "Admin",
                "department_code": "SUS",
                "status": "Active"
            },
            {
                "id": "usr-2",
                "name": "Sustainability Manager",
                "email": "manager@ecosphere.com",
                "password_hash": get_password_hash("ManagerPass123"),
                "role": "Manager",
                "department_code": "SUS",
                "status": "Active"
            },
            {
                "id": "usr-3",
                "name": "ESG Associate Employee",
                "email": "employee@ecosphere.com",
                "password_hash": get_password_hash("EmployeePass123"),
                "role": "Employee",
                "department_code": "OPS",
                "status": "Active"
            }
        ]
        for u_info in users_to_seed:
            user = db.query(UserORM).filter(UserORM.email == u_info["email"]).first()
            if not user:
                role = seeded_roles[u_info["role"]]
                dep = seeded_deps[u_info["department_code"]]
                user = UserORM(
                    id=to_uuid(u_info["id"]),
                    name=u_info["name"],
                    email=u_info["email"],
                    password_hash=u_info["password_hash"],
                    role_id=role.id,
                    department_id=dep.id,
                    status=u_info["status"]
                )
                db.add(user)
        
        db.commit()
    except Exception as exc:
        db.rollback()
        raise RuntimeError(f"Database seeding failed: {str(exc)}") from exc

@pytest.fixture(scope="function")
def db_session():
    """Create a database transaction, clean tables, seed data, and roll back changes upon test teardown."""
    connection = engine.connect()
    transaction = connection.begin()
    
    # Create session bound to the active transaction
    db = SessionLocal(bind=connection)
    
    clean_database(db)
    seed_test_data(db)
    
    yield db
    
    db.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function", autouse=True)
def override_db_dependency(db_session):
    """Override the FastAPI database dependency with the active transactional session."""
    def _get_db():
        yield db_session
        
    app.dependency_overrides[get_db] = _get_db
    yield
    app.dependency_overrides.pop(get_db, None)

@pytest.fixture(scope="function")
def client():
    """Provide a TestClient instance running within the app lifecycle context."""
    with TestClient(app) as test_client:
        yield test_client
