import { Episode } from "@/lib/types";
import { Link } from "react-router-dom";

export function EpisodeCard({ e }: { e: Episode }) {
  return (
    <Link
      to={`/episodes/${e.id}`}
      className="block rounded-2xl border p-4 shadow-sm bg-white hover:shadow-md transition"
    >
      <div className="font-semibold">{e.name}</div>
      <div className="text-sm text-gray-600">{e.episode}</div>
      <div className="text-xs text-gray-500">{e.air_date}</div>
    </Link>
  );
}
