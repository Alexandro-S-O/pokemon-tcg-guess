'use client'

import { Card, Stage } from '@/lib/types'

interface Props {
  card: Card
  stage: Stage
}

export default function HintPanel({ card, stage }: Props) {
  const showHp = stage >= 2
  const showType = stage >= 3
  const showAttack = stage >= 4

  const hpValue = showHp && card.hp ? `${card.hp} HP` : '—'
  const typeValue = showType && card.types?.length ? card.types.join(' / ').toUpperCase() : '—'
  const attackValue =
    showAttack && card.attacks?.length
      ? `${card.attacks[0].name}${card.attacks[0].damage ? ` ${card.attacks[0].damage}` : ''}`
      : '—'

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-8">
      <div className="bg-surface-container border-2 border-on-background p-2 flex flex-col items-center pixel-shadow-sm">
        <span className="text-label-sm font-label-sm uppercase opacity-60">HP</span>
        <span className="text-label-md font-label-md font-bold text-on-surface">{hpValue}</span>
      </div>
      <div className="bg-surface-container border-2 border-on-background p-2 flex flex-col items-center pixel-shadow-sm">
        <span className="text-label-sm font-label-sm uppercase opacity-60">TYPE</span>
        <span className="text-label-md font-label-md font-bold text-on-surface truncate w-full text-center">
          {typeValue}
        </span>
      </div>
      <div className="bg-surface-container border-2 border-on-background p-2 flex flex-col items-center pixel-shadow-sm overflow-hidden">
        <span className="text-label-sm font-label-sm uppercase opacity-60">ATTACK</span>
        <span className="text-label-sm font-label-sm font-bold text-on-surface truncate w-full text-center">
          {attackValue}
        </span>
      </div>
    </div>
  )
}
