import { flashcards } from './FlashCard'

export type Subject = {
  id: string
  name: string
  icon: string
  cardCount: number
  lastStudied: string
  isStudying?: boolean
  chapters?: number
}

export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Chemistry',
    icon: '🧑‍🔬',
    cardCount: flashcards.filter(f => f.subjectId === '1').length,
    lastStudied: '2 hours ago',
    isStudying: true,
    chapters: 5,
  },
  {
    id: '2',
    name: 'Physics',
    icon: '📐',
    cardCount: flashcards.filter(f => f.subjectId === '2').length,
    lastStudied: 'Yesterday',
    isStudying: true,
    chapters: 3,
  },
  {
    id: '3',
    name: 'Biology',
    icon: '🧬',
    cardCount: flashcards.filter(f => f.subjectId === '3').length,
    lastStudied: '3 days ago',
    isStudying: true,
    chapters: 7,
  },
  {
    id: '4',
    name: 'Maths',
    icon: '🔢',
    cardCount: flashcards.filter(f => f.subjectId === '4').length,
    lastStudied: 'Today',
    isStudying: true,
    chapters: 10,
  },
]