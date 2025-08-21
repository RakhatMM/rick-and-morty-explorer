import { Character } from "@/lib/types";
import { Link } from "react-router-dom";

export function CharacterCard({ c }: { c: Character }) {
  return (
    <Link
      to={`/characters/${c.id}`}
      className="block rounded-2xl border p-4 shadow-sm bg-white hover:shadow-md transition"
    >
      <img src={c.image} alt={c.name} className="rounded-xl w-full h-40 object-cover mb-3" />
      <div className="font-semibold">{c.name}</div>
      <div className="text-sm text-gray-600">
        {c.species} · {c.status}
      </div>
    </Link>
  );
}