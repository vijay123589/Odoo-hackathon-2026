from typing import List, Optional
from app.models.user import User
from app.repositories.base import BaseRepository
from app.database import USERS_DB

class UserRepository(BaseRepository[User]):
    
    def get_by_id(self, id: str) -> Optional[User]:
        user_dict = USERS_DB.get(id)
        if not user_dict:
            return None
        return User.from_dict(user_dict)

    def get_by_email(self, email: str) -> Optional[User]:
        for user_dict in USERS_DB.values():
            if user_dict["email"].lower() == email.lower():
                return User.from_dict(user_dict)
        return None

    def get_all(self) -> List[User]:
        return [User.from_dict(u) for u in USERS_DB.values()]

    def create(self, entity: User) -> User:
        USERS_DB[entity.id] = entity.to_dict()
        return entity

    def update(self, id: str, entity_data: dict) -> Optional[User]:
        user_dict = USERS_DB.get(id)
        if not user_dict:
            return None
        # Apply updates
        for key, val in entity_data.items():
            user_dict[key] = val
        USERS_DB[id] = user_dict
        return User.from_dict(user_dict)

    def delete(self, id: str) -> bool:
        if id in USERS_DB:
            del USERS_DB[id]
            return True
        return False
