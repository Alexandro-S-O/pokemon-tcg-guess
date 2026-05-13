'use client'

import { Suspense } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGameState } from '@/hooks/useGameState'
import CardDisplay from '@/components/CardDisplay'
import GuessInput from '@/components/GuessInput'
import HintPanel from '@/components/HintPanel'
import ScoreBoard from '@/components/ScoreBoard'
import StageIndicator from '@/components/StageIndicator'

function GameInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const seriesId = searchParams.get('series') // legacy: specific set ID
  const serieId = searchParams.get('serie')   // new: whole serie

  const { state, startGame, submitGuess, advance } = useGameState()
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)
  const prevStatus = useRef(state.gameStatus)

  useEffect(() => {
    startGame(seriesId, serieId)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (prevStatus.current === 'playing' && state.gameStatus === 'correct') {
      setFlash('correct')
      setTimeout(() => setFlash(null), 800)
      setTimeout(() => advance(), 1500)
    }
    if (prevStatus.current === 'playing' && state.gameStatus === 'revealed') {
      setFlash('wrong')
      setTimeout(() => setFlash(null), 800)
    }
    prevStatus.current = state.gameStatus
  }, [state.gameStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGuess = (guess: string) => {
    const wasPlaying = state.gameStatus === 'playing'
    const correctAnswer = state.currentCard?.name.trim().toLowerCase()
    const attempt = guess.trim().toLowerCase()
    const isWrong = attempt !== correctAnswer

    submitGuess(guess)

    if (wasPlaying && isWrong && state.currentStage < 5) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  if (state.loading && !state.currentCard) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <p className="text-white/50 animate-pulse text-lg">Loading cards...</p>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{state.error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 rounded-xl bg-[#f5c518] text-black font-bold"
        >
          Go Home
        </button>
      </div>
    )
  }

  if (!state.currentCard) return null

  const isRevealed = state.gameStatus === 'revealed'
  const isCorrect = state.gameStatus === 'correct'
  const inputDisabled = isRevealed || isCorrect || state.loading

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white px-4 py-6 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full mb-6">
        <button
          onClick={() => router.push('/')}
          className="text-white/40 hover:text-white text-sm transition-colors"
        >
          ← Go Home
        </button>
        <ScoreBoard
          score={state.totalScore}
          streak={state.streak}
          lastPoints={state.lastPoints}
        />
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center gap-6 flex-1 max-w-2xl mx-auto w-full">
        {/* Card + stage */}
        <div
          className={`transition-all duration-300 ${
            flash === 'correct' ? 'scale-105' : flash === 'wrong' ? 'opacity-70' : ''
          }`}
        >
          <CardDisplay
            imageUrl={state.currentCard.image!}
            stage={isRevealed || isCorrect ? 5 : state.currentStage}
          />
          <StageIndicator stage={state.currentStage} />
        </div>

        {/* Hint panel */}
        <HintPanel
          card={state.currentCard}
          stage={isRevealed || isCorrect ? 5 : state.currentStage}
        />

        {/* Guess input */}
        <GuessInput
          cardPool={state.cardPool}
          onSubmit={handleGuess}
          disabled={inputDisabled}
          shake={shake}
        />

        {/* Round result */}
        {isRevealed && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-red-400 font-semibold">
              It was <span className="text-white font-black">{state.currentCard.name}</span>!
            </p>
            <p className="text-white/40 text-sm">Streak lost</p>
            <button
              onClick={advance}
              className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white
                hover:bg-white/20 transition-all font-semibold"
            >
              Next Card →
            </button>
          </div>
        )}

        {isCorrect && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-green-400 font-semibold">
              Correct! +{state.lastPoints} pts
            </p>
            <p className="text-white/40 text-sm">Loading next card...</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
          <p className="text-white/50 animate-pulse text-lg">Loading...</p>
        </div>
      }
    >
      <GameInner />
    </Suspense>
  )
}
