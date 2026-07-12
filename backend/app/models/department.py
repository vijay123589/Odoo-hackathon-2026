import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class DepartmentORM(Base):
    __tablename__ = "departments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(150), 
        nullable=False
    )
    code: Mapped[str] = mapped_column(
        String(10), 
        unique=True, 
        nullable=False, 
        index=True
    )
    head: Mapped[str] = mapped_column(
        String(100), 
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

    # Relationships (resolved dynamically at runtime to prevent circular dependencies)
    users = relationship("UserORM", back_populates="department_relation")


# Original domain model class to preserve the service layer contracts
class Department:
    def __init__(
        self,
        id: str,
        name: str,
        code: str,
        head: str,
        status: str = "Active"
    ):
        self.id = id
        self.name = name
        self.code = code
        self.head = head
        self.status = status

    def to_dict(self) -> dict:
        """Convert domain model to dictionary format for storage."""
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "head": self.head,
            "status": self.status
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Department':
        """Load domain model from dictionary data."""
        return cls(
            id=data["id"],
            name=data["name"],
            code=data["code"],
            head=data["head"],
            status=data.get("status", "Active")
        )
