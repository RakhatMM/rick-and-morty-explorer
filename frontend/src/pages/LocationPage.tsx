import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getById } from "@/lib/apiClient";
import type { LocationDetail, CharacterDetail } from "@/lib/types";
import { idsFromUrls } from "@/lib/urlId";

export default function LocationPage() {
  const { id } = useParams();
  const [data, setData] = useState<LocationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [residents, setResidents] = useState<CharacterDetail[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        setError(null);
        setData(null);
        setResidents([]);
        setShowAll(false);
        const item = await getById("locations", Number(id));
        setData(item);
      } catch (e: any) {
        setError(e?.message || "Failed to load");
      }
    })();
  }, [id]);

  const allCharIds = useMemo(() => (data ? idsFromUrls(data.residents) : []), [data]);
  const visibleCharIds = useMemo(
    () => (showAll ? allCharIds : allCharIds.slice(0, 24)),
    [allCharIds, showAll]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (visibleCharIds.length === 0) return;
      setLoading(true);
      try {
        const existing = new Map(residents.map((c) => [c.id, c]));
        const need = visibleCharIds.filter((cid) => !existing.has(cid));
        if (need.length) {
          const fetched = await Promise.all(need.map((cid) => getById("characters", cid)));
          const merged = [...residents, ...fetched].sort((a, b) => a.id - b.id);
          if (!cancelled) setResidents(merged);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visibleCharIds]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <div className="p-6 text-red-600">Location not found</div>;
  if (!data) return <PageShell><div className="text-gray-500">Loading...</div></PageShell>;

  return (
    <PageShell>
      <Link to="/" className="text-sm underline">← Back</Link>

      <div>
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <div className="text-gray-700">{data.type} · {data.dimension}</div>
      </div>

      <section className="space-y-2">
        <h2 className="font-semibold">Residents ({allCharIds.length})</h2>
        {visibleCharIds.length === 0 ? (
          <div className="text-gray-500">No residents</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {visibleCharIds.map((cid) => {
                const c = residents.find((x) => x.id === cid);
                return c ? (
                  <AvatarCard key={cid} to={`/characters/${cid}`} title={c.name} image={c.image} subtitle={`${c.species} · ${c.status}`} />
                ) : (
                  <AvatarCardSkeleton key={cid} />
                );
              })}
            </div>
            {allCharIds.length > 24 && (
              <div>
                <button className="text-sm underline" onClick={() => setShowAll((v) => !v)}>
                  {showAll ? "Показать меньше" : `Показать все (${allCharIds.length})`}
                </button>
              </div>
            )}
            {isLoading && <div className="text-xs text-gray-500">Loading residents…</div>}
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

function AvatarCard({ to, title, image, subtitle }: { to: string; title: string; image?: string; subtitle?: string }) {
  return (
    <Link to={to} className="rounded-2xl border bg-white shadow-sm hover:shadow transition p-3 block">
      <div className="w-full aspect-square rounded-xl bg-gray-100 overflow-hidden mb-2">
        {image ? <img src={image} alt={title} className="w-full h-full object-cover" /> : null}
      </div>
      <div className="font-medium text-sm line-clamp-2">{title}</div>
      {subtitle && <div className="text-xs text-gray-600">{subtitle}</div>}
    </Link>
  );
}
function AvatarCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-3 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-200 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
