from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Optional

T = TypeVar("T")

class BaseRepository(ABC, Generic[T]):
    
    @abstractmethod
    def get_by_id(self, id: str) -> Optional[T]:
        """Retrieve a single entity by its unique ID."""
        pass

    @abstractmethod
    def get_all(self) -> List[T]:
        """Retrieve all entities of this type."""
        pass

    @abstractmethod
    def create(self, entity: T) -> T:
        """Create a new entity in the datastore."""
        pass

    @abstractmethod
    def update(self, id: str, entity_data: dict) -> Optional[T]:
        """Update an existing entity with the provided dictionary data."""
        pass

    @abstractmethod
    def delete(self, id: str) -> bool:
        """Delete an entity by its unique ID. Returns True if successful, False otherwise."""
        pass
