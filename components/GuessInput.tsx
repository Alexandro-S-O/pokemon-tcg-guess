'use client'

import { useState, useRef, useEffect } from 'react'
import { CardBrief } from '@/lib/types'

interface Props {
  cardPool: CardBrief[]
  onSubmit: (guess: string) => void
  disabled: boolean
  shake: boolean
}

export default function GuessInput({ cardPool, onSubmit, disabled, shake }: Props) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  const handleChange = (v: string) => {
    setValue(v)
    setActiveIndex(-1)
    if (v.trim().length < 1) {
      setSuggestions([])
      return
    }
    const lower = v.trim().toLowerCase()
    const seen = new Set<string>()
    const names = cardPool.map((c) => c.name).filter((n) => { if (seen.has(n)) return false; seen.add(n); return true })
    setSuggestions(names.filter((n) => n.toLowerCase().includes(lower)).slice(0, 8))
  }

  const submit = (guess: string) => {
    if (!guess.trim()) return
    setValue('')
    setSuggestions([])
    setActiveIndex(-1)
    onSubmit(guess)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        submit(suggestions[activeIndex])
      } else {
        submit(value)
      }
    } else if (e.key === 'Escape') {
      setSuggestions([])
    }
  }

  return (
    <div className="relative w-full max-w-sm">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Who's that Pokémon?"
        className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/30
          focus:outline-none focus:ring-2 focus:ring-[#f5c518] transition-all
          ${shake ? 'animate-shake border-red-400' : 'border-white/20'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      />

      {suggestions.length > 0 && !disabled && (
        <ul className="absolute z-50 bottom-full mb-1 w-full bg-[#111827] border border-white/20 rounded-xl overflow-hidden shadow-xl">
          {suggestions.map((name, i) => (
            <li
              key={name}
              onMouseDown={() => submit(name)}
              className={`px-4 py-2 text-white cursor-pointer text-sm transition-colors
                ${i === activeIndex ? 'bg-[#f5c518] text-black' : 'hover:bg-white/10'}
              `}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
