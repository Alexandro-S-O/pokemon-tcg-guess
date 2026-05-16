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
import StatsModal from '@/components/StatsModal'
import { recordRound } from '@/lib/stats'
import { playCorrect, playWrong, playRevealed } from '@/lib/sounds'

function Sidebar({ onStatsClick }: { onStatsClick: () => void }) {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-surface border-r-[4px] border-on-background overflow-y-auto z-40">
      <div className="p-6 mb-4 flex flex-col items-center">
        <div className="w-20 h-20 bg-primary-fixed-dim pixel-border pixel-shadow mb-4 flex items-center justify-center">
          <span className="material-symbols-outlined text-[40px] text-primary">person</span>
        </div>
        <h3 className="text-headline-sm font-headline-sm text-primary uppercase">TRAINER</h3>
        <p className="text-label-sm font-label-sm opacity-60">Pallet Town</p>
      </div>

      <div className="flex flex-col gap-1 px-2">
        <button
          onClick={onStatsClick}
          className="text-on-surface px-4 py-2 flex items-center gap-3 hover:bg-surface-container-highest transition-all cursor-pointer w-full text-left"
        >
          <span className="material-symbols-outlined">emoji_events</span>
          <span className="text-label-md font-label-md">STATS</span>
        </button>
        {[
          { icon: 'swap_horizontal_circle', label: 'TRADES' },
          { icon: 'workspace_premium', label: 'BADGES' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="text-on-surface-variant px-4 py-2 flex items-center gap-3 hover:bg-surface-container-highest transition-all cursor-default opacity-50"
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="text-label-md font-label-md">{label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}

function MobileNav({ onStatsClick }: { onStatsClick: () => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface-container border-t-[4px] border-on-background h-20">
      <button className="flex flex-col items-center justify-center text-on-surface-variant p-2">
        <span className="material-symbols-outlined">grid_view</span>
        <span className="text-label-sm font-label-sm uppercase">DEX</span>
      </button>
      <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container border-2 border-on-background pixel-shadow-sm p-1">
        <span className="material-symbols-outlined">videogame_asset</span>
        <span className="text-label-sm font-label-sm uppercase">GUESS</span>
      </button>
      <button
        onClick={onStatsClick}
        className="flex flex-col items-center justify-center text-on-surface-variant p-2"
      >
        <span className="material-symbols-outlined">emoji_events</span>
        <span className="text-label-sm font-label-sm uppercase">STATS</span>
      </button>
      <button className="flex flex-col items-center justify-center text-on-surface-variant p-2">
        <span className="material-symbols-outlined">person</span>
        <span className="text-label-sm font-label-sm uppercase">TRAINER</span>
      </button>
    </nav>
  )
}

function GameInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const seriesId = searchParams.get('series')
  const serieId = searchParams.get('serie')

  const { state, startGame, submitGuess, advance } = useGameState()
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)
  const [showStats, setShowStats] = useState(false)
  const [muted, setMuted] = useState(false)
  const prevStatus = useRef(state.gameStatus)

  useEffect(() => {
    setMuted(localStorage.getItem('tcg-muted') === '1')
  }, [])

  const toggleMute = () => {
    setMuted((m) => {
      localStorage.setItem('tcg-muted', m ? '0' : '1')
      return !m
    })
  }

  useEffect(() => {
    startGame(seriesId, serieId)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (prevStatus.current === 'playing' && state.gameStatus === 'correct') {
      if (!muted) playCorrect(state.streak + 1)
      recordRound(true, state.currentStage, state.totalScore, state.streak + 1)
      setFlash('correct')
      setTimeout(() => setFlash(null), 800)
      setTimeout(() => advance(), 1500)
    }
    if (prevStatus.current === 'playing' && state.gameStatus === 'revealed') {
      if (!muted) playRevealed()
      recordRound(false, state.currentStage, state.totalScore, 0)
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
      if (!muted) playWrong()
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  if (state.loading && !state.currentCard) {
    return (
      <div className="bg-background pixel-bg-grid min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant animate-pulse text-label-md font-label-md uppercase tracking-widest">
          Loading cards...
        </p>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="bg-background pixel-bg-grid min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-error text-label-md font-label-md">{state.error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-primary text-on-primary pixel-border pixel-shadow active-press text-label-md font-label-md uppercase"
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
    <div className="bg-background text-on-background font-body-lg pixel-bg-grid min-h-screen flex flex-col">
      {/* Sticky header */}
      <header className="bg-primary text-on-primary border-b-[4px] border-on-background pixel-shadow z-50 sticky top-0">
        <div className="flex justify-between items-center w-full px-gutter h-16 max-w-container-max mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-headline-sm font-headline-sm tracking-widest hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors px-2 py-1"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            GO HOME
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="flex items-center gap-1 text-on-primary hover:bg-primary-fixed-dim px-2 py-1 transition-colors"
              title={muted ? 'Unmute' : 'Mute'}
            >
              <span className="material-symbols-outlined">
                {muted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="flex items-center gap-1 text-on-primary hover:bg-primary-fixed-dim px-2 py-1 transition-colors"
              title="Stats"
            >
              <span className="material-symbols-outlined">emoji_events</span>
            </button>
            <ScoreBoard
              score={state.totalScore}
              streak={state.streak}
              lastPoints={state.lastPoints}
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        <Sidebar onStatsClick={() => setShowStats(true)} />

        {/* Main game area */}
        <main className="flex-1 md:ml-64 flex flex-col items-center py-8 px-gutter pb-24 md:pb-8">
          <StageIndicator stage={state.currentStage} />

          {/* Card with flash effect */}
          <div
            className={`relative mb-8 transition-all duration-300 ${
              flash === 'correct' ? 'scale-105' : flash === 'wrong' ? 'opacity-60' : ''
            }`}
          >
            <CardDisplay
              imageUrl={state.currentCard.image!}
              stage={isRevealed || isCorrect ? 5 : state.currentStage}
            />
          </div>

          <HintPanel
            card={state.currentCard}
            stage={isRevealed || isCorrect ? 5 : state.currentStage}
          />

          <GuessInput
            cardPool={state.cardPool}
            onSubmit={handleGuess}
            disabled={inputDisabled}
            shake={shake}
          />

          {/* Result banners */}
          {isRevealed && (
            <div className="flex flex-col items-center gap-3 mt-6">
              <p className="text-error text-label-md font-label-md uppercase">
                It was{' '}
                <span className="font-bold text-on-surface">{state.currentCard.name.toUpperCase()}</span>!
              </p>
              <p className="text-on-surface-variant text-label-sm font-label-sm uppercase opacity-60">
                Streak lost
              </p>
              <button
                onClick={advance}
                className="px-8 py-3 bg-secondary text-on-secondary pixel-border pixel-shadow active-press text-label-md font-label-md uppercase tracking-widest"
              >
                NEXT CARD →
              </button>
            </div>
          )}

          {isCorrect && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <p className="text-tertiary text-label-md font-label-md uppercase">
                CORRECT! +{state.lastPoints} PTS
              </p>
              <p className="text-on-surface-variant text-label-sm font-label-sm uppercase opacity-60">
                Loading next card...
              </p>
            </div>
          )}
        </main>
      </div>

      <MobileNav onStatsClick={() => setShowStats(true)} />

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </div>
  )
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background pixel-bg-grid min-h-screen flex items-center justify-center">
          <p className="text-on-surface-variant animate-pulse text-label-md font-label-md uppercase tracking-widest">
            Loading...
          </p>
        </div>
      }
    >
      <GameInner />
    </Suspense>
  )
}
