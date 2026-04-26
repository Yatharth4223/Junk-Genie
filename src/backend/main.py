import asyncio
from orchestration.pipeline import run_pipeline

asyncio.run(run_pipeline(
    items="Paper cup, BBQ skewers, Plastic straw, Clear tape", #add api call here instead of hardcoding items
    project_index=0,                  #
))