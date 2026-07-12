from datetime import datetime, timezone
from typing import Optional

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
