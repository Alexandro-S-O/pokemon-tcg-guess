'use client'

import { Stage } from '@/lib/types'
import { BLUR_VALUES } from '@/lib/gameLogic'

interface Props {
  imageUrl: string
  stage: Stage
}

export default function CardDisplay({ imageUrl, stage }: Props) {
  const blur = BLUR_VALUES[stage]
  const overlayOpacity = stage === 1 ? 0.5 : stage === 2 ? 0.35 : stage === 3 ? 0.2 : stage === 4 ? 0.05 : 0

  return (
    <div className="relative mx-auto" style={{ width: 250, aspectRatio: '2.5/3.5' }}>
      {/* Holographic shimmer border */}
      <div
        className="absolute inset-0 rounded-xl p-[2px] z-0"
        style={{
          background: 'conic-gradient(from 0deg, #f5c518, #a78bfa, #38bdf8, #34d399, #f5c518)',
          animation: 'spin 4s linear infinite',
        }}
      >
        <div className="w-full h-full rounded-xl bg-[#0a0f1e]" />
      </div>

      {/* Card image */}
      <div className="absolute inset-[2px] rounded-xl overflow-hidden z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${imageUrl}/high.webp`}
          alt="Pokemon card"
          className="w-full h-full object-cover"
          style={{
            filter: `blur(${blur.replace('blur(', '').replace(')', '')})`,
            transition: 'filter 500ms ease',
            transform: 'scale(1.05)',
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-black rounded-xl"
          style={{
            opacity: overlayOpacity,
            transition: 'opacity 500ms ease',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}
