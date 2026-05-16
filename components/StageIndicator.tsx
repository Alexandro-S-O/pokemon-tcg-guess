'use client'

import { Stage } from '@/lib/types'

interface Props {
  stage: Stage
}

export default function StageIndicator({ stage }: Props) {
  return (
    <div className="flex gap-4 mb-8">
      {([1, 2, 3, 4, 5] as Stage[]).map((s) => {
        const isPast = s < stage
        const isCurrent = s === stage
        return (
          <div key={s} className="flex flex-col items-center gap-1">
            <span
              className={`material-symbols-outlined text-2xl ${
                isPast || isCurrent ? 'heart-filled' : 'text-on-surface-variant opacity-20'
              } ${isCurrent ? 'pulse-active' : ''}`}
            >
              favorite
            </span>
            <span
              className={`text-label-sm font-label-sm uppercase ${
                isCurrent ? 'opacity-60' : 'opacity-40'
              }`}
            >
              S{s}
            </span>
          </div>
        )
      })}
    </div>
  )
}
