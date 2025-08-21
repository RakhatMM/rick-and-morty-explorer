import { TabKey } from '@/lib/types'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'characters', label: 'Characters' },
  { key: 'locations',  label: 'Locations'  },
  { key: 'episodes',   label: 'Episodes'   },
]

export function Tabs({ active, onChange }:{ active: TabKey; onChange: (k: TabKey) => void }) {
  return (
    <div className="flex gap-2">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 rounded-full border shadow-sm ${active === t.key ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}