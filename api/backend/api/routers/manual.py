import base64
import asyncio
from fastapi import APIRouter, HTTPException
from models.dtos import ManualRequest, ManualResponse
from service.gemma_service import project_instructions
from service.prompt_service import get_manual_prompt
from service.image_service import generate_image, save_image
from api.session import get_projects

router = APIRouter()


@router.post("/manual", response_model=ManualResponse)
async def manual(request: ManualRequest):
    try:
        projects = get_projects()

        if not projects:
            raise HTTPException(
                status_code=400,
                detail="No session found. Call /api/analyze first."
            )

        if request.project_index < 0 or request.project_index >= len(projects):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid project index. Valid range is 0 to {len(projects) - 1}."
            )

        selected = projects[request.project_index]

        loop = asyncio.get_event_loop()
        project = project_instructions(selected)
        contents = get_manual_prompt(project)
        image_bytes = await loop.run_in_executor(None, generate_image, contents)
        save_image(image_bytes, "manual.png")

        return ManualResponse(
            project=project,
            manual_image_base64=base64.b64encode(image_bytes).decode("utf-8"),
            instructions=[step.instruction_text for step in project.steps]
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))