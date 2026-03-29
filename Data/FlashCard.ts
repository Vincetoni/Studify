export type Flashcard = {
  id: string
  subjectId: string
  question: string
  answer: string
}

export const flashcards: Flashcard[] = [
  {
    id: '1',
    subjectId: '1',
    question: 'What is the chemical formula for water?',
    answer: 'H₂O — two hydrogen atoms bonded to one oxygen atom',
  },
  {
    id: '2',
    subjectId: '1',
    question: 'What is the atomic number of Carbon?',
    answer: '6 — Carbon has 6 protons in its nucleus',
  },
  {
    id: '3',
    subjectId: '2',
    question: "What is Newton's Second Law?",
    answer: 'F = ma — Force equals mass times acceleration',
  },
  {
    id: '4',
    subjectId: '2',
    question: 'What is the speed of light?',
    answer: '299,792,458 metres per second in a vacuum',
  },
]