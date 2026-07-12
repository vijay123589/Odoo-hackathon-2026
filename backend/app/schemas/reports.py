from pydantic import BaseModel

class EnvironmentalReportResponse(BaseModel):
    total_carbon_emission: float
    total_transactions: int
    active_goals_count: int
    completed_goals_count: int
    goal_achievement_rate: float  # Percentage of goals met

class SocialReportResponse(BaseModel):
    total_csr_activities: int
    total_participation_count: int
    total_approved_participations: int
    total_volunteer_points_earned: int
    volunteer_participation_rate: float  # Percentage of users who participated

class GovernanceReportResponse(BaseModel):
    total_policies_count: int
    total_acknowledgements_count: int
    acknowledgement_compliance_rate: float  # Percentage of policy coverages
    total_audits_count: int
    open_compliance_issues: int
    resolved_compliance_issues: int

class ESGScoreReportResponse(BaseModel):
    environmental_score: float  # Out of 100
    social_score: float         # Out of 100
    governance_score: float     # Out of 100
    composite_esg_score: float  # Out of 100
