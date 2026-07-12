from typing import Optional

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
