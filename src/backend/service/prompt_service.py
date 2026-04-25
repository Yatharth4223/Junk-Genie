from pathlib import Path
from google.genai import types
from models.dtos import ProjectDTO

STYLE_REFERENCE_PATH = Path("src/assets/guideForAi.png")


def get_manual_prompt(project: ProjectDTO) -> list:
    objects = "\n".join(
        f"{key}: {desc}"
        for key, desc in project.item_visual_descriptions.items()
    )

    panels = "\n\n---\n\n".join(
        f"GRID PANEL {step.step_number}: {step.action_description_for_imagen}"
        for step in project.steps
    )

    prompt_text = (
        f"A single image split evenly into a {len(project.steps)}-panel grid layout. "
        f"Instructional manual style. Flat vector illustration. Plain white background. Bold black outlines. No text or numbers.\n\n"
        f"GLOBAL ASSETS (Use these consistent designs across all panels):\n{objects}\n\n"
        f"PANEL BY PANEL DESCRIPTIONS:\n\n"
        f"{panels}"
    )

    contents = []

    if STYLE_REFERENCE_PATH.exists():
        contents.append(
            types.Part.from_bytes(
                data=STYLE_REFERENCE_PATH.read_bytes(),
                mime_type="image/png"
            )
        )
        contents.append(
            "Generate a new image in the exact same visual style as the reference above. "
            "Same line weight, same flat illustration style, same white background, same level of detail. "
            "Do not copy the content, only the style."
        )

    contents.append(prompt_text)
    return contents