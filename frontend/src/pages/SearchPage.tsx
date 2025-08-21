import { SearchContainer } from '@/features/search/SearchContainer'

export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Rick & Morty Explorer</h1>
      <SearchContainer />
    </div>
  )
}