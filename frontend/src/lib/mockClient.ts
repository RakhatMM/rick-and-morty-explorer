import { TabKey, SearchResult } from './types'

const mockDB = {
  characters: [
    { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg' },
    { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg' },
    { id: 3, name: 'Summer Smith', status: 'Alive', species: 'Human', image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg' },
  ],
  locations: [
    { id: 1, name: 'Earth (C-137)', type: 'Planet', dimension: 'C-137' },
    { id: 2, name: 'Abadango', type: 'Cluster', dimension: 'Unknown' },
  ],
  episodes: [
    { id: 1, name: 'Pilot', episode: 'S01E01', air_date: 'December 2, 2013' },
    { id: 2, name: 'Lawnmower Dog', episode: 'S01E02', air_date: 'December 9, 2013' },
  ],
}

export async function search(kind: TabKey, query: string): Promise<SearchResult> {
  await new Promise(r => setTimeout(r, 500))
  const q = query.toLowerCase().trim()
  const filterBy = (s: string) => s.toLowerCase().includes(q)

  if (kind === 'characters') {
    const items = mockDB.characters.filter(
      c => !q || filterBy(c.name) || filterBy(c.species) || filterBy(c.status)
    )
    return { kind, items }
  }
  if (kind === 'locations') {
    const items = mockDB.locations.filter(
      l => !q || filterBy(l.name) || filterBy(l.type) || filterBy(l.dimension)
    )
    return { kind, items }
  }
  const items = mockDB.episodes.filter(
    e => !q || filterBy(e.name) || filterBy(e.episode) || filterBy(e.air_date)
  )
  return { kind, items }
}