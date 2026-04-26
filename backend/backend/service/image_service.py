from google import genai
from google.genai.types import GenerateContentConfig, Modality
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

# Always save to the repo-level `resources/` folder (not relative to cwd).
OUTPUT_DIR = Path(__file__).resolve().parents[3] / "resources"


def generate_image(contents: list) -> bytes:
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=contents,
        config=GenerateContentConfig(
            response_modalities=[Modality.IMAGE],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            return part.inline_data.data

    raise ValueError("No image returned in response")


def save_image(image_bytes: bytes, filename: str) -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUTPUT_DIR / filename
    path.write_bytes(image_bytes)
    return path