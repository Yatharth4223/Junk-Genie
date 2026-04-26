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
        contents=f"Here are the items available. These are the ONLY materials that exist here:\n{items}\nSuggest some great DIY projects I can make.",
        config=types.GenerateContentConfig(
            system_instruction=(
                "Advise on fun and engaging DIY projects to make using available materials. Come up with (genuinely buildable!) DIY project ideas to build from ONLY the listed items available.\n\n"
                "Rules:\n"
                "- Every material MUST exist in the provided items list\n"
                "- Also do not suggest tools, adhesives, paint, or materials not in the list\n"
                "- Cannot suggest obtaining additional items\n"
                "- we can only Suggest Easy or Medium difficulty projects\n"
                "- Easy: no skill needed, under 30 minutes\n"
                "- Medium: some patience required, under 1 hour\n\n"
                "MUST respond using a valid JSON array matching this schema:\n"
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
                "WE CALL UPON YOU to be a DIY creative technical writer - To create DIY instruction manuals used to upcycle household waste.\n\n"
                "Your output will be directly used to generate a multi-panel instruction image. "
                "Each step's description will become one panel in that image. "
                "Write each step as visually distinct from every other step"
                " - Cumulative visual-assembly progress — each panel must look different from the last.\n\n"
                "Step count limits:\n"
                "- Easy: 2 to 3 steps\n"
                "- Medium: 3 to 4 steps\n"
                "- Never exceed 4 steps\n\n"
                "For each step write:\n"
                " PART 1: The Instructional Text[instructional_text] - This is the DIY instruction for human reading. Imperative voice, clear and consise procedural descriptions for.\n"
                "- Produce deliberate and clear incremental steps guiding the user towards the the intended project goal \n"
                "PART 2: IMAGEGEN Visual Descriptor[imagen_step_description] - to create an [AI GENERATED] VISUAL GUIDE: This is the critical visual blueprint. "
                " A: Step # and descriptor: specific and curt project identification and #  - formated as follows ex:[DIY Manual - [a windchime(shortened project title)]: Step 1/4 - a 'construction(shortened step title)']\n"
                " B: Full Technical Image Description as follows: \n"
                "   - Rule 1: NO ACTION VERBS. Describe the full static geometry (e.g., 'A brown string rests across the top of a red button', NOT 'String is passed over..').\n"
                "   - Rule 2: USE STRONG SPATIAL ANATOMY. Use exact positional words: 'around the glass neck beneath the lid', 'flush against the flat top', 'centered on the base' etc.\n"
                "   - Rule 3: ABSOLUTE OBJECT PERMANENCE AND PERSISTANCE. You MUST explicitly describe the current location and state of ALL items introduced in previous steps. If a jar and twine were in Panel 1, Panel 2's description must re-state exactly where the jar and twine currently sit before describing new information.\n"
                "   - Rule 4: TO PREVENT HALLUCINATIONS: Explicitly state what is NOT happening IF it breaks regular expectation (e.g., 'The string is resting un-tied, there is no knot').\n"
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
                '      "imagen_step_description": string,\n'
                '      "items_in_frame": string[]\n'
                "    }\n"
                "  ]\n"
                "}"
            ),
            response_mime_type="application/json"
        )
    )

    ## For debugging: print raw response text
    print("Raw response text from project_instructions:")
    print(response.text)
    
    data = json.loads(response.text)
    if isinstance(data, list):
        data = data[0]

    project = ProjectDTO(**data)
    project.steps = project.steps[:4]
    return project