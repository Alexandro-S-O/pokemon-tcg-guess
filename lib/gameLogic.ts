import { Stage } from './types'

export const BASE_POINTS: Record<Stage, number> = {
  1: 100,
  2: 75,
  3: 50,
  4: 25,
  5: 10,
}

export const BLUR_VALUES: Record<Stage, string> = {
  1: 'blur(10px)',
  2: 'blur(6px)',
  3: 'blur(3px)',
  4: 'blur(1px)',
  5: 'blur(0px)',
}

export function calcScore(stage: Stage, streak: number): number {
  return Math.floor(BASE_POINTS[stage] * (1 + streak * 0.1))
}

export function nextStage(stage: Stage): Stage {
  return Math.min(stage + 1, 5) as Stage
}

export function pickRandom<T>(arr: T[], exclude: string[], idKey: keyof T): T | null {
  const available = arr.filter((item) => !exclude.includes(item[idKey] as string))
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}
