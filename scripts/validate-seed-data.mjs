import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { transformSync } from 'esbuild'

async function loadTsExport(filePath, exportName) {
  const source = await readFile(filePath, 'utf8')
  const { code } = transformSync(source, {
    loader: 'ts',
    format: 'esm',
    target: 'es2020',
    treeShaking: true
  })
  const module = await import(`data:text/javascript;charset=utf-8,${encodeURIComponent(code)}`)
  return module[exportName]
}

const chineseQuestions = await loadTsExport('src/subjects/chinese/data/chinese-questions.ts', 'chineseQuestions')
const mathQuestions = await loadTsExport('src/subjects/math/data/math-questions.ts', 'mathQuestions')
const englishQuestions = await loadTsExport('src/subjects/english/data/english-questions.ts', 'englishQuestions')
const mathFormulas = await loadTsExport('src/subjects/math/data/math-formulas.ts', 'mathFormulas')

const errors = []

function fail(message) {
  errors.push(message)
}

function countBy(items, keyFn) {
  const map = new Map()
  for (const item of items) {
    const key = keyFn(item)
    map.set(key, (map.get(key) || 0) + 1)
  }
  return map
}

function assertMinCount(items, subject, type, min) {
  const count = items.filter(q => q.subject === subject && q.question_type === type).length
  if (count < min) fail(`${subject}/${type} 题量不足：${count}/${min}`)
}

function normalize(value) {
  return String(value || '').replace(/\s+/g, '').toLowerCase()
}

const allQuestions = [...chineseQuestions, ...mathQuestions, ...englishQuestions]

assertMinCount(chineseQuestions, '语文', '拼音', 20)
assertMinCount(chineseQuestions, '语文', '诗词', 20)
assertMinCount(chineseQuestions, '语文', '改错', 20)
assertMinCount(chineseQuestions, '语文', '课内阅读', 20)
assertMinCount(chineseQuestions, '语文', '课外阅读', 20)
assertMinCount(mathQuestions, '数学', '计算', 120)
assertMinCount(mathQuestions, '数学', '公式', 20)
assertMinCount(englishQuestions, '英语', '单词', 20)
assertMinCount(englishQuestions, '英语', '句子', 20)
assertMinCount(englishQuestions, '英语', '英语阅读', 20)

for (let grade = 1; grade <= 6; grade++) {
  const count = mathQuestions.filter(q => q.subject === '数学' && q.question_type === '计算' && q.grade === grade).length
  if (count < 20) fail(`数学/计算/${grade}年级 题量不足：${count}/20`)
}

const signatures = new Set()
allQuestions.forEach((q, index) => {
  if (!q.subject || !q.question_type || !q.content || !q.answer || !q.explanation) {
    fail(`第 ${index + 1} 道题字段不完整`)
    return
  }
  if (!Number.isInteger(q.grade) || q.grade < 1 || q.grade > 6) fail(`${q.subject}/${q.question_type} 年级非法：${q.grade}`)
  if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 3) fail(`${q.subject}/${q.question_type} 难度非法：${q.difficulty}`)

  const stem = q.content.sentence || q.content.stem || q.content.passageTitle || q.content.passage || JSON.stringify(q.content)
  const signature = `${q.subject}|${q.question_type}|${q.grade}|${normalize(stem)}|${normalize(JSON.stringify(q.content.options || q.content.questions || ''))}|${normalize(JSON.stringify(q.answer))}`
  if (signatures.has(signature)) fail(`题目重复：${q.subject}/${q.question_type}/${stem}`)
  signatures.add(signature)

  if (q.answer.type === 'choice') {
    const keys = (q.content.options || []).map(option => option.key)
    if (!keys.includes(q.answer.value)) fail(`选择题答案不存在于选项中：${q.content.stem}`)
  } else if (q.answer.type === 'text') {
    const values = Array.isArray(q.answer.value) ? q.answer.value : [q.answer.value]
    if (values.length === 0 || values.some(value => !String(value).trim())) fail(`填空题答案为空：${q.content.stem}`)
  } else if (q.answer.type === 'reading') {
    if (!Array.isArray(q.content.questions)) fail(`阅读题缺少小题：${q.content.passageTitle || q.content.passage}`)
    if (q.content.questions.length !== q.answer.value.length) fail(`阅读题答案数量不匹配：${q.content.passageTitle || q.content.passage}`)
    q.answer.value.forEach((answerKey, answerIndex) => {
      const subQuestion = q.content.questions[answerIndex]
      const keys = (subQuestion?.options || []).map(option => option.key)
      if (!keys.includes(answerKey)) fail(`阅读题第 ${answerIndex + 1} 小题答案不存在：${q.content.passageTitle || q.content.passage}`)
    })
  } else {
    fail(`未知答案类型：${q.answer.type}`)
  }
})

const formulaSignatures = new Set()
const formulaCountByGrade = countBy(mathFormulas, f => f.grade)
for (let grade = 1; grade <= 6; grade++) {
  const count = formulaCountByGrade.get(grade) || 0
  if (count < 8) fail(`${grade} 年级公式数量不足：${count}/8`)
}
mathFormulas.forEach(formula => {
  if (!formula.grade || !formula.category || !formula.name || !formula.formula || !formula.description) {
    fail(`公式字段不完整：${JSON.stringify(formula)}`)
  }
  const signature = `${formula.grade}|${formula.category}|${formula.name}`
  if (formulaSignatures.has(signature)) fail(`公式重复：${signature}`)
  formulaSignatures.add(signature)
})

if (errors.length > 0) {
  console.error('种子数据校验失败：')
  errors.forEach(error => console.error(`- ${error}`))
  process.exit(1)
}

console.log('种子数据校验通过：')
console.log(`- 语文题目：${chineseQuestions.length}`)
console.log(`- 数学题目：${mathQuestions.length}`)
console.log(`- 英语题目：${englishQuestions.length}`)
console.log(`- 数学公式：${mathFormulas.length}`)
