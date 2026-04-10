export type AIFlashcard = {
  question: string
  answer: string
}

const GROQ_API_KEY = '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'

export const generateFlashcards = async (
  topic: string,
  count: number = 8
): Promise<AIFlashcard[]> => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a flashcard generator. Always respond with valid JSON only, no markdown, no explanation.',
          },
          {
            role: 'user',
            content: `Generate ${count} flashcards about "${topic}".

Return ONLY this JSON array format:
[
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."}
]`,
          }
        ],
        temperature: 0.7,
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.log('Groq error:', data.error?.message)
      return []
    }

    const text = data.choices[0].message.content
    const clean = text.replace(/```json|```/g, '').trim()
    const cards = JSON.parse(clean)

    return Array.isArray(cards) ? cards : []
  } catch (err: any) {
    console.log('generateFlashcards error:', err.message)
    return []
  }
}