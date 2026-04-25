from pathlib import Path
from google.genai import types
from models.dtos import ProjectDTO

STYLE_REFERENCE_PATH = Path("src/assets/guideForAi.png")


def get_manual_prompt(project: ProjectDTO) -> list:
    objects = "\n".join(
        f"{key}: {desc}"
        for key, desc in project.item_visual_descriptions.items()
    )

    panels = "\n".join(
        f"Panel {step.step_number} of {len(project.steps)}: {step.action_description_for_imagen}"
        for step in project.steps
    )

    prompt_text = (
        f"Flat vector illustration. White background. Bold black outlines. No text.\n\n"
        f"Objects:\n{objects}\n\n"
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