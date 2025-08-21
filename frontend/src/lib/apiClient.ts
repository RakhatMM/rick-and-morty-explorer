import { TabKey, SearchResult, PageMeta } from "./types";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function readMeta(h: Headers): PageMeta {
  return {
    page: Number(h.get("X-Page") || 1),
    pages: Number(h.get("X-Total-Pages") || 1),
    count: Number(h.get("X-Total-Count") || 0),
  };
}

export async function search(kind: TabKey, query: string, page = 1): Promise<SearchResult> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("page", String(page));

  const url = `${BASE}/${kind}?${params.toString()}`;
  console.debug("API GET:", url); // временно, для диагностики
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}`);
  const body = await res.json();
  const meta = readMeta(res.headers);
  return { ...body, meta };
}

export async function getById(kind: TabKey, id: number) {
  const url = `${BASE}/${kind}/${id}`;
  console.debug("API GET:", url); // временно, для диагностики
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return await res.json();
}
