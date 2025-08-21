import { Location } from "@/lib/types";
import { Link } from "react-router-dom";

export function LocationCard({ l }: { l: Location }) {
  return (
    <Link
      to={`/locations/${l.id}`}
      className="block rounded-2xl border p-4 shadow-sm bg-white hover:shadow-md transition"
    >
      <div className="font-semibold">{l.name}</div>
      <div className="text-sm text-gray-600">
        {l.type} · {l.dimension}
      </div>
    </Link>
  );
}