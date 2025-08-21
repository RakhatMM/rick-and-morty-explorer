export function Pagination({ page, pages, onPage }:{ page: number; pages: number; onPage: (p: number) => void }) {
  return (
    <div className="flex gap-2 items-center">
      <button className="px-3 py-1 border rounded" disabled={page<=1} onClick={() => onPage(page-1)}>Prev</button>
      <span className="text-sm">{page} / {pages}</span>
      <button className="px-3 py-1 border rounded" disabled={page>=pages} onClick={() => onPage(page+1)}>Next</button>
    </div>
  )
}