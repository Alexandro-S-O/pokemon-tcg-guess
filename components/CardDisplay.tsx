'use client'

import { Stage } from '@/lib/types'
import { BLUR_VALUES } from '@/lib/gameLogic'

interface Props {
  imageUrl: string
  stage: Stage
}

export default function CardDisplay({ imageUrl, stage }: Props) {
  const blur = BLUR_VALUES[stage]
  const isBlurred = stage < 5

  return (
    <div className="aspect-[2.5/3.5] w-64 md:w-80 bg-white pixel-border pixel-shadow relative overflow-hidden flex flex-col">
      {/* Top color bar */}
      <div className="h-4 bg-primary w-full border-b border-on-background flex-shrink-0" />

      {/* Image area */}
      <div className="flex-grow bg-surface-dim flex items-center justify-center relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${imageUrl}/high.webp`}
          alt="Pokemon card"
          className="w-full h-full object-contain"
          style={{ filter: blur, transition: 'filter 500ms ease' }}
        />

        {/* Name cover — hides the Pokémon name printed on the card */}
        <div
          className="absolute"
          style={{
            top: '3%',
            left: '5%',
            width: '60%',
            height: '8%',
            background: '#dcd9d9',
          }}
        />

        {/* ? overlay while blurred */}
        {isBlurred && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-display-lg font-display-lg text-on-background opacity-20">?</span>
          </div>
        )}
      </div>

      {/* Bottom info placeholder */}
      <div className="h-14 bg-white border-t border-on-background p-2 flex flex-col justify-center flex-shrink-0">
        <div className="h-2 w-3/4 bg-surface-container mb-2 rounded-sm" />
        <div className="h-2 w-1/2 bg-surface-container rounded-sm" />
      </div>
    </div>
  )
}
