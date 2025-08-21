from fastapi import APIRouter, HTTPException, Response, Query
from ..services.rm_api import fetch_rm, map_list_response
import httpx

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("")
async def list_locations(response: Response, q: str | None = Query(default=None), page: int = 1):
    params = {"page": page}
    if q:
        params["name"] = q
    try:
        data = await fetch_rm("location", params)
        body, meta = map_list_response("locations", data)
        response.headers["X-Page"] = str(meta["page"])
        response.headers["X-Total-Pages"] = str(meta["pages"])
        response.headers["X-Total-Count"] = str(meta["count"])
        return body
    except httpx.HTTPStatusError as he:
        if he.response.status_code == 404:
            response.headers["X-Page"] = "1"
            response.headers["X-Total-Pages"] = "1"
            response.headers["X-Total-Count"] = "0"
            return {"kind": "locations", "items": []}
        raise HTTPException(status_code=he.response.status_code, detail=he.response.text)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Upstream error: {e}")

@router.get("/{loc_id}")
async def get_location(loc_id: int):
    try:
        data = await fetch_rm(f"location/{loc_id}")
        return data
    except httpx.HTTPStatusError as he:
        # Пробрасываем реальный код Rick&Morty API (404 если нет такого id)
        raise HTTPException(status_code=he.response.status_code, detail=he.response.text)
