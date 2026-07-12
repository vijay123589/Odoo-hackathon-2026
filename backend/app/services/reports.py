from sqlalchemy.orm import Session
from sqlalchemy import func
import logging

from app.models.environmental import CarbonTransaction, EnvironmentalGoal
from app.models.social import CSRActivity, EmployeeParticipation
from app.models.governance import Policy, PolicyAcknowledgement, Audit, ComplianceIssue
from app.models.user import UserORM

logger = logging.getLogger("EcoSphereAPI")

class ReportsService:
    def __init__(self, db: Session):
        self.db = db

    def get_environmental_report(self):
        """Aggregate carbon emissions and goal achievement levels."""
        # Sum of emissions
        total_emissions = self.db.query(func.sum(CarbonTransaction.carbon_emission)).scalar() or 0.0
        # Count of transactions
        total_tx = self.db.query(func.count(CarbonTransaction.id)).scalar() or 0
        
        # Count of goals
        total_goals = self.db.query(func.count(EnvironmentalGoal.id)).scalar() or 0
        active_goals = self.db.query(func.count(EnvironmentalGoal.id)).filter(EnvironmentalGoal.status == "In Progress").scalar() or 0
        completed_goals = self.db.query(func.count(EnvironmentalGoal.id)).filter(EnvironmentalGoal.status == "Completed").scalar() or 0
        
        goal_achievement_rate = (completed_goals / total_goals * 100.0) if total_goals > 0 else 100.0

        return {
            "total_carbon_emission": float(total_emissions),
            "total_transactions": total_tx,
            "active_goals_count": active_goals,
            "completed_goals_count": completed_goals,
            "goal_achievement_rate": float(goal_achievement_rate)
        }

    def get_social_report(self):
        """Aggregate CSR activity details and employee volunteerism indices."""
        total_csr = self.db.query(func.count(CSRActivity.id)).scalar() or 0
        total_part = self.db.query(func.count(EmployeeParticipation.id)).scalar() or 0
        approved_part = self.db.query(func.count(EmployeeParticipation.id)).filter(EmployeeParticipation.approval_status == "Approved").scalar() or 0
        total_points = self.db.query(func.sum(EmployeeParticipation.points_earned)).scalar() or 0

        # Unique employees who volunteered
        volunteers_count = self.db.query(func.count(func.distinct(EmployeeParticipation.employee_id))).scalar() or 0
        total_employees = self.db.query(func.count(UserORM.id)).filter(UserORM.status == "Active").scalar() or 1
        
        participation_rate = (volunteers_count / total_employees * 100.0)

        return {
            "total_csr_activities": total_csr,
            "total_participation_count": total_part,
            "total_approved_participations": approved_part,
            "total_volunteer_points_earned": int(total_points),
            "volunteer_participation_rate": float(min(100.0, participation_rate))
        }

    def get_governance_report(self):
        """Aggregate policy distribution coverages and audit outcomes."""
        total_policies = self.db.query(func.count(Policy.id)).scalar() or 0
        total_acks = self.db.query(func.count(PolicyAcknowledgement.id)).scalar() or 0
        total_employees = self.db.query(func.count(UserORM.id)).filter(UserORM.status == "Active").scalar() or 1

        # Acknowledgement coverage rate: total acknowledgements / (policies * employees)
        possible_acks = total_policies * total_employees
        ack_compliance_rate = (total_acks / possible_acks * 100.0) if possible_acks > 0 else 100.0

        total_audits = self.db.query(func.count(Audit.id)).scalar() or 0
        open_issues = self.db.query(func.count(ComplianceIssue.id)).filter(ComplianceIssue.status == "Open").scalar() or 0
        resolved_issues = self.db.query(func.count(ComplianceIssue.id)).filter(ComplianceIssue.status == "Resolved").scalar() or 0

        return {
            "total_policies_count": total_policies,
            "total_acknowledgements_count": total_acks,
            "acknowledgement_compliance_rate": float(min(100.0, ack_compliance_rate)),
            "total_audits_count": total_audits,
            "open_compliance_issues": open_issues,
            "resolved_compliance_issues": resolved_issues
        }

    def get_esg_score_report(self):
        """Calculate composite index scoring out of 100 for each ESG pillar."""
        # 1. Environmental: based on goal completion rate
        env_rep = self.get_environmental_report()
        env_score = env_rep["goal_achievement_rate"]

        # 2. Social: based on employee participation rate
        soc_rep = self.get_social_report()
        soc_score = soc_rep["volunteer_participation_rate"]

        # 3. Governance: based on acknowledgement coverage and resolved compliance issues
        gov_rep = self.get_governance_report()
        ack_rate = gov_rep["acknowledgement_compliance_rate"]
        
        resolved = gov_rep["resolved_compliance_issues"]
        open_iss = gov_rep["open_compliance_issues"]
        total_iss = resolved + open_iss
        issue_resolution_rate = (resolved / total_iss * 100.0) if total_iss > 0 else 100.0
        
        gov_score = (ack_rate + issue_resolution_rate) / 2.0

        # Composite score
        composite = (env_score + soc_score + gov_score) / 3.0

        return {
            "environmental_score": round(env_score, 2),
            "social_score": round(soc_score, 2),
            "governance_score": round(gov_score, 2),
            "composite_esg_score": round(composite, 2)
        }
