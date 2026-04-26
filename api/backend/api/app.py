from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import analyze, manual

app = FastAPI(title="JunkGenie API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prefix /api so the same public paths work behind Next rewrites in dev and on Vercel.
app.include_router(analyze.router, prefix="/api")
app.include_router(manual.router, prefix="/api")