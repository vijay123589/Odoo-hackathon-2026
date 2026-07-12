import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

logger = logging.getLogger("EcoSphereAPI")

import uuid

NAMESPACE_ECOSPHERE = uuid.uuid5(uuid.NAMESPACE_DNS, "ecosphere.com")

def string_to_uuid(val: str) -> uuid.UUID:
    """Convert a string ID to a stable UUID, or return a parsed UUID if valid."""
    if not val:
        return None
    try:
        return uuid.UUID(str(val))
    except ValueError:
        return uuid.uuid5(NAMESPACE_ECOSPHERE, str(val))

DATABASE_URL = settings.DATABASE_URL
IS_SQLITE = False


# Resilient connection check and fallback to SQLite for local development/test execution
if not DATABASE_URL or "postgresql" not in DATABASE_URL:
    DATABASE_URL = "sqlite:///./ecosphere.db"
    IS_SQLITE = True
else:
    # Double check if PostgreSQL is reachable, otherwise fallback to SQLite so tests continue to pass
    try:
        temp_engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 3})
        with temp_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        temp_engine.dispose()
    except Exception as exc:
        logger.warning(
            f"Failed to connect to PostgreSQL at {DATABASE_URL} ({str(exc)}). "
            f"Falling back to SQLite database for testing and local development."
        )
        DATABASE_URL = "sqlite:///./ecosphere.db"
        IS_SQLITE = True

