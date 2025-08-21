export type TabKey = "characters" | "locations" | "episodes";

export type PageMeta = { page: number; pages: number; count: number };

// берём поля, которые реально используем в UI (остальные RM API поля можно добавить позже)
export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
}
export interface Episode {
  id: number;
  name: string;
  episode: string;   // SxxExx
  air_date: string;  // ← это как раз то поле, которого не хватало
}

// дисриминированный union, совпадает с ответом бэка ({ kind, items } + заголовки-мета)
export type SearchResult =
  | { kind: "characters"; items: Character[]; meta: PageMeta }
  | { kind: "locations";  items: Location[];  meta: PageMeta }
  | { kind: "episodes";   items: Episode[];   meta: PageMeta };

export type UrlRef = { name: string; url: string };

export interface CharacterDetail {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: UrlRef;
  location: UrlRef;
  image: string;
  episode: string[]; // URLs
  url: string;
  created: string;
}

export interface LocationDetail {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[]; // URLs
  url: string;
  created: string;
}

export interface EpisodeDetail {
  id: number;
  name: string;
  air_date: string;
  episode: string;     // SxxExx
  characters: string[]; // URLs
  url: string;
  created: string;
}
