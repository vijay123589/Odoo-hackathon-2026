from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.environmental import EnvironmentalGoal

def calculate_environment_score(db: Session) -> float:
    """
    Calculate environmental score from database goals:
    - Base: 100
    - Deduct 5 points for each overdue active goal (deadline passed and status is "In Progress")
    - Deduct 3 points for every 100 units current exceeds target for active goals
    - Add 5 points for each achieved goal ("Completed"), capped at 100
    - Min 0, Max 100
    """
    score = 100.0
    now = datetime.now(timezone.utc)

    goals = db.query(EnvironmentalGoal).all()
    for goal in goals:
        status = goal.status
        
        if status == "In Progress":
            deadline = goal.deadline
            if deadline:
                if deadline.tzinfo is None:
                    deadline = deadline.replace(tzinfo=timezone.utc)
                if deadline < now:
                    score -= 5.0

            current = goal.current_value or 0.0
            target = goal.target_value or 0.0
            if current > target:
                excess = current - target
                score -= int(excess // 100) * 3

        elif status == "Completed":
            score += 5.0

    return max(0.0, min(100.0, score))
