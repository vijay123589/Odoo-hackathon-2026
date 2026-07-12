from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.common import APIResponse
from app.schemas.reports import (
    EnvironmentalReportResponse,
    SocialReportResponse,
    GovernanceReportResponse,
    ESGScoreReportResponse
)
from app.services.reports import ReportsService
from app.dependencies import get_current_user
from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["ESG Analytics"])

def get_reports_service(db: Session = Depends(get_db)) -> ReportsService:
    return ReportsService(db)

@router.get(
    "/environment",
    response_model=APIResponse[EnvironmentalReportResponse],
    summary="Environmental Analytics Report",
    description="Retrieve aggregated metrics on carbon transactions and goal completion rates."
)
async def get_environmental_report(
    service: ReportsService = Depends(get_reports_service),
    current_user: User = Depends(get_current_user)
):
    data = service.get_environmental_report()
    return APIResponse(success=True, message="Environmental analytics calculated successfully", data=data)

@router.get(
    "/social",
    response_model=APIResponse[SocialReportResponse],
    summary="Social Analytics Report",
    description="Retrieve aggregated metrics on CSR activities, volunteer hours, and engagement indices."
)
async def get_social_report(
    service: ReportsService = Depends(get_reports_service),
    current_user: User = Depends(get_current_user)
):
    data = service.get_social_report()
    return APIResponse(success=True, message="Social analytics calculated successfully", data=data)

@router.get(
    "/governance",
    response_model=APIResponse[GovernanceReportResponse],
    summary="Governance Analytics Report",
    description="Retrieve aggregated metrics on corporate policies, sign-off completion, and audits."
)
async def get_governance_report(
    service: ReportsService = Depends(get_reports_service),
    current_user: User = Depends(get_current_user)
):
    data = service.get_governance_report()
    return APIResponse(success=True, message="Governance analytics calculated successfully", data=data)

@router.get(
    "/esg-score",
    response_model=APIResponse[ESGScoreReportResponse],
    summary="Composite ESG Score Assessment",
    description="Get the composite ESG performance indices graded out of 100 for each sustainability pillar."
)
async def get_esg_score_report(
    service: ReportsService = Depends(get_reports_service),
    current_user: User = Depends(get_current_user)
):
    data = service.get_esg_score_report()
    return APIResponse(success=True, message="ESG performance score graded successfully", data=data)
