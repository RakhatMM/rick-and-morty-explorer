import httpx
from typing import Any, Dict, Optional

BASE = "https://rickandmortyapi.com/api"

async def fetch_rm(path: str, params: Optional[Dict[str, Any]] = None) -> dict:
    url = f"{BASE}/{path.lstrip('/')}"
    # аккуратные таймауты; один клиент на запрос (достаточно)
    async with httpx.AsyncClient(timeout=httpx.Timeout(10.0)) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()

def map_list_response(kind: str, data: dict) -> tuple[dict, dict]:
    """
    Преобразует стандартный ответ RM API к {kind, items} + мета (для заголовков).
    RM API для списков возвращает: { info: {count, pages, next, prev}, results: [...] }
    """
    info = data.get("info", {}) or {}
    results = data.get("results", []) or []
    items = results  # отдаем как есть (фронт рендерит карточки)
    meta = {
        "page": _infer_page_from_urls(info.get("next"), info.get("prev")),
        "pages": info.get("pages") or 1,
        "count": info.get("count") or len(items),
    }
    return {"kind": kind, "items": items}, meta

def _infer_page_from_urls(next_url: Optional[str], prev_url: Optional[str]) -> int:
    # простая эвристика: если есть prev — берём prev.page+1, иначе если есть next — next.page-1, иначе 1
    import urllib.parse as up
    def get_page(u: Optional[str]) -> Optional[int]:
        if not u: return None
        q = up.urlparse(u).query
        page = up.parse_qs(q).get("page", [None])[0]
        return int(page) if page and page.isdigit() else None
    prev_page = get_page(prev_url)
    next_page = get_page(next_url)
    if prev_page is not None:
        return prev_page + 1
    if next_page is not None:
        return max(next_page - 1, 1)
    return 1
