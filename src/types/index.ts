// 题目类型
export type Subject = '语文' | '数学' | '英语'

export type QuestionType =
  | '拼音' | '诗词' | '改错' | '课内阅读' | '课外阅读'
  | '公式' | '计算'
  | '单词' | '句子' | '英语阅读'

export interface ChoiceOption {
  key: string
  text: string
}

// questions 表 content 字段的 JSON 类型
export interface ChoiceContent {
  stem: string
  options: ChoiceOption[]
  sentence?: string
}

export interface FillBlankContent {
  stem: string
  hint?: string
}

export interface ReadingContent {
  passage: string
  passageTitle?: string
  questions: {
    stem: string
    options: ChoiceOption[]
  }[]
}

export type QuestionContent = ChoiceContent | FillBlankContent | ReadingContent

// questions 表 answer 字段的 JSON 类型
export interface ChoiceAnswer {
  type: 'choice'
  value: string
}

export interface TextAnswer {
  type: 'text'
  value: string | string[]
}

export interface ReadingAnswer {
  type: 'reading'
  value: string[]
}

export type QuestionAnswer = ChoiceAnswer | TextAnswer | ReadingAnswer

// 数据库行类型
export interface Question {
  id: number
  subject: Subject
  question_type: QuestionType
  grade: number
  difficulty: number
  content: QuestionContent
  answer: QuestionAnswer
  explanation: string
}

export interface User {
  id: number
  name: string
  created_at: string
}

export interface AnswerRecord {
  id: number
  user_id: number
  question_id: number
  user_answer: string
  is_correct: number
  created_at: string
}

export interface Progress {
  id: number
  user_id: number
  subject: Subject
  question_type: QuestionType
  total: number
  correct: number
  updated_at: string
}

export interface MathFormula {
  id: number
  grade: number
  category: string
  name: string
  formula: string
  description: string
}

// 应用状态
export interface UserAnswer {
  questionId: number
  userAnswer: string
  isCorrect: boolean
}

export interface PracticeSession {
  subject: Subject
  questionType: QuestionType
  questions: Question[]
  currentIndex: number
  answers: UserAnswer[]
  isFinished: boolean
}
