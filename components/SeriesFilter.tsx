'use client'

import { useEffect, useState } from 'react'
import { fetchSets } from '@/lib/tcgdex'

interface SerieCard {
  id: string
  name: string
  totalCards: number
  index: number
}

interface Props {
  onSelect: (serieId: string | null) => void
}

export default function SeriesFilter({ onSelect }: Props) {
  const [series, setSeries] = useState<SerieCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSets()
      .then((sets) => {
        const map = new Map<string, { name: string; total: number }>()
        sets.forEach((s) => {
          const id = s.serie?.id ?? 'other'
          const name = s.serie?.name ?? 'Other'
          const count = s.cardCount?.total ?? 0
          if (!map.has(id)) map.set(id, { name, total: 0 })
          map.get(id)!.total += count
        })
        const sorted = Array.from(map.entries())
          .sort(([, a], [, b]) => a.name.localeCompare(b.name))
          .map(([id, { name, total }], i) => ({ id, name, totalCards: total, index: i + 1 }))
        setSeries(sorted)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-on-surface-variant text-center py-20 animate-pulse text-label-md font-label-md uppercase tracking-widest">
        Loading series...
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      {/* All Cards — pinned at top */}
      <button
        onClick={() => onSelect(null)}
        className="group bg-primary text-on-primary border-[4px] border-on-background pixel-shadow pixel-button-active overflow-hidden"
      >
        <div className="bg-primary-container p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[32px] text-on-primary">auto_awesome</span>
            <div className="text-left">
              <h2 className="text-headline-sm font-headline-sm uppercase text-on-primary">All Cards</h2>
              <p className="text-label-sm font-label-sm text-on-primary opacity-80">
                ALL CARDS ACROSS ALL SERIES
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform text-on-primary">
            arrow_forward_ios
          </span>
        </div>
      </button>

      <div className="text-label-md font-label-md text-on-surface-variant uppercase border-b-2 border-on-background/20 pb-2">
        SELECT A SERIES
      </div>

      {/* Series grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((serie) => (
          <button
            key={serie.id}
            onClick={() => onSelect(serie.id)}
            className="bg-white border-[4px] border-on-background pixel-shadow-sm pixel-button-active hover:bg-surface-container-low transition-colors text-left flex flex-col overflow-hidden"
          >
            <div className="bg-primary px-4 py-2 border-b-[4px] border-on-background text-on-primary text-label-sm font-label-sm uppercase">
              SERIES {String(serie.index).padStart(2, '0')}
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-headline-sm font-headline-sm text-on-surface">
                {serie.name.toUpperCase()}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-label-md font-label-md text-secondary">
                  {serie.totalCards > 0 ? `${serie.totalCards} CARDS` : 'VIEW CARDS'}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant">play_circle</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
