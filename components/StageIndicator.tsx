'use client'

import { Stage } from '@/lib/types'

interface Props {
  stage: Stage
}

export default function StageIndicator({ stage }: Props) {
  return (
    <div className="flex gap-2 justify-center mt-3">
      {([1, 2, 3, 4, 5] as Stage[]).map((s) => (
        <div
          key={s}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            s < stage
              ? 'bg-[#f5c518]'
              : s === stage
              ? 'bg-[#f5c518] ring-2 ring-[#f5c51880] scale-125'
              : 'bg-white/20'
          }`}
        />
      ))}
    </div>
  )
}
