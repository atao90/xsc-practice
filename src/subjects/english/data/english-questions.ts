import type { Question } from '@/types'

export const englishQuestions: Omit<Question, 'id'>[] = [
  { subject: '英语', question_type: '单词', grade: 6, difficulty: 1,
    content: { stem: '请拼写单词：苹果', hint: 'a____e' },
    answer: { type: 'text', value: 'apple' },
    explanation: 'apple: a-p-p-l-e，是一种常见的水果。' },
  { subject: '英语', question_type: '单词', grade: 6, difficulty: 1,
    content: { stem: '请拼写单词：香蕉', hint: 'b_____' },
    answer: { type: 'text', value: 'banana' },
    explanation: 'banana: b-a-n-a-n-a，注意有3个a和2个n。' },
  { subject: '英语', question_type: '单词', grade: 6, difficulty: 1,
    content: { stem: '请拼写单词：学生', hint: 's______' },
    answer: { type: 'text', value: 'student' },
    explanation: 'student: s-t-u-d-e-n-t，注意结尾是-ent不是-ant。' },
  { subject: '英语', question_type: '单词', grade: 6, difficulty: 2,
    content: { stem: '请拼写单词：图书馆', hint: 'l______' },
    answer: { type: 'text', value: 'library' },
    explanation: 'library: l-i-b-r-a-r-y，注意有两个r。' },
  { subject: '英语', question_type: '单词', grade: 6, difficulty: 2,
    content: { stem: '请拼写单词：天气', hint: 'w______' },
    answer: { type: 'text', value: 'weather' },
    explanation: 'weather: w-e-a-t-h-e-r，注意不要和whether混淆。' },
  { subject: '英语', question_type: '句子', grade: 6, difficulty: 1,
    content: { stem: '选择正确的句子：', options: [
      { key: 'A', text: 'She are a student.' }, { key: 'B', text: 'She is a student.' },
      { key: 'C', text: 'She am a student.' }, { key: 'D', text: 'She be a student.' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: '主语 She 是第三人称单数，be动词用 is。' },
  { subject: '英语', question_type: '句子', grade: 6, difficulty: 1,
    content: { stem: '"他每天骑自行车上学"的正确翻译是：', options: [
      { key: 'A', text: 'He go to school by bike every day.' }, { key: 'B', text: 'He goes to school by bike every day.' },
      { key: 'C', text: 'He going to school by bike every day.' }, { key: 'D', text: 'He went to school by bike every day.' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: 'every day 表示一般现在时，主语 He 三单，动词 go 要加 -es 变成 goes。' },
  { subject: '英语', question_type: '英语阅读', grade: 6, difficulty: 2,
    content: { passage: 'Tom is a student. He is twelve years old. He gets up at 6:30 every morning. He goes to school at 7:30. He likes English and math. After school, he often plays basketball with his friends. He goes home at 5:00 in the afternoon. He does his homework after dinner. He goes to bed at 9:00.',
      questions: [
        { stem: 'How old is Tom?', options: [{ key: 'A', text: 'Ten' }, { key: 'B', text: 'Eleven' }, { key: 'C', text: 'Twelve' }, { key: 'D', text: 'Thirteen' }] },
        { stem: 'What does Tom often do after school?', options: [{ key: 'A', text: 'Watch TV' }, { key: 'B', text: 'Play basketball' }, { key: 'C', text: 'Play football' }, { key: 'D', text: 'Go home' }] },
        { stem: 'When does Tom do his homework?', options: [{ key: 'A', text: 'After school' }, { key: 'B', text: 'Before dinner' }, { key: 'C', text: 'After dinner' }, { key: 'D', text: 'In the morning' }] }
      ]
    },
    answer: { type: 'reading', value: ['C', 'B', 'C'] },
    explanation: '1. "He is twelve years old." 2. "he often plays basketball with his friends." 3. "He does his homework after dinner."' }
]
