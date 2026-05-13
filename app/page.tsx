'use client'

import { useRouter } from 'next/navigation'
import SeriesFilter from '@/components/SeriesFilter'

export default function Home() {
  const router = useRouter()

  const handleSelect = (serieId: string | null) => {
    const param = serieId ? `?serie=${serieId}` : ''
    router.push(`/game${param}`)
  }

  return (
    <div className="bg-background text-on-background font-body-lg pixel-grid min-h-screen flex flex-col items-center">
      {/* Top Navigation */}
      <header className="w-full bg-primary text-on-primary border-b-[4px] border-on-background pixel-shadow z-50 sticky top-0">
        <div className="flex justify-between items-center w-full px-gutter h-16 max-w-container-max mx-auto">
          <div className="text-headline-md font-headline-md tracking-widest">TCG GUESSER</div>
          <nav className="hidden md:flex gap-8 items-center h-full">
            <span className="text-on-primary border-b-2 border-on-primary font-bold px-2 py-1 text-label-md font-label-md">
              GUESS
            </span>
          </nav>
          <div className="flex gap-4">
            <button className="material-symbols-outlined p-2 hover:bg-primary-fixed-dim transition-colors">
              military_tech
            </button>
            <button className="material-symbols-outlined p-2 hover:bg-primary-fixed-dim transition-colors">
              settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center w-full px-gutter py-12 max-w-container-max pb-24 md:pb-12">
        {/* Hero Branding */}
        <div className="text-center mb-12">
          <h1 className="text-display-lg font-display-lg text-gold uppercase tracking-tighter drop-shadow-pixel mb-2">
            TCG GUESSER
          </h1>
          <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">
            Guess the Pokémon from its blurred TCG card
          </p>
        </div>

        <SeriesFilter onSelect={handleSelect} />
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container text-primary border-t-[4px] border-on-background p-4 mt-12">
        <div className="max-w-container-max mx-auto flex justify-between items-center text-label-sm font-label-sm uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">person</span>
            TRAINER: ASH
          </div>
          <div className="flex items-center gap-4">
            <span>VER: 1.0.4-PIXEL</span>
            <span className="hidden md:inline">SYSTEM STATUS: OPTIMAL</span>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container border-t-[4px] border-on-background flex justify-around items-center px-4 py-2 h-20">
        <button className="flex flex-col items-center justify-center text-on-surface-variant p-2">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-label-sm font-label-sm uppercase">DEX</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container border-2 border-on-background pixel-shadow-sm p-1">
          <span className="material-symbols-outlined">videogame_asset</span>
          <span className="text-label-sm font-label-sm uppercase">GUESS</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant p-2">
          <span className="material-symbols-outlined">person</span>
          <span className="text-label-sm font-label-sm uppercase">TRAINER</span>
        </button>
      </div>
    </div>
  )
}
