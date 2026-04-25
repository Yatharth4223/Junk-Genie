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
    action_description_for_imagen: str
    items_in_frame: List[str]


class ProjectDTO(BaseModel):
    project_title: str
    difficulty: Literal["Easy", "Medium"]
    estimated_time: str
    parts_list: List[str]
    item_visual_descriptions: Dict[str, str]
    steps: List[StepDTO]