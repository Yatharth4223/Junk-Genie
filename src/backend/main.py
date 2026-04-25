import asyncio
from orchestration.pipeline import run_pipeline

asyncio.run(run_pipeline(
    items="Mason jar, Twine, Button", #add api call here instead of hardcoding items
    project_index=0,                  #
))