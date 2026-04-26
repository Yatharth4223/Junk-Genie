from fastapi import APIRouter, HTTPException
from models.dtos import AnalyzeRequest, AnalyzeResponse
from utils.vision_parser import extract_items_from_responses
from service.gemma_service import possible_projects
from api.session import save_session

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    try:
        items = extract_items_from_responses(request.vision_responses)

        if not items:
            raise HTTPException(
                status_code=422,
                detail="Could not identify any items from the provided images."
            )

        projects = possible_projects(", ".join(items))
        save_session(items, projects)

        return AnalyzeResponse(items=items, projects=projects)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))