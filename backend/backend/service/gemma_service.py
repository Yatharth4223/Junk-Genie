from google import genai
from google.genai import types
from models.dtos import ResponseDTO, ProjectDTO
import json
import os
from dotenv import load_dotenv

load_dotenv()

TEXT_MODEL = "gemma-4-26b-a4b-it"


def possible_projects(items: str) -> list[ResponseDTO]:
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=f"Here are the items available. These are the ONLY materials that exist:\n{items}\nSuggest DIY projects using only these items.",
        config=types.GenerateContentConfig(
            system_instruction=(
                "You are a creative DIY project advisor. Suggest genuinely buildable DIY projects using ONLY the provided items.\n\n"
                "Rules:\n"
                "- Every material MUST exist in the provided items list\n"
                "- Do not suggest tools, adhesives, paint, or materials not in the list\n"
                "- Do not suggest buying anything\n"
                "- Only suggest Easy or Medium difficulty\n"
                "- Easy: no skill needed, under 30 minutes\n"
                "- Medium: some patience required, under 1 hour\n\n"
                "Respond ONLY with a valid JSON array matching this schema:\n"
                "[\n"
                "  {\n"
                '    "title": string,\n'
                '    "tagline": string,\n'
                '    "items_used": string[],\n'
                '    "difficulty": "Easy" | "Medium",\n'
                '    "estimated_time": string\n'
                "  }\n"
                "]\n\n"
                "Return 2 to 4 ideas ranked by how many provided items they use."
            ),
            response_mime_type="application/json"
        )
    )

    data = json.loads(response.text)
    return [ResponseDTO(**item) for item in data]


def project_instructions(project_data: ResponseDTO) -> ProjectDTO:
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=(
            f"Project: {project_data.title}\n"
            f"Difficulty: {project_data.difficulty}\n"
            f"Items: {project_data.items_used}\n"
            "Generate the complete instruction set."
        ),
        config=types.GenerateContentConfig(
            system_instruction=(
                "You are a technical writer creating DIY instruction manuals.\n\n"
                "Your output will be used to generate a multi-panel instruction image. "
                "Each step's action_description_for_imagen will become one panel in that image. "
                "Write each description so it is visually distinct from every other step and shows "
                "cumulative assembly progress — each panel must look different from the previous one.\n\n"
                "Step count limits:\n"
                "- Easy: 2 to 3 steps\n"
                "- Medium: 3 to 4 steps\n"
                "- Never exceed 4 steps\n\n"
                "For each step write:\n"
                "1. instruction_text: what the human reads. Imperative voice.\n"
                "2. action_description_for_imagen: This is the critical visual blueprint. "
                "   - Rule 1: NO ACTION VERBS. Describe purely static geometry (e.g., 'A brown string is resting across the top of a red button', NOT 'String is passed through').\n"
                "   - Rule 2: STRICT SPATIAL ANATOMY. Use exact positional words: 'around the glass neck beneath the lid', 'flush against the flat top', 'centered on the base'.\n"
                "   - Rule 3: ABSOLUTE OBJECT PERMANENCE. You MUST explicitly describe the current location of ALL items introduced in previous steps. If a jar and twine were in Panel 1, Panel 2's description must re-state exactly where the jar and twine currently sit before describing the new button.\n"
                "   - Rule 4: PREVENT HALLUCINATIONS. Explicitly state what is NOT happening if it breaks expectations (e.g., 'The string is resting un-tied, there is no knot').\n"
                "Respond ONLY with valid JSON matching this schema:\n"
                "{\n"
                '  "project_title": string,\n'
                '  "difficulty": "Easy" | "Medium",\n'
                '  "estimated_time": string,\n'
                '  "parts_list": string[],\n'
                '  "item_visual_descriptions": { [item_key: string]: string },\n'
                '  "steps": [\n'
                "    {\n"
                '      "step_number": integer,\n'
                '      "title": string,\n'
                '      "instruction_text": string,\n'
                '      "action_description_for_imagen": string,\n'
                '      "items_in_frame": string[]\n'
                "    }\n"
                "  ]\n"
                "}"
            ),
            response_mime_type="application/json"
        )
    )

    data = json.loads(response.text)
    if isinstance(data, list):
        data = data[0]

    project = ProjectDTO(**data)
    project.steps = project.steps[:4]
    return project