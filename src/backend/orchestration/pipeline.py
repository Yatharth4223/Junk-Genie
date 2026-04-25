import asyncio
from service.gemma_service import possible_projects, project_instructions
from service.image_service import generate_image, save_image
from service.prompt_service import get_manual_prompt


async def run_pipeline(items: str, project_index: int = 0) -> None:
    loop = asyncio.get_event_loop()

    print("Pipeline 1: Generating project ideas")
    projects = possible_projects(items)
    for i, p in enumerate(projects, 1):
        print(f"  {i}. {p.title} ({p.difficulty}) - {p.tagline}")

    print(f"\nPipeline 2: Generating instructions for project {project_index + 1}")
    project = project_instructions(projects[project_index])
    print(f"  Project:    {project.project_title}")
    print(f"  Difficulty: {project.difficulty}")
    print(f"  Steps:      {len(project.steps)}")

    print("\nBuilding manual prompt")
    contents = get_manual_prompt(project)

    print("\nPipeline 3: Generating manual image")
    image_bytes = await loop.run_in_executor(None, generate_image, contents)
    path = save_image(image_bytes, "assets/manual.png")
    print(f"  Saved: {path}")

    print("\nInstructions")
    for step in project.steps:
        print(f"  {step.step_number}. {step.instruction_text}")