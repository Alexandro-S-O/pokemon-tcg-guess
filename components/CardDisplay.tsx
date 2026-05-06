'use client'

import { Stage } from '@/lib/types'
import { BLUR_VALUES } from '@/lib/gameLogic'

interface Props {
  imageUrl: string
  stage: Stage
}

export default function CardDisplay({ imageUrl, stage }: Props) {
  const blur = BLUR_VALUES[stage]

  return (
    <div
      className="relative mx-auto rounded-xl overflow-hidden border border-white/10"
      style={{ width: 250, aspectRatio: '2.5/3.5' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${imageUrl}/high.webp`}
        alt="Pokemon card"
        className="w-full h-full object-cover"
        style={{
          filter: blur,
          transition: 'filter 500ms ease',
        }}
      />
    </div>
  )
}
