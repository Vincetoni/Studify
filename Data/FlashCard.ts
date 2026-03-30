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
  {
    id: '5',
    subjectId: '1',
    question: 'What is the most abundant element in the Earth’s atmosphere?',
    answer: 'Nitrogen — it makes up about 78% of the air we breathe',
  },
  {
    id: '6',
    subjectId: '1',
    question: 'What is the pH of pure water?',
    answer: '7 — This is considered neutral on the pH scale',
  },
  {
    id: '7',
    subjectId: '2',
    question: 'What is the unit of electrical resistance?',
    answer: 'Ohm (Ω) — named after German physicist Georg Simon Ohm',
  },
  {
    id: '8',
    subjectId: '2',
    question: 'What are the three states of matter?',
    answer: 'Solid, Liquid, and Gas — though Plasma is often considered the fourth',
  },
  {
    id: '9',
    subjectId: '1',
    question: 'What is the only metal that is liquid at room temperature?',
    answer: 'Mercury (Hg) — It remains liquid due to its unique electron configuration',
  },
  {
    id: '10',
    subjectId: '2',
    question: 'What is the first law of thermodynamics?',
    answer: 'Energy cannot be created or destroyed, only transformed (Law of Conservation of Energy)',
  },
  {
    id: '11',
    subjectId: '1',
    question: 'What is an "Ion"?',
    answer: 'An atom or molecule with a net electric charge due to the loss or gain of one or more electrons',
  },
  {
    id: '12',
    subjectId: '2',
    question: "What is the standard unit of Force?",
    answer: 'The Newton (N) — defined as the force needed to accelerate 1kg of mass at the rate of 1m/s²',
  },
  {
    id: '13',
    subjectId: '3',
    question: 'What is known as the "Powerhouse of the Cell"?',
    answer: 'Mitochondria — They generate most of the chemical energy needed to power the cell',
  },
  {
    id: '14',
    subjectId: '3',
    question: 'What is the process by which plants make their own food?',
    answer: 'Photosynthesis — Converting light energy into chemical energy (glucose)',
  },
]