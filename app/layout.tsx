import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pokémon TCG Guesser',
  description: 'Guess the Pokémon from its blurred TCG card',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0f1e] min-h-screen text-white`}>
        {children}
      </body>
    </html>
  )
}
