'use client'

import { useCallback, useState } from 'react'
import { fetchCard, fetchAllCards, fetchCardsForSet } from '@/lib/tcgdex'
import { calcScore, nextStage, pickRandom } from '@/lib/gameLogic'
import { Card, CardBrief, GameStatus, Stage } from '@/lib/types'

interface GameState {
  currentCard: Card | null
  currentStage: Stage
  totalScore: number
  streak: number
  cardPool: CardBrief[]
  usedCardIds: string[]
  gameStatus: GameStatus
  loading: boolean
  error: string | null
  lastPoints: number | null
}

const INITIAL: GameState = {
  currentCard: null,
  currentStage: 1,
  totalScore: 0,
  streak: 0,
  cardPool: [],
  usedCardIds: [],
  gameStatus: 'playing',
  loading: false,
  error: null,
  lastPoints: null,
}

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL)

  const loadNextCard = useCallback(async (pool: CardBrief[], used: string[]) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    let available = pool.filter((c) => !used.includes(c.id))
    let resetUsed = false
    if (available.length === 0) {
      available = pool
      resetUsed = true
    }
    const brief = pickRandom(available, [], 'id')
    if (!brief) {
      setState((s) => ({ ...s, loading: false, error: 'No cards available.' }))
      return
    }
    try {
      const card = await fetchCard(brief.id)
      setState((s) => ({
        ...s,
        currentCard: card,
        currentStage: 1,
        gameStatus: 'playing',
        usedCardIds: resetUsed ? [card.id] : [...s.usedCardIds, card.id],
        loading: false,
        lastPoints: null,
      }))
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'Failed to load card.' }))
    }
  }, [])

  const startGame = useCallback(async (seriesId: string | null) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const pool = seriesId ? await fetchCardsForSet(seriesId) : await fetchAllCards()
      if (pool.length === 0) {
        setState((s) => ({ ...s, loading: false, error: 'No cards found for this series.' }))
        return
      }
      setState((s) => ({
        ...s,
        cardPool: pool,
        usedCardIds: [],
        totalScore: 0,
        streak: 0,
      }))
      await loadNextCard(pool, [])
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'Failed to load cards.' }))
    }
  }, [loadNextCard])

  const submitGuess = useCallback((guess: string) => {
    setState((s) => {
      if (!s.currentCard || s.gameStatus !== 'playing') return s
      const correct = s.currentCard.name.trim().toLowerCase()
      const attempt = guess.trim().toLowerCase()

      if (attempt === correct) {
        const points = calcScore(s.currentStage, s.streak)
        return {
          ...s,
          gameStatus: 'correct',
          totalScore: s.totalScore + points,
          streak: s.streak + 1,
          lastPoints: points,
        }
      }

      if (s.currentStage === 5) {
        return { ...s, gameStatus: 'revealed', streak: 0, lastPoints: 0 }
      }

      return { ...s, currentStage: nextStage(s.currentStage) }
    })
  }, [])

  const advance = useCallback(() => {
    setState((s) => {
      loadNextCard(s.cardPool, s.usedCardIds)
      return s
    })
  }, [loadNextCard])

  return { state, startGame, submitGuess, advance }
}
