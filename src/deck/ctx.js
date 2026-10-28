import { createContext, useContext } from 'react'

// Контекст презентации: словарь выбранного языка, номер текущего слайда и
// общие подписи интерфейса. Слайды берут тексты отсюда, а не зашивают в разметку.
export const DeckContext = createContext(null)

export function useDeck() {
  const ctx = useContext(DeckContext)
  if (!ctx) throw new Error('useDeck вызван вне <SlideDeck>')
  return ctx
}
