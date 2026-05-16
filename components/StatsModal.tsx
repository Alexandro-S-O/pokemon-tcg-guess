'use client'

import { useEffect, useState } from 'react'
import { loadStats, resetStats, GameStats } from '@/lib/stats'

interface Props {
  onClose: () => void
}

const EMPTY: GameStats = {
  highScore: 0,
  totalRounds: 0,
  wins: 0,
  bestStreak: 0,
  stageWins: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
}

export default function StatsModal({ onClose }: Props) {
  const [stats, setStats] = useState<GameStats>(EMPTY)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    setStats(loadStats())
  }, [])

  const winRate =
    stats.totalRounds > 0
      ? Math.round((stats.wins / stats.totalRounds) * 100)
      : 0

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetStats()
    setStats({ ...EMPTY, stageWins: { ...EMPTY.stageWins } })
    setConfirmReset(false)
  }

  return (
    <div
      className="fixed inset-0 bg-on-background/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background pixel-border pixel-shadow w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary text-on-primary flex items-center justify-between px-4 py-3 border-b-[4px] border-on-background">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">emoji_events</span>
            <span className="text-headline-sm font-headline-sm uppercase tracking-widest">
              STATS
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-on-primary hover:bg-primary-fixed-dim px-1 text-headline-sm font-headline-sm leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Main stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'HIGH SCORE', value: String(stats.highScore).padStart(7, '0') },
              { label: 'WIN RATE', value: `${winRate}%` },
              { label: 'TOTAL ROUNDS', value: String(stats.totalRounds) },
              { label: 'BEST STREAK', value: `x${stats.bestStreak}` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-surface-container border-2 border-on-background p-3 flex flex-col items-center pixel-shadow-sm"
              >
                <span className="text-label-sm font-label-sm uppercase opacity-60">{label}</span>
                <span className="text-headline-sm font-headline-sm text-on-surface">{value}</span>
              </div>
            ))}
          </div>

          {/* Stage breakdown */}
          <div>
            <p className="text-label-sm font-label-sm uppercase opacity-60 mb-2 text-center">
              WINS BY STAGE
            </p>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as const).map((s) => (
                <div
                  key={s}
                  className="flex-1 bg-surface-container border-2 border-on-background p-2 flex flex-col items-center pixel-shadow-sm"
                >
                  <span className="text-label-sm font-label-sm uppercase opacity-60">S{s}</span>
                  <span className="text-label-md font-label-md text-on-surface">
                    {stats.stageWins[s]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className={`w-full py-2 pixel-border text-label-md font-label-md uppercase tracking-widest transition-colors
              ${confirmReset
                ? 'bg-error text-on-primary active-press'
                : 'bg-surface-container text-on-surface-variant hover:bg-error hover:text-on-primary'
              }`}
          >
            {confirmReset ? 'CONFIRM RESET?' : 'RESET STATS'}
          </button>
        </div>
      </div>
    </div>
  )
}