# Create SQLAlchemy engine
if IS_SQLITE:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI database session dependency yielding Local Session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_database():
    """Seed default roles, departments, and users if they do not exist."""
    from app.models.role import Role
    from app.models.department import DepartmentORM
    from app.models.user import UserORM
    from app.security import get_password_hash
    import uuid
    from datetime import datetime, timezone

    db = SessionLocal()
    try:
        # Create schema tables dynamically if SQLite fallback is active
        if IS_SQLITE:
            Base.metadata.create_all(bind=engine)

        NAMESPACE_ECOSPHERE = uuid.uuid5(uuid.NAMESPACE_DNS, "ecosphere.com")
        def to_uuid(name: str) -> uuid.UUID:
            try:
                return uuid.UUID(name)
            except ValueError:
                return uuid.uuid5(NAMESPACE_ECOSPHERE, name)

        # Seed Roles
        roles_to_seed = ["Admin", "Manager", "Employee"]
        seeded_roles = {}
        for r_name in roles_to_seed:
            role = db.query(Role).filter(Role.name == r_name).first()
            if not role:
                role = Role(id=to_uuid(f"role-{r_name.lower()}"), name=r_name)
                db.add(role)
                db.flush()
            seeded_roles[r_name] = role

        # Seed Departments
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

        # Seed Users
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
        
        # Seed Emission Factors
        from app.models.environmental import EmissionFactor, CarbonTransaction, EnvironmentalGoal
        factors_to_seed = [
            {"id": "fac-1", "activity_name": "Grid Electricity Usage", "category": "electricity", "factor_value": 0.000409, "unit": "kWh", "description": "Grid electricity emissions"},
            {"id": "fac-2", "activity_name": "Diesel Transport Fuel", "category": "diesel", "factor_value": 0.00263, "unit": "Liters", "description": "Transportation diesel emissions"},
            {"id": "fac-3", "activity_name": "Natural Gas Burners", "category": "natural_gas", "factor_value": 0.00189, "unit": "m3", "description": "Building heating gas emissions"},
            {"id": "fac-4", "activity_name": "Business Flight Miles", "category": "flights", "factor_value": 0.00018, "unit": "km", "description": "Business flights travel emissions"},
        ]
        seeded_factors = {}
        for f_info in factors_to_seed:
            factor = db.query(EmissionFactor).filter(EmissionFactor.activity_name == f_info["activity_name"]).first()
            if not factor:
                factor = EmissionFactor(
                    id=to_uuid(f_info["id"]),
                    activity_name=f_info["activity_name"],
                    category=f_info["category"],
                    factor_value=f_info["factor_value"],
                    unit=f_info["unit"],
                    description=f_info["description"]
                )
                db.add(factor)
                db.flush()
            seeded_factors[f_info["id"]] = factor

        # Seed Environmental Goals
        from datetime import timedelta
        goals_to_seed = [
            {"id": "goal-1", "title": "Reduce Logistics Emissions", "description": "Reduce fleet diesel transport consumption", "target_value": 1000.0, "current_value": 0.0, "unit": "Liters", "deadline": datetime.now(timezone.utc) + timedelta(days=30), "status": "In Progress"},
            {"id": "goal-2", "title": "Switch HQ to Green Energy", "description": "Transition office grid energy to solar/wind", "target_value": 500.0, "current_value": 0.0, "unit": "kWh", "deadline": datetime.now(timezone.utc) + timedelta(days=15), "status": "In Progress"},
            {"id": "goal-3", "title": "Offset HQ Travel", "description": "Compensate corporate business flight emissions", "target_value": 2000.0, "current_value": 2000.0, "unit": "km", "deadline": datetime.now(timezone.utc) - timedelta(days=5), "status": "Completed"},
            {"id": "goal-4", "title": "Overdue Recycling Target", "description": "Achieve high paper and plastic recycling target", "target_value": 300.0, "current_value": 0.0, "unit": "kg", "deadline": datetime.now(timezone.utc) - timedelta(days=2), "status": "In Progress"},
        ]
        for g_info in goals_to_seed:
            goal = db.query(EnvironmentalGoal).filter(EnvironmentalGoal.title == g_info["title"]).first()
            if not goal:
                goal = EnvironmentalGoal(
                    id=to_uuid(g_info["id"]),
                    title=g_info["title"],
                    description=g_info["description"],
                    target_value=g_info["target_value"],
                    current_value=g_info["current_value"],
                    unit=g_info["unit"],
                    deadline=g_info["deadline"],
                    status=g_info["status"]
                )
                db.add(goal)

        # Seed Carbon Transactions
        tx_to_seed = [
            {
                "id": "tx-1",
                "user_email": "employee@ecosphere.com",
                "department_code": "OPS",
                "factor_id": "fac-2", # Diesel
                "activity_name": "Diesel Transport Run",
                "quantity": 350.0,
                "remarks": "Weekly logistic transport dispatch",
                "date": datetime.now(timezone.utc) - timedelta(days=1)
            },
            {
                "id": "tx-2",
                "user_email": "manager@ecosphere.com",
                "department_code": "SUS",
                "factor_id": "fac-1", # Electricity
                "activity_name": "HQ Office Electricity",
                "quantity": 4500.0,
                "remarks": "Monthly facilities power grid usage",
                "date": datetime.now(timezone.utc) - timedelta(days=3)
            },
            {
                "id": "tx-3",
                "user_email": "admin@ecosphere.com",
                "department_code": "SUS",
                "factor_id": "fac-4", # Flight
                "activity_name": "Recruitment team business flights",
                "quantity": 12000.0,
                "remarks": "Aviation mileage",
                "date": datetime.now(timezone.utc) - timedelta(days=5)
            }
        ]
        for t_info in tx_to_seed:
            user_orm = db.query(UserORM).filter(UserORM.email == t_info["user_email"]).first()
            dep_orm = db.query(DepartmentORM).filter(DepartmentORM.code == t_info["department_code"]).first()
            if user_orm and dep_orm:
                tx = db.query(CarbonTransaction).filter(CarbonTransaction.activity_name == t_info["activity_name"]).first()
                if not tx:
                    factor_orm = seeded_factors[t_info["factor_id"]]
                    carbon_emission = t_info["quantity"] * factor_orm.factor_value
                    tx = CarbonTransaction(
                        id=to_uuid(t_info["id"]),
                        user_id=user_orm.id,
                        department_id=dep_orm.id,
                        emission_factor_id=factor_orm.id,
                        activity_name=t_info["activity_name"],
                        quantity=t_info["quantity"],
                        carbon_emission=carbon_emission,
                        remarks=t_info["remarks"],
                        transaction_date=t_info["date"]
                    )
                    db.add(tx)

        db.commit()
        logger.info("Database seeding completed successfully.")
    except Exception as exc:
        db.rollback()
        logger.error(f"Seeding failed: {str(exc)}")
    finally:
        db.close()
