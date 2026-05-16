'use client'

interface Props {
  score: number
  streak: number
  lastPoints: number | null
}

export default function ScoreBoard({ score, streak, lastPoints }: Props) {
  const multiplier = (1 + streak * 0.1).toFixed(1)
  const formatted = String(score).padStart(7, '0')

  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-end leading-none">
        <span className="text-label-sm font-label-sm uppercase opacity-80">SCORE</span>
        <span className="text-headline-sm font-headline-sm">{formatted}</span>
        {lastPoints !== null && lastPoints > 0 && (
          <span className="text-tertiary-fixed text-xs animate-bounce">+{lastPoints}</span>
        )}
      </div>

      <div className="h-8 w-[2px] bg-on-primary/30" />

      <div className="flex flex-col items-end leading-none">
        <span className="text-label-sm font-label-sm uppercase opacity-80">STREAK</span>
        <span className="text-headline-sm font-headline-sm text-tertiary-fixed">
          x{streak} {streak > 0 ? '🔥' : ''}
        </span>
      </div>

      {streak > 1 && (
        <div className="hidden md:flex bg-on-primary text-primary px-2 py-1 pixel-border text-label-md font-label-md">
          {multiplier}X
        </div>
      )}
    </div>
  )
}
