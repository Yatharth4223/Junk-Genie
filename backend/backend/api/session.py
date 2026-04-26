from models.dtos import ResponseDTO
from typing import List

current_session: dict = {
    "items": [],
    "projects": []
}


def save_session(items: List[str], projects: List[ResponseDTO]):
    current_session["items"] = items
    current_session["projects"] = projects


def get_projects() -> List[ResponseDTO]:
    return current_session["projects"]