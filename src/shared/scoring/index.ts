import type { QuestionAnswer, ChoiceAnswer, TextAnswer, ReadingAnswer } from '@/types'

export interface ScoreResult {
  isCorrect: boolean
  correctAnswer: string
}

export function checkAnswer(questionAnswer: QuestionAnswer, userAnswer: string): ScoreResult {
  switch (questionAnswer.type) {
    case 'choice':
      return checkChoice(questionAnswer, userAnswer)
    case 'text':
      return checkText(questionAnswer, userAnswer)
    case 'reading':
      return checkReading(questionAnswer, userAnswer)
    default:
      return { isCorrect: false, correctAnswer: '' }
  }
}

function checkChoice(answer: ChoiceAnswer, userAnswer: string): ScoreResult {
  const isCorrect = answer.value === userAnswer.trim().toUpperCase()
  return {
    isCorrect,
    correctAnswer: answer.value
  }
}

function checkText(answer: TextAnswer, userAnswer: string): ScoreResult {
  const trimmed = userAnswer.trim()
  const acceptableAnswers = Array.isArray(answer.value) ? answer.value : [answer.value]
  const isCorrect = acceptableAnswers.some(
    a => a.trim().toLowerCase() === trimmed.toLowerCase()
  )
  return {
    isCorrect,
    correctAnswer: acceptableAnswers[0]
  }
}

function checkReading(answer: ReadingAnswer, userAnswer: string): ScoreResult {
  let userAnswers: string[]
  try {
    userAnswers = JSON.parse(userAnswer)
  } catch {
    userAnswers = [userAnswer]
  }
  if (!Array.isArray(userAnswers)) {
    userAnswers = [userAnswers]
  }
  userAnswers = userAnswers.map(a => a.trim().toUpperCase())
  const expected = answer.value.map(a => a.trim().toUpperCase())
  const isCorrect = expected.length === userAnswers.length &&
    expected.every((a, i) => a === userAnswers[i])
  return {
    isCorrect,
    correctAnswer: answer.value.join(', ')
  }
}

export function getCorrectAnswerDisplay(answer: QuestionAnswer): string {
  switch (answer.type) {
    case 'choice':
      return answer.value
    case 'text':
      return Array.isArray(answer.value) ? answer.value[0] : answer.value
    case 'reading':
      return answer.value.join(', ')
    default:
      return ''
  }
}

export function formatAnswerForStorage(answer: QuestionAnswer, userInput: string): string {
  return userInput.trim()
}
