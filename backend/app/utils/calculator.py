from datetime import datetime, timezone
from app.database import ENVIRONMENTAL_GOALS_DB

def calculate_environment_score() -> float:
    """
    Calculate the environmental performance score:
    - Base score of 100
    - Deduct 5 points for each overdue active goal (deadline passed and status is "Active")
    - Deduct 3 points for every 100 kg CO2 that an active goal's current value exceeds its target value
    - Add 5 points for each achieved goal ("Achieved"), capped at 100
    - Minimum score is 0, maximum score is 100
    """
    score = 100.0
    now = datetime.now(timezone.utc)

    for goal in ENVIRONMENTAL_GOALS_DB.values():
        status = goal.get("status", "Active")
        
        if status == "Active":
            # 1. Overdue check
            deadline = goal.get("deadline")
            if deadline:
                # Ensure timezone awareness matches
                if deadline.tzinfo is None:
                    deadline = deadline.replace(tzinfo=timezone.utc)
                if deadline < now:
                    score -= 5.0

            # 2. Exceeded target check (-3 points per 100 kg CO2 above target)
            current = goal.get("current_value", 0.0)
            target = goal.get("target_value", 0.0)
            if current > target:
                excess = current - target
                score -= int(excess // 100) * 3

        elif status == "Achieved":
            # 3. Achieved goal bonus
            score += 5.0

    # Bounded limits: min 0, max 100
    return max(0.0, min(100.0, score))
