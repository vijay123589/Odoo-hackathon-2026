import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class UserORM(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(100), 
        nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(100), 
        unique=True, 
        nullable=False, 
        index=True
    )
    password_hash: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    department_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("departments.id", ondelete="SET NULL"), 
        nullable=True
    )
    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("roles.id"), 
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(20), 
        default="Active"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships (resolved dynamically at runtime to prevent circular dependencies)
    role_relation = relationship("Role", back_populates="users")
    department_relation = relationship("DepartmentORM", back_populates="users")


# Original domain model class to preserve the service layer contracts
class User:
    def __init__(
        self,
        id: str,
        name: str,
        email: str,
        password_hash: str,
        role: str,
        department: Optional[str] = None,
        status: str = "Active",
        created_at: Optional[datetime] = None
    ):
        self.id = id
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.department = department
        self.status = status
        self.created_at = created_at or datetime.now(timezone.utc)

    def to_dict(self) -> dict:
        """Convert domain model to dictionary format for storage."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "password_hash": self.password_hash,
            "role": self.role,
            "department": self.department,
            "status": self.status,
            "created_at": self.created_at
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'User':
        """Load domain model from dictionary data."""
        return cls(
            id=data["id"],
            name=data["name"],
            email=data["email"],
            password_hash=data["password_hash"],
            role=data["role"],
            department=data.get("department"),
            status=data.get("status", "Active"),
            created_at=data.get("created_at")
        )
