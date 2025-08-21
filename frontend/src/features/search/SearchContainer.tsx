// src/features/search/SearchContainer.tsx
import { useEffect, useState } from "react";
import { TabKey, SearchResult } from "@/lib/types";
// На Level 2 используем реальный бекенд
import { search } from "@/lib/apiClient";
import { Tabs } from "@/components/Tabs";
import { SearchBar } from "@/components/SearchBar";
import { ResultsSection } from "./ResultsSection";
import { Pagination } from "@/components/Pagination";

export function SearchContainer() {
  const [tab, setTab] = useState<TabKey>("characters");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | undefined>();

  // Сбрасываем страницу при смене таба или поискового запроса
  useEffect(() => {
    setPage(1);
  }, [tab, query]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await search(tab, query, page);
        if (!cancelled) setResult(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tab, query, page]);

  const pages = result?.meta.pages ?? 1;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <Tabs active={tab} onChange={setTab} />
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by name, species, episode..."
          />
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <ResultsSection tab={tab} isLoading={isLoading} result={result} />

      {pages > 1 && (
        <div className="mt-6">
          <Pagination page={page} pages={pages} onPage={setPage} />
        </div>
      )}
    </>
  );
}