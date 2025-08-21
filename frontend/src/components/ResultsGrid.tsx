import { SearchResult } from '@/lib/types'
import { CharacterCard } from './CharacterCard'
import { LocationCard } from './LocationCard'
import { EpisodeCard } from './EpisodeCard'
import { EmptyState } from './EmptyState'
import { SkeletonCard } from './SkeletonCard'

export function ResultsGrid({ result, isLoading }:{ result?: SearchResult; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }
  if (!result || result.items.length === 0) {
    return <EmptyState text="Ничего не найдено. Попробуйте другой запрос." />
  }

  if (result.kind === 'characters') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {result.items.map(c => <CharacterCard key={c.id} c={c} />)}
      </div>
    )
  }
  if (result.kind === 'locations') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {result.items.map(l => <LocationCard key={l.id} l={l} />)}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {result.items.map(e => <EpisodeCard key={e.id} e={e} />)}
    </div>
  )
}