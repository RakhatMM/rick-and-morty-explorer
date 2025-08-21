from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import characters, locations, episodes
import os

app = FastAPI(title="Rick & Morty Backend", version="1.0.0")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://rick-and-morty-explorer-klat.vercel.app"
]

EXPOSED = ["X-Page", "X-Total-Pages", "X-Total-Count"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,   # можно оставить True; главное — список, а не "*"
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=EXPOSED,
)

app.include_router(characters.router)
app.include_router(locations.router)
app.include_router(episodes.router)

@app.get("/")
def root():
    return {"ok": True, "service": "rick-and-morty-backend"}
