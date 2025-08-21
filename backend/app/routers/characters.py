# app/routers/characters.py
from fastapi import APIRouter, HTTPException, Response, Query
from ..services.rm_api import fetch_rm, map_list_response
import httpx

router = APIRouter(prefix="/characters", tags=["characters"])

@router.get("")  # список
async def list_characters(response: Response, q: str | None = None, page: int = 1):
    params = {"page": page}
    if q: params["name"] = q
    try:
        data = await fetch_rm("character", params)
        body, meta = map_list_response("characters", data)
        response.headers["X-Page"] = str(meta["page"])
        response.headers["X-Total-Pages"] = str(meta["pages"])
        response.headers["X-Total-Count"] = str(meta["count"])
        return body
    except httpx.HTTPStatusError as he:
        if he.response.status_code == 404:
            response.headers["X-Page"] = "1"
            response.headers["X-Total-Pages"] = "1"
            response.headers["X-Total-Count"] = "0"
            return {"kind": "characters", "items": []}
        raise HTTPException(status_code=he.response.status_code, detail=he.response.text)

@router.get("/{char_id}")  # ← деталь!
async def get_character(char_id: int):
    try:
        data = await fetch_rm(f"character/{char_id}")
        return data
    except httpx.HTTPStatusError as he:
        # пробрасываем реальный код R&M API (404 если нет такого id)
        raise HTTPException(status_code=he.response.status_code, detail=he.response.text)
