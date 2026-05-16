import { Stage } from './types'

export interface GameStats {
  highScore: number
  totalRounds: number
  wins: number
  bestStreak: number
  stageWins: Record<Stage, number>
}

const KEY = 'tcg-guesser-stats'

const DEFAULT: GameStats = {
  highScore: 0,
  totalRounds: 0,
  wins: 0,
  bestStreak: 0,
  stageWins: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
}

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT, stageWins: { ...DEFAULT.stageWins } }
    return JSON.parse(raw) as GameStats
  } catch {
    return { ...DEFAULT, stageWins: { ...DEFAULT.stageWins } }
  }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats))
  } catch {
    // localStorage unavailable (SSR or private browsing)
  }
}

export function recordRound(
  won: boolean,
  stage: Stage,
  newTotalScore: number,
  currentStreak: number,
): GameStats {
  const prev = loadStats()
  const updated: GameStats = {
    highScore: Math.max(prev.highScore, newTotalScore),
    totalRounds: prev.totalRounds + 1,
    wins: prev.wins + (won ? 1 : 0),
    bestStreak: Math.max(prev.bestStreak, currentStreak),
    stageWins: {
      ...prev.stageWins,
      [stage]: prev.stageWins[stage] + (won ? 1 : 0),
    },
  }
  saveStats(updated)
  return updated
}

export function resetStats(): void {
  saveStats({ ...DEFAULT, stageWins: { ...DEFAULT.stageWins } })
}
