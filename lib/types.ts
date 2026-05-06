export interface CardBrief {
  id: string
  name: string
  image?: string
}

export interface Attack {
  name: string
  damage?: string
}

export interface Card {
  id: string
  name: string
  image?: string
  hp?: number
  types?: string[]
  attacks?: Attack[]
}

export interface Serie {
  id: string
  name: string
}

export interface SetBrief {
  id: string
  name: string
  serie?: Serie
  cardCount?: { total: number }
}

export type Stage = 1 | 2 | 3 | 4 | 5
export type GameStatus = 'playing' | 'revealed' | 'correct'

export interface GameState {
  currentCard: Card | null
  currentStage: Stage
  totalScore: number
  streak: number
  selectedSeries: string | null
  cardPool: CardBrief[]
  usedCardIds: string[]
  gameStatus: GameStatus
}
