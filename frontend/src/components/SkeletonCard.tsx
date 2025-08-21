export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border p-4 shadow-sm bg-white">
      <div className="h-40 w-full rounded-xl bg-gray-200 mb-3" />
      <div className="h-4 w-3/4 bg-gray-200 mb-2 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
    </div>
  )
}