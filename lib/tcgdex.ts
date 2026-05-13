import { Card, CardBrief, SetBrief } from './types'

const BASE = 'https://api.tcgdex.net/v2/en'

export async function fetchSets(): Promise<SetBrief[]> {
  const res = await fetch(`${BASE}/sets`)
  if (!res.ok) throw new Error('Failed to fetch sets')
  return res.json()
}

export async function fetchCardsForSet(setId: string): Promise<CardBrief[]> {
  const res = await fetch(`${BASE}/sets/${setId}`)
  if (!res.ok) throw new Error(`Failed to fetch set ${setId}`)
  const data = await res.json()
  return (data.cards ?? []).filter((c: CardBrief) => c.image)
}

export async function fetchCardsForSerie(serieId: string): Promise<CardBrief[]> {
  const res = await fetch(`${BASE}/series/${serieId}`)
  if (!res.ok) throw new Error(`Failed to fetch serie ${serieId}`)
  const data = await res.json()
  const setIds: string[] = (data.sets ?? []).map((s: { id: string }) => s.id)
  const allCards = await Promise.all(setIds.map(fetchCardsForSet))
  return allCards.flat()
}

export async function fetchAllCards(): Promise<CardBrief[]> {
  const res = await fetch(`${BASE}/cards`)
  if (!res.ok) throw new Error('Failed to fetch all cards')
  const cards: CardBrief[] = await res.json()
  return cards.filter((c) => c.image)
}

export async function fetchCard(cardId: string): Promise<Card> {
  const res = await fetch(`${BASE}/cards/${cardId}`)
  if (!res.ok) throw new Error(`Failed to fetch card ${cardId}`)
  return res.json()
}
