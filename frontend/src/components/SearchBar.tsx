import { useEffect, useState } from 'react'

export function SearchBar({ value, onChange, placeholder }:{
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(id)
  }, [local])

  useEffect(() => setLocal(value), [value])

  return (
    <div className="w-full">
      <input
        className="w-full rounded-2xl border p-3 outline-none shadow-sm"
        value={local}
        onChange={e => setLocal(e.target.value)}
        placeholder={placeholder ?? 'Search...'}
      />
    </div>
  )
}