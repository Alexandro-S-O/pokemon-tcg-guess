'use client'

import { useEffect, useState } from 'react'
import { fetchSets } from '@/lib/tcgdex'
import { SetBrief } from '@/lib/types'

interface SeriesGroup {
  name: string
  sets: SetBrief[]
}

interface Props {
  onSelect: (setId: string | null) => void
}

export default function SeriesFilter({ onSelect }: Props) {
  const [groups, setGroups] = useState<SeriesGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSets()
      .then((sets) => {
        const map = new Map<string, SetBrief[]>()
        sets.forEach((s) => {
          const serieName = s.serie?.name ?? 'Other'
          if (!map.has(serieName)) map.set(serieName, [])
          map.get(serieName)!.push(s)
        })
        const sorted = Array.from(map.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name, sets]) => ({ name, sets }))
        setGroups(sorted)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-white/50 text-center py-20 animate-pulse">Loading series...</div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* All Cards */}
      <button
        onClick={() => onSelect(null)}
        className="w-full mb-8 px-6 py-4 rounded-xl bg-[#f5c518] text-black font-black text-lg
          hover:brightness-110 transition-all active:scale-95"
      >
        All Cards
      </button>

      {/* Series groups */}
      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <div key={group.name}>
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">{group.name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {group.sets.map((set) => (
                <button
                  key={set.id}
                  onClick={() => onSelect(set.id)}
                  className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                    hover:bg-white/10 hover:border-[#f5c518]/50 transition-all active:scale-95 text-left"
                >
                  <div className="font-semibold truncate">{set.name}</div>
                  {set.cardCount && (
                    <div className="text-white/40 text-xs mt-0.5">{set.cardCount.total} cards</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
