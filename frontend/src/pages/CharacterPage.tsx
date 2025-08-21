import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getById } from "@/lib/apiClient";
import type { CharacterDetail, EpisodeDetail } from "@/lib/types";
import { idFromUrl, idsFromUrls } from "@/lib/urlId";

export default function CharacterPage() {
  const { id } = useParams();
  const [data, setData] = useState<CharacterDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // episode chips
  const [episodes, setEpisodes] = useState<EpisodeDetail[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        setError(null);
        setData(null);
        setEpisodes([]);
        setShowAll(false);
        const item = await getById("characters", Number(id));
        setData(item);
      } catch (e: any) {
        setError(e?.message || "Failed to load");
      }
    })();
  }, [id]);

  // вычисляем ids эпизодов
  const allEpisodeIds = useMemo(() => (data ? idsFromUrls(data.episode) : []), [data]);
  const visibleEpisodeIds = useMemo(
    () => (showAll ? allEpisodeIds : allEpisodeIds.slice(0, 20)),
    [allEpisodeIds, showAll]
  );

  // лениво подкачиваем детали видимых эпизодов
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (visibleEpisodeIds.length === 0) return;
      setLoadingEpisodes(true);
      try {
        const existing = new Map(episodes.map((e) => [e.id, e]));
        const need = visibleEpisodeIds.filter((eid) => !existing.has(eid));
        if (need.length) {
          const fetched = await Promise.all(need.map((eid) => getById("episodes", eid)));
          const merged = [...episodes, ...fetched].sort((a, b) => a.id - b.id);
          if (!cancelled) setEpisodes(merged);
        }
      } finally {
        if (!cancelled) setLoadingEpisodes(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visibleEpisodeIds]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <div className="p-6 text-red-600">Character not found</div>;
  if (!data) return <PageShell><div className="text-gray-500">Loading...</div></PageShell>;

  const originId = idFromUrl(data.origin?.url || "");
  const locationId = idFromUrl(data.location?.url || "");

  return (
    <PageShell>
      <Link to="/" className="text-sm underline">← Back</Link>

      <div className="flex flex-col sm:flex-row gap-6">
        <img src={data.image} alt={data.name} className="w-48 h-48 rounded-xl object-cover" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{data.name}</h1>
          <div className="text-gray-700">{data.species} · {data.status} · {data.gender}</div>
          {data.type && <div className="text-gray-600">Type: {data.type || "—"}</div>}
          <div className="text-gray-700">
            Origin: {originId ? (
              <Link className="underline" to={`/locations/${originId}`}>{data.origin.name}</Link>
            ) : (data.origin?.name || "—")}
          </div>
          <div className="text-gray-700">
            Last location: {locationId ? (
              <Link className="underline" to={`/locations/${locationId}`}>{data.location.name}</Link>
            ) : (data.location?.name || "—")}
          </div>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="font-semibold">Episodes ({allEpisodeIds.length})</h2>
        {visibleEpisodeIds.length === 0 ? (
          <div className="text-gray-500">No episodes</div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {visibleEpisodeIds.map((eid) => {
                const ep = episodes.find((e) => e.id === eid);
                return ep ? (
                  <Chip key={eid} to={`/episodes/${eid}`} title={`${ep.episode}`} subtitle={ep.name} />
                ) : (
                  <ChipSkeleton key={eid} />
                );
              })}
            </div>
            {allEpisodeIds.length > 20 && (
              <div>
                <button className="text-sm underline" onClick={() => setShowAll((v) => !v)}>
                  {showAll ? "Показать меньше" : `Показать все (${allEpisodeIds.length})`}
                </button>
              </div>
            )}
            {isLoadingEpisodes && <div className="text-xs text-gray-500">Loading episode details…</div>}
          </>
        )}
      </section>
    </PageShell>
  );
}

/** ——— UI helpers ——— */
function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="max-w-4xl mx-auto p-6 space-y-6">{children}</div>;
}

function Chip({ to, title, subtitle }: { to: string; title: string; subtitle?: string }) {
  return (
    <Link to={to} className="px-3 py-2 rounded-xl border bg-white shadow-sm hover:shadow transition text-sm">
      <div className="font-medium">{title}</div>
      {subtitle && <div className="text-xs text-gray-600">{subtitle}</div>}
    </Link>
  );
}
function ChipSkeleton() {
  return (
    <div className="px-3 py-2 rounded-xl border bg-white shadow-sm w-40 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-32" />
    </div>
  );
}
