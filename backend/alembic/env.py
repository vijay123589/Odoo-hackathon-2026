import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Add parent directory of 'alembic' directory to sys.path so python can resolve 'app'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import Base, DATABASE_URL, IS_SQLITE
from app.models.role import Role
from app.models.department import DepartmentORM
from app.models.user import UserORM
from app.models.environmental import EmissionFactor, CarbonTransaction, EnvironmentalGoal
from app.models.social import CSRActivity, EmployeeParticipation
from app.models.governance import Policy, PolicyAcknowledgement, Audit, ComplianceIssue
from app.models.gamification import Challenge, ChallengeParticipation, Badge, EmployeeBadge, Reward, RewardRedemption


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Dynamically inject the active DATABASE_URL from our database layer
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set model metadata for autogenerate detection
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # If using SQLite fallback, ensure we set check_same_thread=False inside connection config
    connect_args = {}
    if IS_SQLITE:
        connect_args["check_same_thread"] = False

    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args=connect_args if IS_SQLITE else None
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
