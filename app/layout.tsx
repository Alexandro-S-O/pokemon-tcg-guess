import type { Metadata } from 'next'
import { VT323, Roboto_Mono } from 'next/font/google'
import './globals.css'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Pokémon TCG Guesser',
  description: 'Guess the Pokémon from its blurred TCG card',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} ${robotoMono.variable} min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
