from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.models.gamification import Challenge, ChallengeParticipation, Badge, EmployeeBadge, Reward, RewardRedemption

class ChallengeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[Challenge]:
        return self.db.query(Challenge).filter(Challenge.id == id).first()

    def get_all(self) -> List[Challenge]:
        return self.db.query(Challenge).all()

    def create(self, entity: Challenge) -> Challenge:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[Challenge]:
        obj = self.get_by_id(id)
        if obj:
            for k, v in data.items():
                setattr(obj, k, v)
            self.db.commit()
            self.db.refresh(obj)
        return obj

    def delete(self, id: UUID) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False


class ChallengeParticipationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[ChallengeParticipation]:
        return self.db.query(ChallengeParticipation).filter(ChallengeParticipation.id == id).first()

    def get_all(self) -> List[ChallengeParticipation]:
        return self.db.query(ChallengeParticipation).all()

    def get_by_challenge_and_employee(self, challenge_id: UUID, employee_id: UUID) -> Optional[ChallengeParticipation]:
        return self.db.query(ChallengeParticipation).filter(
            ChallengeParticipation.challenge_id == challenge_id,
            ChallengeParticipation.employee_id == employee_id
        ).first()

    def create(self, entity: ChallengeParticipation) -> ChallengeParticipation:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[ChallengeParticipation]:
        obj = self.get_by_id(id)
        if obj:
            for k, v in data.items():
                setattr(obj, k, v)
            self.db.commit()
            self.db.refresh(obj)
        return obj

    def delete(self, id: UUID) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False


class BadgeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[Badge]:
        return self.db.query(Badge).filter(Badge.id == id).first()

    def get_all(self) -> List[Badge]:
        return self.db.query(Badge).all()

    def create(self, entity: Badge) -> Badge:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[Badge]:
        obj = self.get_by_id(id)
        if obj:
            for k, v in data.items():
                setattr(obj, k, v)
            self.db.commit()
            self.db.refresh(obj)
        return obj

    def delete(self, id: UUID) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False


class EmployeeBadgeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_ids(self, employee_id: UUID, badge_id: UUID) -> Optional[EmployeeBadge]:
        return self.db.query(EmployeeBadge).filter(
            EmployeeBadge.employee_id == employee_id,
            EmployeeBadge.badge_id == badge_id
        ).first()

    def get_all(self) -> List[EmployeeBadge]:
        return self.db.query(EmployeeBadge).all()

    def create(self, entity: EmployeeBadge) -> EmployeeBadge:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def delete(self, employee_id: UUID, badge_id: UUID) -> bool:
        obj = self.get_by_ids(employee_id, badge_id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False


class RewardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[Reward]:
        return self.db.query(Reward).filter(Reward.id == id).first()

    def get_all(self) -> List[Reward]:
        return self.db.query(Reward).all()

    def create(self, entity: Reward) -> Reward:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, id: UUID, data: dict) -> Optional[Reward]:
        obj = self.get_by_id(id)
        if obj:
            for k, v in data.items():
                setattr(obj, k, v)
            self.db.commit()
            self.db.refresh(obj)
        return obj

    def delete(self, id: UUID) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False


class RewardRedemptionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[RewardRedemption]:
        return self.db.query(RewardRedemption).filter(RewardRedemption.id == id).first()

    def get_all(self) -> List[RewardRedemption]:
        return self.db.query(RewardRedemption).all()

    def create(self, entity: RewardRedemption) -> RewardRedemption:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def delete(self, id: UUID) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False
