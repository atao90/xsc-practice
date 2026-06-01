import type { Question } from '@/types'

export const mathQuestions: Omit<Question, 'id'>[] = [
  { subject: '数学', question_type: '计算', grade: 6, difficulty: 1,
    content: { stem: '一个圆的半径是 5cm，它的周长是多少？(π取3.14)', options: [
      { key: 'A', text: '15.7cm' }, { key: 'B', text: '31.4cm' }, { key: 'C', text: '78.5cm' }, { key: 'D', text: '10cm' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: 'C = 2πr = 2 × 3.14 × 5 = 31.4cm' },
  { subject: '数学', question_type: '计算', grade: 6, difficulty: 1,
    content: { stem: '一个圆的半径是 3cm，它的面积是多少？(π取3.14)', options: [
      { key: 'A', text: '18.84cm²' }, { key: 'B', text: '9.42cm²' }, { key: 'C', text: '28.26cm²' }, { key: 'D', text: '12.56cm²' }
    ]},
    answer: { type: 'choice', value: 'C' },
    explanation: 'S = πr² = 3.14 × 3² = 3.14 × 9 = 28.26cm²' },
  { subject: '数学', question_type: '计算', grade: 6, difficulty: 2,
    content: { stem: '一个圆柱的底面半径是 2cm，高是 5cm，它的体积是多少？(π取3.14)', options: [
      { key: 'A', text: '31.4cm³' }, { key: 'B', text: '62.8cm³' }, { key: 'C', text: '20cm³' }, { key: 'D', text: '125.6cm³' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: 'V = πr²h = 3.14 × 4 × 5 = 62.8cm³' },
  { subject: '数学', question_type: '计算', grade: 6, difficulty: 2,
    content: { stem: '一个圆锥的底面半径是 3cm，高是 6cm，它的体积是多少？(π取3.14)', options: [
      { key: 'A', text: '169.56cm³' }, { key: 'B', text: '56.52cm³' }, { key: 'C', text: '84.78cm³' }, { key: 'D', text: '28.26cm³' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: 'V = πr²h ÷ 3 = 3.14 × 9 × 6 ÷ 3 = 169.56 ÷ 3 = 56.52cm³' },
  { subject: '数学', question_type: '计算', grade: 5, difficulty: 1,
    content: { stem: '一个梯形，上底 4cm，下底 6cm，高 5cm，面积是多少？', options: [
      { key: 'A', text: '20cm²' }, { key: 'B', text: '50cm²' }, { key: 'C', text: '25cm²' }, { key: 'D', text: '30cm²' }
    ]},
    answer: { type: 'choice', value: 'C' },
    explanation: 'S = (a+b) × h ÷ 2 = (4+6) × 5 ÷ 2 = 10 × 5 ÷ 2 = 25cm²' },
  { subject: '数学', question_type: '计算', grade: 6, difficulty: 3,
    content: { stem: '如果 a:b = 3:4，b:c = 2:5，那么 a:c = ?', options: [
      { key: 'A', text: '3:5' }, { key: 'B', text: '3:10' }, { key: 'C', text: '6:20' }, { key: 'D', text: '3:8' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: 'a:b = 3:4 = 6:8，b:c = 2:5 = 8:20，所以 a:b:c = 6:8:20，a:c = 6:20 = 3:10' }
]
