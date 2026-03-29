export type Subject = {
  id: string
  name: string
  icon: string
  cardCount: number
  lastStudied: string
  isStudying?: boolean
  chapters?: number
  onDelete?: () => void
}

export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Chemistry',
    icon: '🧑‍🔬',
    cardCount: 12,
    lastStudied: '2 hours ago',
    isStudying: true,
    chapters: 5,
    onDelete: () => {},    
  },
  {
    id: '2',
    name: 'Physics',
    icon: '📐',
    cardCount: 8,
    lastStudied: 'Yesterday',
    isStudying: true,
    chapters: 3, 
    onDelete: () => {},   
  },
  {
    id: '3',
    name: 'Biology',
    icon: '🧬',
    cardCount: 15,
    lastStudied: '3 days ago',
    isStudying: true,
    chapters: 7, 
    onDelete: () => {},  
  },
  {
    id: '4',
    name: 'Maths',
    icon: '🔢',
    cardCount: 20,
    lastStudied: 'Today',
    isStudying: true,
    chapters: 10,
    onDelete: () => {},
  },
]