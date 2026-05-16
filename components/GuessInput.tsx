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
    const names = cardPool
      .map((c) => c.name)
      .filter((n) => { if (seen.has(n)) return false; seen.add(n); return true })
    setSuggestions(names.filter((n) => n.toLowerCase().includes(lower)).slice(0, 6))
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
      submit(activeIndex >= 0 && suggestions[activeIndex] ? suggestions[activeIndex] : value)
    } else if (e.key === 'Escape') {
      setSuggestions([])
    }
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div className="relative">
        {/* Autocomplete dropdown — appears above the input */}
        {suggestions.length > 0 && !disabled && (
          <ul className="absolute bottom-full left-0 w-full bg-surface-container-high border-x-2 border-t-2 border-on-background z-10">
            {suggestions.map((name, i) => (
              <li
                key={name}
                onMouseDown={() => submit(name)}
                className={`px-4 py-2 text-label-md font-label-md cursor-pointer border-b border-on-background/10 transition-colors ${
                  i === activeIndex
                    ? 'bg-primary text-on-primary'
                    : 'hover:bg-primary-fixed hover:text-on-primary-fixed'
                }`}
              >
                {name.toUpperCase()}
              </li>
            ))}
          </ul>
        )}

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="WHO'S THAT POKÉMON?"
          className={`w-full bg-white pixel-border p-4 text-center text-headline-sm font-headline-sm
            placeholder:opacity-30 placeholder:text-on-background focus:outline-none focus:bg-surface-bright
            transition-colors uppercase text-on-background
            ${shake ? 'animate-shake border-error' : ''}
            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          `}
        />
      </div>

      <button
        onClick={() => submit(activeIndex >= 0 && suggestions[activeIndex] ? suggestions[activeIndex] : value)}
        disabled={disabled || !value.trim()}
        className="w-full bg-secondary text-on-secondary py-4 pixel-border pixel-shadow active-press
          text-headline-sm font-headline-sm uppercase tracking-widest
          disabled:opacity-40 disabled:cursor-not-allowed disabled:active:transform-none"
      >
        SUBMIT GUESS
      </button>
    </div>
  )
}
