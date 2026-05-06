'use client'

import { useRouter } from 'next/navigation'
import SeriesFilter from '@/components/SeriesFilter'

export default function Home() {
  const router = useRouter()

  const handleSelect = (setId: string | null) => {
    const param = setId ? `?series=${setId}` : ''
    router.push(`/game${param}`)
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[#f5c518] mb-2 tracking-tight">
            TCG Guesser
          </h1>
          <p className="text-white/50 text-lg">
            Guess the Pokémon from its blurred TCG card
          </p>
        </div>

        <SeriesFilter onSelect={handleSelect} />
      </div>
    </main>
  )
}
