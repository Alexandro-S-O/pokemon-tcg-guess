'use client'

import { Card, Stage } from '@/lib/types'

const TYPE_COLORS: Record<string, string> = {
  Fire: '#f08030',
  Water: '#6890f0',
  Grass: '#78c850',
  Lightning: '#f8d030',
  Psychic: '#f85888',
  Fighting: '#c03028',
  Darkness: '#705848',
  Metal: '#b8b8d0',
  Dragon: '#7038f8',
  Fairy: '#ee99ac',
  Colorless: '#a8a878',
  Poison: '#a040a0',
}

interface Props {
  card: Card
  stage: Stage
}

export default function HintPanel({ card, stage }: Props) {
  const showHp = stage >= 2
  const showType = stage >= 3
  const showAttack = stage >= 4

  return (
    <div className="flex flex-col gap-2 min-w-[160px]">
      <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Hints</div>

      {/* HP */}
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-sm w-14">HP</span>
        {showHp ? (
          <span className="text-white font-bold">{card.hp ?? '—'}</span>
        ) : (
          <span className="text-white/20">— — —</span>
        )}
      </div>

      {/* Type */}
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-sm w-14">Type</span>
        {showType && card.types?.length ? (
          <div className="flex gap-1">
            {card.types.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: TYPE_COLORS[t] ?? '#888' }}
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-white/20">— — —</span>
        )}
      </div>

      {/* Attack */}
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-sm w-14">Attack</span>
        {showAttack && card.attacks?.length ? (
          <span className="text-white text-sm">
            {card.attacks[0].name}
            {card.attacks[0].damage ? ` (${card.attacks[0].damage})` : ''}
          </span>
        ) : (
          <span className="text-white/20">— — —</span>
        )}
      </div>
    </div>
  )
}
