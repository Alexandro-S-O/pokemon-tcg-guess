'use client'

interface Props {
  score: number
  streak: number
  lastPoints: number | null
}

export default function ScoreBoard({ score, streak, lastPoints }: Props) {
  const multiplier = (1 + streak * 0.1).toFixed(1)

  return (
    <div className="flex items-center gap-4 text-right">
      <div className="flex flex-col items-end">
        <span className="text-white/40 text-xs uppercase tracking-widest">Score</span>
        <span className="text-[#f5c518] font-black text-2xl leading-tight tabular-nums">
          {score.toLocaleString()}
        </span>
        {lastPoints !== null && lastPoints > 0 && (
          <span className="text-green-400 text-xs animate-bounce">+{lastPoints}</span>
        )}
      </div>

      <div className="flex flex-col items-end">
        <span className="text-white/40 text-xs uppercase tracking-widest">Streak</span>
        <span className="text-white font-bold text-xl leading-tight">
          {streak > 0 ? '🔥' : ''}{streak}
        </span>
        <span className="text-purple-300 text-xs">×{multiplier}</span>
      </div>
    </div>
  )
}
