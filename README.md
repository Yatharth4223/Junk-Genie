Junk Genie

Junk Genie is an AI-powered upcycling web app that turns photos of junk, garbage, and household waste into buildable DIY craft ideas. It uses computer vision to identify materials, Gemma to generate project concepts, and a polished instruction flow to turn the user’s selected idea into a browser-friendly visual manual.

What it does
Upload a photo of unwanted materials, and Junk Genie tags the visible items, generates a set of realistic DIY upcycling ideas, and then expands the chosen idea into a step-by-step instructional guide. The final output is designed to be clear for humans and structured enough for visual generation, so each step can be rendered as a separate instruction panel.

This project was built as a hackathon prototype, so the emphasis is on a fun, fast, end-to-end experience rather than a fully finished production product.

Features
Photo-based junk input from the web app.

Material tagging with Google Cloud Vision / Imagen.

AI-generated DIY upcycling ideas using Gemma.

Buildable suggestions constrained to the materials actually available.

User-selectable project flow.

Polished instruction manual generation.

Image-ready step descriptions for browser display.

Easy and medium difficulty project ideas only.

How it works
The user uploads a photo of junk or scrap material.

The app detects and tags the visible objects.

Those tags are passed into Gemma as the only allowed materials.

Gemma returns 2 to 4 DIY project ideas ranked by how many materials they use.

The user selects one project.

Gemma generates a complete manual with title, difficulty, estimated time, parts list, and step-by-step instructions.

Each step includes a visual descriptor intended for multi-panel instruction images in the browser.

Tech stack
Frontend: React, built in Lovable.

Backend: Python.

API framework: FastAPI.

AI: Google Cloud Vision / Imagen for tagging, Gemma for idea generation and instruction writing.

Project type: Hackathon prototype.

Project structure
The codebase currently appears to be organized around a simple pipeline: a main entry point triggers the workflow, and a Gemini/Gemma service handles the model calls and response formatting. main.py currently runs the pipeline with hardcoded sample materials, which suggests the app is still in an integration/prototype stage rather than fully wired to live user uploads.

The model service is built around structured DTOs, which helps keep the AI output predictable and easier to render in the UI. The instruction-generation prompt is especially specialized, since it asks for static visual descriptions designed to support image panels rather than ordinary text alone.

Why it is useful
Junk Genie makes upcycling feel immediate and accessible. Instead of asking the user to plan a project first, it starts from what they already have on hand and turns waste into a creative direction.

That makes it useful for:

Hackathon demos.

Sustainability-focused tools.

Maker education.

Reuse and repair communities.

Fun creative browsing from random household junk.