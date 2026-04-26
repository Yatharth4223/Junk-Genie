from pydantic import BaseModel
from typing import Dict, List, Literal


class ResponseDTO(BaseModel):
    title: str
    tagline: str
    items_used: List[str]
    difficulty: str
    estimated_time: str


class StepDTO(BaseModel):
    step_number: int
    title: str
    instruction_text: str
    imagen_step_description: str
    items_in_frame: List[str]


class ProjectDTO(BaseModel):
    project_title: str
    difficulty: Literal["Easy", "Medium"]
    estimated_time: str
    parts_list: List[str]
    item_visual_descriptions: Dict[str, str]
    steps: List[StepDTO]


class AnalyzeRequest(BaseModel):
    vision_responses: List[dict]


class AnalyzeResponse(BaseModel):
    items: List[str]
    projects: List[ResponseDTO]


class ManualRequest(BaseModel):
    project_index: int


class ManualResponse(BaseModel):
    project: ProjectDTO
    manual_image_base64: str
    instructions: List[str]