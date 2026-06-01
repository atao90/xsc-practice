# 小升初练习 App 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个面向小学六年级学生的三科（语文/数学/英语）练习题复习 App，支持浏览器和 Android APK。

**Architecture:** Vue 3 + Vite + Vant 4 前端，SQLite（sql.js/sqlite 插件）本地数据库，Capacitor APK 打包。按学科分层模块（chinese/math/english），共享数据库/评分/进度/用户服务层，统一练习页 `/practice` 驱动所有题型的作答流程。

**Tech Stack:** Vue 3, TypeScript, Vite, Vant 4, Vue Router 4, sql.js, capacitor-community/sqlite, Capacitor

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/env.d.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "xiaoshengchu-practice",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "vant": "^4.8.0",
    "@vant/use": "^1.6.0",
    "sql.js": "^1.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "vue-tsc": "^2.0.0",
    "@capacitor/core": "^6.0.0",
    "@capacitor/cli": "^6.0.0",
    "@capacitor/android": "^6.0.0",
    "@capacitor-community/sqlite": "^6.0.0"
  }
}
```

- [ ] **Step 2: 安装依赖**

Run: `npm install`

- [ ] **Step 3: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>小升初练习</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 4: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  optimizeDeps: {
    exclude: ['sql.js']
  }
})
```

- [ ] **Step 5: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForExpose": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 6: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: 创建 src/env.d.ts**

```typescript
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

- [ ] **Step 8: 创建 src/main.ts（最小入口）**

```typescript
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

- [ ] **Step 9: 创建 src/App.vue（最小壳）**

```vue
<template>
  <div>小升初练习 App</div>
</template>
```

- [ ] **Step 10: 验证项目能启动**

Run: `npm run dev`
Expected: 浏览器打开 http://localhost:5173 看到 "小升初练习 App"

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + Vue + TS project"
```

---

### Task 2: TypeScript 类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
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
}

export interface FillBlankContent {
  stem: string
  hint?: string
}

export interface ReadingContent {
  passage: string
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
  value: string | string[]  // 多个可接受答案
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: 数据库服务

**Files:**
- Create: `src/shared/database/index.ts`

- [ ] **Step 1: 创建数据库服务**

```typescript
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import type { Question, User, AnswerRecord, Progress, MathFormula } from '@/types'

let db: SqlJsDatabase
let initialized = false

async function getDb(): Promise<SqlJsDatabase> {
  if (!initialized) {
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    })
    // 尝试从 localStorage 恢复
    const saved = localStorage.getItem('xiaoshengchu_db')
    if (saved) {
      const arr = JSON.parse(saved) as number[]
      db = new SQL.Database(new Uint8Array(arr))
    } else {
      db = new SQL.Database()
    }
    createTables(db)
    initialized = true
  }
  return db
}

function createTables(db: SqlJsDatabase) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      question_type TEXT NOT NULL,
      grade INTEGER DEFAULT 6,
      difficulty INTEGER DEFAULT 1,
      content TEXT NOT NULL,
      answer TEXT NOT NULL,
      explanation TEXT DEFAULT ''
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS answer_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      user_answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      question_type TEXT NOT NULL,
      total INTEGER DEFAULT 0,
      correct INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now','localtime')),
      UNIQUE(user_id, subject, question_type),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS math_formulas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grade INTEGER NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      formula TEXT NOT NULL,
      description TEXT DEFAULT ''
    )
  `)
}

function persist() {
  if (db) {
    const arr = Array.from(db.export())
    localStorage.setItem('xiaoshengchu_db', JSON.stringify(arr))
  }
}

// Question API
export async function importQuestions(questions: Omit<Question, 'id'>[]) {
  const d = await getDb()
  const stmt = d.prepare(
    'INSERT OR REPLACE INTO questions (id, subject, question_type, grade, difficulty, content, answer, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
  for (const q of questions) {
    stmt.run([
      (q as Question).id || null,
      q.subject, q.question_type, q.grade, q.difficulty,
      JSON.stringify(q.content), JSON.stringify(q.answer), q.explanation
    ])
  }
  stmt.free()
  persist()
}

export async function getQuestions(
  subject: string,
  questionType: string,
  limit = 20,
  excludeIds: number[] = []
): Promise<Question[]> {
  const d = await getDb()
  let sql = 'SELECT * FROM questions WHERE subject = ? AND question_type = ?'
  const params: (string | number)[] = [subject, questionType]
  if (excludeIds.length > 0) {
    sql += ` AND id NOT IN (${excludeIds.map(() => '?').join(',')})`
    params.push(...excludeIds)
  }
  sql += ' ORDER BY RANDOM() LIMIT ?'
  params.push(limit)
  const stmt = d.prepare(sql)
  stmt.bind(params)
  const rows: Question[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    rows.push({
      ...row,
      content: JSON.parse(row.content as string),
      answer: JSON.parse(row.answer as string)
    } as Question)
  }
  stmt.free()
  return rows
}

export async function getQuestionById(id: number): Promise<Question | null> {
  const d = await getDb()
  const stmt = d.prepare('SELECT * FROM questions WHERE id = ?')
  stmt.bind([id])
  if (stmt.step()) {
    const row = stmt.getAsObject()
    stmt.free()
    return {
      ...row,
      content: JSON.parse(row.content as string),
      answer: JSON.parse(row.answer as string)
    } as Question
  }
  stmt.free()
  return null
}

export async function getWrongQuestionIds(userId: number, subject: string, questionType: string): Promise<number[]> {
  const d = await getDb()
  const stmt = d.prepare(
    `SELECT DISTINCT q.id FROM questions q
     INNER JOIN answer_records ar ON q.id = ar.question_id
     WHERE ar.user_id = ? AND ar.is_correct = 0
     AND q.subject = ? AND q.question_type = ?`
  )
  stmt.bind([userId, subject, questionType])
  const ids: number[] = []
  while (stmt.step()) {
    ids.push(stmt.getAsObject().id as number)
  }
  stmt.free()
  return ids
}

// User API
export async function getOrCreateUser(name: string): Promise<User> {
  const d = await getDb()
  let stmt = d.prepare('SELECT * FROM users WHERE name = ?')
  stmt.bind([name])
  if (stmt.step()) {
    const row = stmt.getAsObject() as User
    stmt.free()
    return row
  }
  stmt.free()
  stmt = d.prepare('INSERT INTO users (name) VALUES (?)')
  stmt.run([name])
  stmt.free()
  persist()
  stmt = d.prepare('SELECT * FROM users WHERE name = ?')
  stmt.bind([name])
  stmt.step()
  const row = stmt.getAsObject() as User
  stmt.free()
  return row
}

export async function getAllUsers(): Promise<User[]> {
  const d = await getDb()
  const stmt = d.prepare('SELECT * FROM users ORDER BY created_at DESC')
  const rows: User[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as User)
  }
  stmt.free()
  return rows
}

// Answer Record API
export async function saveAnswerRecord(record: Omit<AnswerRecord, 'id' | 'created_at'>) {
  const d = await getDb()
  const stmt = d.prepare(
    'INSERT INTO answer_records (user_id, question_id, user_answer, is_correct) VALUES (?, ?, ?, ?)'
  )
  stmt.run([record.user_id, record.question_id, record.user_answer, record.is_correct ? 1 : 0])
  stmt.free()
  persist()
}

export async function getErrorRecords(userId: number, subject?: string): Promise<(AnswerRecord & { question: Question })[]> {
  const d = await getDb()
  let sql = `SELECT ar.*, q.subject, q.question_type, q.content, q.answer, q.explanation, q.grade, q.difficulty
             FROM answer_records ar
             INNER JOIN questions q ON ar.question_id = q.id
             WHERE ar.user_id = ? AND ar.is_correct = 0`
  const params: (number | string)[] = [userId]
  if (subject) {
    sql += ' AND q.subject = ?'
    params.push(subject)
  }
  sql += ' ORDER BY ar.created_at DESC LIMIT 200'
  const stmt = d.prepare(sql)
  stmt.bind(params)
  const rows: any[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    rows.push({
      ...row,
      content: JSON.parse(row.content as string),
      answer: JSON.parse(row.answer as string),
      question: {
        id: row.question_id,
        subject: row.subject,
        question_type: row.question_type,
        content: JSON.parse(row.content as string),
        answer: JSON.parse(row.answer as string),
        explanation: row.explanation
      }
    })
  }
  stmt.free()
  return rows
}

export async function removeErrorRecord(userId: number, questionId: number) {
  const d = await getDb()
  d.run('DELETE FROM answer_records WHERE user_id = ? AND question_id = ? AND is_correct = 0', [userId, questionId])
  persist()
}

// Progress API
export async function updateProgress(userId: number, subject: string, questionType: string, isCorrect: boolean) {
  const d = await getDb()
  d.run(
    `INSERT INTO progress (user_id, subject, question_type, total, correct, updated_at)
     VALUES (?, ?, ?, 1, ?, datetime('now','localtime'))
     ON CONFLICT(user_id, subject, question_type)
     DO UPDATE SET total = total + 1, correct = correct + ?,
     updated_at = datetime('now','localtime')`,
    [userId, subject, questionType, isCorrect ? 1 : 0, isCorrect ? 1 : 0]
  )
  persist()
}

export async function getProgress(userId: number): Promise<Progress[]> {
  const d = await getDb()
  const stmt = d.prepare('SELECT * FROM progress WHERE user_id = ? ORDER BY subject, question_type')
  stmt.bind([userId])
  const rows: Progress[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as Progress)
  }
  stmt.free()
  return rows
}

// Formula API
export async function importFormulas(formulas: Omit<MathFormula, 'id'>[]) {
  const d = await getDb()
  const stmt = d.prepare(
    'INSERT OR REPLACE INTO math_formulas (id, grade, category, name, formula, description) VALUES (?, ?, ?, ?, ?, ?)'
  )
  for (const f of formulas) {
    stmt.run([(f as MathFormula).id || null, f.grade, f.category, f.name, f.formula, f.description])
  }
  stmt.free()
  persist()
}

export async function getFormulas(grade?: number): Promise<MathFormula[]> {
  const d = await getDb()
  let sql = 'SELECT * FROM math_formulas'
  const params: number[] = []
  if (grade) {
    sql += ' WHERE grade = ?'
    params.push(grade)
  }
  sql += ' ORDER BY grade, id'
  const stmt = d.prepare(sql)
  if (params.length > 0) stmt.bind(params)
  const rows: MathFormula[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as MathFormula)
  }
  stmt.free()
  return rows
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/database/index.ts
git commit -m "feat: add database service with SQLite via sql.js"
```

---

### Task 4: 用户管理服务

**Files:**
- Create: `src/shared/user/index.ts`

- [ ] **Step 1: 创建用户管理服务**

```typescript
import { ref } from 'vue'
import { getOrCreateUser, getAllUsers } from '@/shared/database'
import type { User } from '@/types'

const currentUser = ref<User | null>(null)

function getSavedUserId(): number | null {
  const id = localStorage.getItem('xiaoshengchu_user_id')
  return id ? Number(id) : null
}

function saveUserId(id: number) {
  localStorage.setItem('xiaoshengchu_user_id', String(id))
}

export function useUser() {
  async function login(name: string): Promise<User> {
    const user = await getOrCreateUser(name)
    currentUser.value = user
    saveUserId(user.id)
    return user
  }

  async function switchUser(name: string): Promise<User> {
    const user = await getOrCreateUser(name)
    currentUser.value = user
    saveUserId(user.id)
    return user
  }

  async function fetchUsers(): Promise<User[]> {
    return getAllUsers()
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('xiaoshengchu_user_id')
  }

  return {
    currentUser,
    login,
    switchUser,
    fetchUsers,
    logout,
    getSavedUserId
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/user/index.ts
git commit -m "feat: add user management service"
```

---

### Task 5: 评分引擎

**Files:**
- Create: `src/shared/scoring/index.ts`

- [ ] **Step 1: 创建评分引擎**

```typescript
import type { QuestionAnswer, ChoiceAnswer, TextAnswer, ReadingAnswer, ChoiceContent, ReadingContent } from '@/types'

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
  // 统一格式化用户答案用于存储
  return userInput.trim()
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/scoring/index.ts
git commit -m "feat: add scoring engine"
```

---

### Task 6: 路由配置

**Files:**
- Create: `src/router/index.ts`

- [ ] **Step 1: 创建路由配置**

```typescript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/chinese'
    },
    {
      path: '/chinese',
      name: 'ChineseHome',
      component: () => import('@/subjects/chinese/pages/ChineseHome.vue')
    },
    {
      path: '/math',
      name: 'MathHome',
      component: () => import('@/subjects/math/pages/MathHome.vue')
    },
    {
      path: '/math/formulas',
      name: 'FormulaList',
      component: () => import('@/subjects/math/pages/FormulaList.vue')
    },
    {
      path: '/english',
      name: 'EnglishHome',
      component: () => import('@/subjects/english/pages/EnglishHome.vue')
    },
    {
      path: '/practice',
      name: 'Practice',
      component: () => import('@/pages/PracticePage.vue')
    },
    {
      path: '/me',
      name: 'Me',
      component: () => import('@/pages/ReportPage.vue')
    },
    {
      path: '/me/errors',
      name: 'ErrorBook',
      component: () => import('@/pages/ErrorBookPage.vue')
    }
  ]
})

export default router
```

- [ ] **Step 2: Commit**

```bash
git add src/router/index.ts
git commit -m "feat: add Vue Router configuration"
```

---

### Task 7: App 壳 + 底部导航

**Files:**
- Modify: `src/main.ts` — 加入 router 和 Vant
- Modify: `src/App.vue` — 替换为 TabBar 布局

- [ ] **Step 1: 更新 src/main.ts**

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 按需引入 Vant 组件
import { Tabbar, TabbarItem, NavBar, Button, Input, Radio, RadioGroup, Checkbox, CheckboxGroup, Progress, Circle, Dialog, ActionSheet, Toast, Popup, Cell, CellGroup, Tag, Empty, Loading, Overlay } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(router)

// 注册 Vant 组件
const vantComponents = [Tabbar, TabbarItem, NavBar, Button, Input, Radio, RadioGroup, Checkbox, CheckboxGroup, Progress, Circle, Dialog, ActionSheet, Toast, Popup, Cell, CellGroup, Tag, Empty, Loading, Overlay]
vantComponents.forEach(c => app.component(c.name!, c))

app.mount('#app')
```

- [ ] **Step 2: 替换 src/App.vue**

```vue
<template>
  <div class="app-container">
    <router-view />
    <van-tabbar v-model="activeTab" :fixed="true" @change="onTabChange">
      <van-tabbar-item icon="bookmark-o" to="/chinese">语文</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" to="/math">数学</van-tabbar-item>
      <van-tabbar-item icon="font-o" to="/english">英语</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/me">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(0)

const tabMap: Record<string, number> = {
  '/chinese': 0,
  '/math': 0,
  '/english': 0,
  '/me': 0
}

watch(() => route.path, (path) => {
  if (path.startsWith('/chinese')) activeTab.value = 0
  else if (path.startsWith('/math')) activeTab.value = 1
  else if (path.startsWith('/english')) activeTab.value = 2
  else if (path.startsWith('/me')) activeTab.value = 3
}, { immediate: true })

function onTabChange(index: number) {
  activeTab.value = index
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f7f8fa;
}
.app-container {
  padding-bottom: 50px;
  min-height: 100vh;
}
</style>
```

- [ ] **Step 3: 验证 TabBar 切换**

Run: `npm run dev`
Expected: 底部 4 个 Tab，点击可切换（页面内容暂时为空）

- [ ] **Step 4: Commit**

```bash
git add src/main.ts src/App.vue
git commit -m "feat: add App shell with Vant TabBar navigation"
```

---

### Task 8: 语文模块 — 首页 + 题型组件

**Files:**
- Create: `src/subjects/chinese/pages/ChineseHome.vue`
- Create: `src/subjects/chinese/components/PinyinQuestion.vue`
- Create: `src/subjects/chinese/components/PoetryQuestion.vue`
- Create: `src/subjects/chinese/components/BingjuQuestion.vue`
- Create: `src/subjects/chinese/components/ChineseReading.vue`

- [ ] **Step 1: 创建 ChineseHome.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="语文练习" fixed placeholder />
    <div class="content">
      <div class="type-list">
        <div class="type-card" v-for="item in types" :key="item.type" @click="goPractice(item)">
          <div class="type-icon">{{ item.icon }}</div>
          <div class="type-info">
            <div class="type-name">{{ item.name }}</div>
            <div class="type-desc">{{ item.desc }}</div>
          </div>
          <van-icon name="arrow" color="#999" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUser } from '@/shared/user'

const router = useRouter()
const { currentUser } = useUser()

const types = [
  { type: '拼音', name: '拼音写汉字', desc: '看拼音写出对应的汉字', icon: '✏️' },
  { type: '诗词', name: '补全诗词', desc: '填写诗词中缺失的部分', icon: '📜' },
  { type: '改错', name: '修改病句', desc: '找出并改正句子中的错误', icon: '🔍' },
  { type: '课内阅读', name: '课内阅读', desc: '课本文章阅读理解', icon: '📖' },
  { type: '课外阅读', name: '课外阅读', desc: '课外文章阅读理解', icon: '📚' }
]

function goPractice(item: typeof types[0]) {
  if (!currentUser.value) {
    showToast('请先在「我的」页面输入姓名')
    return
  }
  router.push({ path: '/practice', query: { subject: '语文', type: item.type } })
}
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 16px; padding-top: 60px; }
.type-list { display: flex; flex-direction: column; gap: 12px; }
.type-card {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border-radius: 12px; padding: 18px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.type-icon { font-size: 32px; }
.type-info { flex: 1; }
.type-name { font-size: 16px; font-weight: 600; }
.type-desc { font-size: 12px; color: #999; margin-top: 4px; }
</style>
```

- [ ] **Step 2: 创建 PinyinQuestion.vue**

```vue
<template>
  <div class="question">
    <div class="stem">{{ content.stem }}</div>
    <div class="pinyin-display">{{ pinyinText }}</div>
    <van-field
      v-model="answer"
      placeholder="请输入汉字..."
      :border="true"
      clearable
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FillBlankContent } from '@/types'

const props = defineProps<{ content: FillBlankContent }>()
const emit = defineEmits<{ 'update:answer': [value: string] }>()

const answer = ref('')

const pinyinText = computed(() => {
  return props.content.stem.replace('看拼音写汉字：', '').replace('根据拼音写汉字：', '').trim()
})

watch(answer, (v) => emit('update:answer', v))
</script>

<script lang="ts">
import { watch } from 'vue'
export default {}
</script>

<style scoped>
.question { padding: 8px 0; }
.stem { font-size: 14px; color: #666; margin-bottom: 8px; }
.pinyin-display {
  font-size: 28px; text-align: center; padding: 20px;
  background: #f0f2f5; border-radius: 10px; margin-bottom: 16px;
  letter-spacing: 4px;
}
</style>
```

- [ ] **Step 3: 创建 PoetryQuestion.vue**

```vue
<template>
  <div class="question">
    <div class="stem">{{ content.stem }}</div>
    <div class="poetry-lines">
      <p v-for="(line, i) in lines" :key="i">
        <template v-for="(seg, j) in line" :key="j">
          <span v-if="seg !== '______'" class="poem-text">{{ seg }}</span>
          <span v-else class="blank-mark">______</span>
        </template>
      </p>
    </div>
    <van-field
      v-model="answer"
      placeholder="输入缺失的部分..."
      :border="true"
      clearable
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FillBlankContent } from '@/types'

const props = defineProps<{ content: FillBlankContent }>()
const emit = defineEmits<{ 'update:answer': [value: string] }>()

const answer = ref('')

// 按换行分割诗句，每行中 "______" 标记为填空位
const lines = computed(() => {
  return props.content.stem.split('\n').map(line => {
    const parts = line.split('______')
    const result: string[] = []
    parts.forEach((p, i) => {
      if (p) result.push(p)
      if (i < parts.length - 1) result.push('______')
    })
    return result.length > 0 ? result : [line]
  })
})

watch(answer, (v) => emit('update:answer', v))
</script>

<style scoped>
.question { padding: 8px 0; }
.stem { font-size: 14px; color: #666; margin-bottom: 8px; }
.poetry-lines {
  text-align: center; padding: 20px; background: #f0f2f5;
  border-radius: 10px; margin-bottom: 16px; font-size: 18px;
  line-height: 2; color: #333;
}
.poem-text { color: #333; }
.blank-mark { color: #1989fa; font-weight: bold; }
</style>
```

- [ ] **Step 4: 创建 BingjuQuestion.vue**

```vue
<template>
  <div class="question">
    <div class="stem">{{ content.stem }}</div>
    <div class="sentence-display">{{ (content as any).sentence }}</div>
    <van-radio-group v-model="selected" class="options-list">
      <van-radio
        v-for="opt in content.options"
        :key="opt.key"
        :name="opt.key"
        class="option-item"
      >
        {{ opt.key }}. {{ opt.text }}
      </van-radio>
    </van-radio-group>
    <input type="hidden" :value="selected" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ChoiceContent } from '@/types'

const props = defineProps<{ content: ChoiceContent & { sentence?: string } }>()
const emit = defineEmits<{ 'update:answer': [value: string] }>()

const selected = ref('')

watch(selected, (v) => emit('update:answer', v))
</script>

<style scoped>
.question { padding: 8px 0; }
.stem { font-size: 14px; color: #666; margin-bottom: 8px; }
.sentence-display {
  font-size: 16px; padding: 14px; background: #fff7e6;
  border-radius: 10px; margin-bottom: 16px; border-left: 3px solid #ff976a;
}
.options-list { display: flex; flex-direction: column; gap: 10px; }
.option-item {
  background: #fff; border-radius: 8px; padding: 12px;
  border: 1px solid #ebedf0;
}
</style>
```

- [ ] **Step 5: 创建 ChineseReading.vue**

```vue
<template>
  <div class="question">
    <div class="passage-card">
      <div class="passage-title">{{ content.passageTitle || '阅读理解' }}</div>
      <div class="passage-text">{{ content.passage }}</div>
    </div>
    <div v-for="(q, qi) in content.questions" :key="qi" class="sub-question">
      <div class="sub-stem">{{ qi + 1 }}. {{ q.stem }}</div>
      <van-radio-group v-model="subAnswers[qi]" class="options-list">
        <van-radio
          v-for="opt in q.options"
          :key="opt.key"
          :name="opt.key"
          class="option-item"
        >
          {{ opt.key }}. {{ opt.text }}
        </van-radio>
      </van-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { ReadingContent } from '@/types'

const props = defineProps<{ content: ReadingContent & { passageTitle?: string } }>()
const emit = defineEmits<{ 'update:answer': [value: string] }>()

const subAnswers = reactive<Record<number, string>>({})

watch(subAnswers, () => {
  const answers = props.content.questions.map((_, i) => subAnswers[i] || '')
  emit('update:answer', JSON.stringify(answers))
}, { deep: true })
</script>

<style scoped>
.question { padding: 8px 0; }
.passage-card {
  background: #fff; border-radius: 10px; padding: 16px;
  margin-bottom: 16px; border: 1px solid #ebedf0;
}
.passage-title { font-size: 16px; font-weight: 600; margin-bottom: 10px; }
.passage-text { font-size: 14px; line-height: 1.8; color: #333; }
.sub-question { margin-bottom: 14px; }
.sub-stem { font-size: 14px; font-weight: 500; margin-bottom: 8px; }
.options-list { display: flex; flex-direction: column; gap: 6px; }
.option-item {
  background: #fff; border-radius: 6px; padding: 8px 12px;
  border: 1px solid #ebedf0; font-size: 13px;
}
</style>
```

- [ ] **Step 6: Commit**

```bash
git add src/subjects/chinese/
git commit -m "feat: add Chinese subject module (home + question components)"
```

---

### Task 9: 数学模块 — 首页 + 公式列表 + 组件

**Files:**
- Create: `src/subjects/math/pages/MathHome.vue`
- Create: `src/subjects/math/pages/FormulaList.vue`
- Create: `src/subjects/math/components/FormulaCard.vue`

- [ ] **Step 1: 创建 MathHome.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="数学练习" fixed placeholder />
    <div class="content">
      <div class="section-title">📐 公式大全</div>
      <div class="formula-preview" @click="router.push('/math/formulas')">
        <div class="preview-text">查看 1-6 年级所有数学公式</div>
        <van-icon name="arrow" color="#999" />
      </div>

      <div class="section-title" style="margin-top:20px;">📝 年级练习</div>
      <div class="grade-grid">
        <div
          v-for="grade in 6" :key="grade"
          class="grade-card"
          @click="goGradePractice(grade)"
        >
          <div class="grade-num">{{ grade }}</div>
          <div class="grade-label">年级</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUser } from '@/shared/user'

const router = useRouter()
const { currentUser } = useUser()

function goGradePractice(grade: number) {
  if (!currentUser.value) {
    showToast('请先在「我的」页面输入姓名')
    return
  }
  router.push({ path: '/practice', query: { subject: '数学', type: '计算', grade: String(grade) } })
}
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 16px; padding-top: 60px; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.formula-preview {
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px; padding: 20px; color: #fff;
}
.preview-text { font-size: 15px; }
.grade-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.grade-card {
  background: #fff; border-radius: 12px; padding: 20px 16px;
  text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.grade-num { font-size: 32px; font-weight: bold; color: #1989fa; }
.grade-label { font-size: 13px; color: #999; margin-top: 4px; }
</style>
```

- [ ] **Step 2: 创建 FormulaList.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="公式大全" left-text="返回" left-arrow fixed placeholder @click-left="router.back()" />
    <div class="content">
      <van-tabs v-model:active="activeGrade" sticky>
        <van-tab v-for="g in 6" :key="g" :title="`${g}年级`" :name="g">
          <div class="formula-list">
            <div v-for="f in formulasByGrade(g)" :key="f.id" class="formula-item">
              <div class="formula-name">{{ f.name }}</div>
              <div class="formula-text">{{ f.formula }}</div>
              <div class="formula-desc" v-if="f.description">{{ f.description }}</div>
              <van-tag type="primary" size="small">{{ f.category }}</van-tag>
            </div>
            <van-empty v-if="formulasByGrade(g).length === 0" description="暂无公式数据" />
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFormulas } from '@/shared/database'
import type { MathFormula } from '@/types'

const router = useRouter()
const activeGrade = ref(6)
const allFormulas = ref<MathFormula[]>([])

onMounted(async () => {
  allFormulas.value = await getFormulas()
})

function formulasByGrade(grade: number): MathFormula[] {
  return allFormulas.value.filter(f => f.grade === grade)
}
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 0 16px 16px; }
.formula-list { padding-top: 12px; display: flex; flex-direction: column; gap: 10px; }
.formula-item {
  background: #fff; border-radius: 10px; padding: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.formula-name { font-size: 15px; font-weight: 600; }
.formula-text {
  font-size: 18px; font-weight: bold; color: #1989fa;
  padding: 8px 0; font-family: 'Georgia', serif;
}
.formula-desc { font-size: 12px; color: #999; margin-bottom: 6px; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/subjects/math/
git commit -m "feat: add Math subject module (home + formula list)"
```

---

### Task 10: 英语模块 — 首页 + 题型组件

**Files:**
- Create: `src/subjects/english/pages/EnglishHome.vue`
- Create: `src/subjects/english/components/WordQuestion.vue`
- Create: `src/subjects/english/components/SentenceQuestion.vue`
- Create: `src/subjects/english/components/EnglishReading.vue`

- [ ] **Step 1: 创建 EnglishHome.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="英语练习" fixed placeholder />
    <div class="content">
      <div class="type-list">
        <div class="type-card" v-for="item in types" :key="item.type" @click="goPractice(item)">
          <div class="type-icon">{{ item.icon }}</div>
          <div class="type-info">
            <div class="type-name">{{ item.name }}</div>
            <div class="type-desc">{{ item.desc }}</div>
          </div>
          <van-icon name="arrow" color="#999" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUser } from '@/shared/user'

const router = useRouter()
const { currentUser } = useUser()

const types = [
  { type: '单词', name: '单词拼写', desc: '根据中文或音标拼写英语单词', icon: '🔤' },
  { type: '句子', name: '句子练习', desc: '选择或填写正确的句子', icon: '📝' },
  { type: '英语阅读', name: '阅读理解', desc: '阅读短文并回答问题', icon: '📰' }
]

function goPractice(item: typeof types[0]) {
  if (!currentUser.value) {
    showToast('请先在「我的」页面输入姓名')
    return
  }
  router.push({ path: '/practice', query: { subject: '英语', type: item.type } })
}
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 16px; padding-top: 60px; }
.type-list { display: flex; flex-direction: column; gap: 12px; }
.type-card {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border-radius: 12px; padding: 18px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.type-icon { font-size: 32px; }
.type-info { flex: 1; }
.type-name { font-size: 16px; font-weight: 600; }
.type-desc { font-size: 12px; color: #999; margin-top: 4px; }
</style>
```

- [ ] **Step 2: 创建 WordQuestion.vue**

```vue
<template>
  <div class="question">
    <div class="stem">{{ content.stem }}</div>
    <div class="word-hint" v-if="content.hint">
      <van-tag type="warning">{{ content.hint }}</van-tag>
    </div>
    <van-field
      v-model="answer"
      placeholder="输入英文单词..."
      :border="true"
      clearable
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FillBlankContent } from '@/types'

const props = defineProps<{ content: FillBlankContent }>()
const emit = defineEmits<{ 'update:answer': [value: string] }>()

const answer = ref('')

watch(answer, (v) => emit('update:answer', v))
</script>

<style scoped>
.question { padding: 8px 0; }
.stem { font-size: 16px; margin-bottom: 12px; }
.word-hint { margin-bottom: 12px; }
</style>
```

- [ ] **Step 3: 创建 SentenceQuestion.vue**（选择题 + 填空通用）

```vue
<template>
  <div class="question">
    <div class="stem">{{ content.stem }}</div>
    <template v-if="isChoice">
      <van-radio-group v-model="selected" class="options-list">
        <van-radio v-for="opt in (content as any).options" :key="opt.key" :name="opt.key" class="option-item">
          {{ opt.key }}. {{ opt.text }}
        </van-radio>
      </van-radio-group>
    </template>
    <template v-else>
      <van-field v-model="answer" placeholder="输入答案..." :border="true" clearable />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ChoiceContent, FillBlankContent } from '@/types'

const props = defineProps<{ content: ChoiceContent | FillBlankContent }>()
const emit = defineEmits<{ 'update:answer': [value: string] }>()

const selected = ref('')
const answer = ref('')

const isChoice = computed(() => 'options' in props.content)

watch(selected, (v) => { if (isChoice.value) emit('update:answer', v) })
watch(answer, (v) => { if (!isChoice.value) emit('update:answer', v) })
</script>

<style scoped>
.question { padding: 8px 0; }
.stem { font-size: 16px; margin-bottom: 14px; }
.options-list { display: flex; flex-direction: column; gap: 8px; }
.option-item {
  background: #fff; border-radius: 8px; padding: 12px;
  border: 1px solid #ebedf0; font-size: 14px;
}
</style>
```

- [ ] **Step 4: 创建 EnglishReading.vue**（复用 ChineseReading 模式）

```vue
<template>
  <div class="question">
    <div class="passage-card">
      <div class="passage-text">{{ content.passage }}</div>
    </div>
    <div v-for="(q, qi) in content.questions" :key="qi" class="sub-question">
      <div class="sub-stem">{{ qi + 1 }}. {{ q.stem }}</div>
      <van-radio-group v-model="subAnswers[qi]" class="options-list">
        <van-radio v-for="opt in q.options" :key="opt.key" :name="opt.key" class="option-item">
          {{ opt.key }}. {{ opt.text }}
        </van-radio>
      </van-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { ReadingContent } from '@/types'

const props = defineProps<{ content: ReadingContent }>()
const emit = defineEmits<{ 'update:answer': [value: string] }>()

const subAnswers = reactive<Record<number, string>>({})

watch(subAnswers, () => {
  const answers = props.content.questions.map((_, i) => subAnswers[i] || '')
  emit('update:answer', JSON.stringify(answers))
}, { deep: true })
</script>

<style scoped>
.question { padding: 8px 0; }
.passage-card {
  background: #fff; border-radius: 10px; padding: 16px;
  margin-bottom: 16px; border: 1px solid #ebedf0;
}
.passage-text { font-size: 14px; line-height: 1.8; color: #333; }
.sub-question { margin-bottom: 14px; }
.sub-stem { font-size: 14px; font-weight: 500; margin-bottom: 8px; }
.options-list { display: flex; flex-direction: column; gap: 6px; }
.option-item {
  background: #fff; border-radius: 6px; padding: 8px 12px;
  border: 1px solid #ebedf0; font-size: 13px;
}
</style>
```

- [ ] **Step 5: Commit**

```bash
git add src/subjects/english/
git commit -m "feat: add English subject module (home + question components)"
```

---

### Task 11: 统一练习页

**Files:**
- Create: `src/pages/PracticePage.vue`

- [ ] **Step 1: 创建 PracticePage.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar :title="title" fixed placeholder @click-left="handleBack">
      <template #left><van-icon name="arrow-left" size="18" /></template>
    </van-nav-bar>

    <div class="content">
      <!-- 加载中 -->
      <van-loading v-if="loading" class="loading" type="spinner" size="32" />

      <!-- 答题中 -->
      <template v-else-if="!session.isFinished && currentQuestion">
        <div class="progress-bar">
          <van-progress :percentage="progressPercent" stroke-color="#1989fa" />
          <span class="progress-text">{{ session.currentIndex + 1 }} / {{ session.questions.length }}</span>
        </div>

        <div class="question-area">
          <component
            :is="questionComponent"
            :content="currentQuestion.content"
            @update:answer="onAnswer"
          />
        </div>

        <div class="action-area">
          <van-button
            v-if="!showResult"
            type="primary"
            block
            :disabled="!currentAnswer"
            @click="submitAnswer"
          >
            提交答案
          </van-button>

          <template v-else>
            <div class="result-card" :class="lastResult?.isCorrect ? 'correct' : 'wrong'">
              <div class="result-icon">{{ lastResult?.isCorrect ? '✅' : '❌' }}</div>
              <div class="result-text">
                {{ lastResult?.isCorrect ? '回答正确!' : '回答错误' }}
              </div>
              <div class="result-detail" v-if="!lastResult?.isCorrect">
                正确答案：{{ lastResult?.correctAnswer }}
              </div>
              <div class="explanation" v-if="currentQuestion.explanation">
                💡 {{ currentQuestion.explanation }}
              </div>
            </div>
            <van-button type="primary" block @click="nextQuestion">
              {{ session.currentIndex < session.questions.length - 1 ? '下一题 →' : '查看成绩' }}
            </van-button>
          </template>
        </div>
      </template>

      <!-- 完成页 -->
      <template v-else-if="session.isFinished">
        <div class="finish-card">
          <div class="finish-icon">🎉</div>
          <div class="finish-score">{{ correctCount }} / {{ session.questions.length }}</div>
          <div class="finish-rate">正确率 {{ correctRate }}%</div>
          <van-circle
            :rate="correctRate"
            :speed="60"
            :text="correctRate + '%'"
            color="#1989fa"
            layer-color="#ebedf0"
            size="120"
          />
          <div class="finish-stats">
            <div class="stat correct-stat">
              <div class="stat-num">{{ correctCount }}</div>
              <div class="stat-label">正确</div>
            </div>
            <div class="stat wrong-stat">
              <div class="stat-num">{{ session.questions.length - correctCount }}</div>
              <div class="stat-label">错误</div>
            </div>
          </div>
          <div class="finish-actions">
            <van-button type="primary" block @click="restart">再做一轮</van-button>
            <van-button plain block style="margin-top:10px;" @click="goErrors">查看错题</van-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showDialog } from 'vant'
import { useUser } from '@/shared/user'
import { getQuestions, getQuestionById, getWrongQuestionIds, saveAnswerRecord, updateProgress } from '@/shared/database'
import { checkAnswer } from '@/shared/scoring'
import type { Question, PracticeSession, UserAnswer, Subject, QuestionType } from '@/types'

// 题型组件映射
import PinyinQuestion from '@/subjects/chinese/components/PinyinQuestion.vue'
import PoetryQuestion from '@/subjects/chinese/components/PoetryQuestion.vue'
import BingjuQuestion from '@/subjects/chinese/components/BingjuQuestion.vue'
import ChineseReading from '@/subjects/chinese/components/ChineseReading.vue'
import WordQuestion from '@/subjects/english/components/WordQuestion.vue'
import SentenceQuestion from '@/subjects/english/components/SentenceQuestion.vue'
import EnglishReading from '@/subjects/english/components/EnglishReading.vue'

const componentMap: Record<string, any> = {
  '拼音': PinyinQuestion,
  '诗词': PoetryQuestion,
  '改错': BingjuQuestion,
  '课内阅读': ChineseReading,
  '课外阅读': ChineseReading,
  '计算': SentenceQuestion,   // 数学选择/填空复用
  '公式': SentenceQuestion,
  '单词': WordQuestion,
  '句子': SentenceQuestion,
  '英语阅读': EnglishReading
}

const route = useRoute()
const router = useRouter()
const { currentUser } = useUser()

const loading = ref(true)
const showResult = ref(false)
const currentAnswer = ref('')
const lastResult = ref<{ isCorrect: boolean; correctAnswer: string } | null>(null)

const session = ref<PracticeSession>({
  subject: '语文',
  questionType: '拼音',
  questions: [],
  currentIndex: 0,
  answers: [],
  isFinished: false
})

const title = computed(() => `${session.value.subject} · ${session.value.questionType}`)

const currentQuestion = computed(() =>
  session.value.questions[session.value.currentIndex] || null
)

const questionComponent = computed(() => {
  if (!currentQuestion.value) return null
  const comp = componentMap[currentQuestion.value.question_type]
  return comp ? markRaw(comp) : null
})

const progressPercent = computed(() => {
  if (session.value.questions.length === 0) return 0
  return Math.round((session.value.currentIndex / session.value.questions.length) * 100)
})

const correctCount = computed(() =>
  session.value.answers.filter(a => a.isCorrect).length
)

const correctRate = computed(() => {
  if (session.value.questions.length === 0) return 0
  return Math.round((correctCount.value / session.value.questions.length) * 100)
})

onMounted(async () => {
  const subject = (route.query.subject as string) || '语文'
  const type = (route.query.type as string) || '拼音'
  const grade = route.query.grade ? Number(route.query.grade) : 6

  session.value.subject = subject as Subject
  session.value.questionType = type as QuestionType

  if (!currentUser.value) {
    router.replace('/me')
    return
  }

  // 错题优先策略：先取错题，不足 20 题时随机补充
  const wrongIds = await getWrongQuestionIds(currentUser.value.id, subject, type)
  let questions: Question[] = []

  if (wrongIds.length > 0) {
    const wrongQuestions: Question[] = []
    for (const id of wrongIds.slice(0, 20)) {
      const q = await getQuestionById(id)
      if (q) wrongQuestions.push(q)
    }
    questions = wrongQuestions
  }

  if (questions.length < 20) {
    const excludeIds = questions.map(q => q.id)
    const more = await getQuestions(subject, type, 20 - questions.length, excludeIds)
    questions = [...questions, ...more]
  }

  session.value.questions = questions
  loading.value = false
})

function onAnswer(val: string) {
  currentAnswer.value = val
}

async function submitAnswer() {
  if (!currentAnswer.value || !currentQuestion.value || !currentUser.value) return

  const result = checkAnswer(currentQuestion.value.answer, currentAnswer.value)
  lastResult.value = result
  showResult.value = true

  const userAnswer: UserAnswer = {
    questionId: currentQuestion.value.id,
    userAnswer: currentAnswer.value,
    isCorrect: result.isCorrect
  }
  session.value.answers.push(userAnswer)

  // 写入数据库
  await saveAnswerRecord({
    user_id: currentUser.value.id,
    question_id: currentQuestion.value.id,
    user_answer: currentAnswer.value,
    is_correct: result.isCorrect ? 1 : 0
  })
  await updateProgress(
    currentUser.value.id,
    session.value.subject,
    session.value.questionType,
    result.isCorrect
  )
}

function nextQuestion() {
  if (session.value.currentIndex < session.value.questions.length - 1) {
    session.value.currentIndex++
    currentAnswer.value = ''
    showResult.value = false
    lastResult.value = null
  } else {
    session.value.isFinished = true
  }
}

function restart() {
  session.value.currentIndex = 0
  session.value.answers = []
  session.value.isFinished = false
  showResult.value = false
  lastResult.value = null
  currentAnswer.value = ''
  // 重新打乱题目顺序
  session.value.questions = [...session.value.questions].sort(() => Math.random() - 0.5)
}

function goErrors() {
  router.push('/me/errors')
}

function handleBack() {
  if (session.value.isFinished) {
    router.back()
    return
  }
  showDialog({
    title: '确认退出',
    message: '当前练习进度将不会保存，确定退出吗？'
  }).then(() => router.back()).catch(() => {})
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f7f8fa; }
.content { padding: 16px; padding-top: 60px; padding-bottom: 80px; }
.loading { display: flex; justify-content: center; padding: 60px 0; }
.progress-bar { margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.progress-bar :deep(.van-progress) { flex: 1; }
.progress-text { font-size: 13px; color: #999; white-space: nowrap; }
.question-area { margin-bottom: 20px; }
.action-area { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: #fff; box-shadow: 0 -2px 8px rgba(0,0,0,0.06); }
.result-card { border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 12px; }
.result-card.correct { background: #e8f5e9; }
.result-card.wrong { background: #fce4ec; }
.result-icon { font-size: 36px; margin-bottom: 8px; }
.result-text { font-size: 18px; font-weight: bold; margin-bottom: 6px; }
.result-card.correct .result-text { color: #2e7d32; }
.result-card.wrong .result-text { color: #c62828; }
.result-detail { font-size: 14px; margin-top: 6px; }
.explanation { font-size: 12px; color: #666; margin-top: 8px; background: rgba(0,0,0,0.03); padding: 8px; border-radius: 6px; }
.finish-card { text-align: center; padding: 20px 0; }
.finish-icon { font-size: 56px; margin-bottom: 10px; }
.finish-score { font-size: 32px; font-weight: bold; color: #1989fa; }
.finish-rate { font-size: 14px; color: #999; margin-bottom: 16px; }
.finish-stats { display: flex; gap: 16px; justify-content: center; margin: 16px 0; }
.stat { border-radius: 12px; padding: 12px 24px; }
.correct-stat { background: #e8f5e9; }
.wrong-stat { background: #fce4ec; }
.stat-num { font-size: 24px; font-weight: bold; }
.correct-stat .stat-num { color: #2e7d32; }
.wrong-stat .stat-num { color: #c62828; }
.stat-label { font-size: 12px; color: #666; }
.finish-actions { padding: 0 16px; margin-top: 20px; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/PracticePage.vue
git commit -m "feat: add unified practice page with question dispatching"
```

---

### Task 12: 学习报告页 + 用户切换

**Files:**
- Create: `src/pages/ReportPage.vue`

- [ ] **Step 1: 创建 ReportPage.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="我的" fixed placeholder />
    <div class="content">
      <!-- 用户区域 -->
      <div class="user-section">
        <div class="user-avatar">🧑‍🎓</div>
        <div class="user-name" v-if="currentUser" @click="showUserSwitch = true">
          {{ currentUser.name }} <van-icon name="arrow-down" size="12" />
        </div>
        <div class="user-name placeholder" v-else @click="showUserCreate = true">
          点击输入姓名开始学习
        </div>
      </div>

      <!-- 用户切换弹窗 -->
      <van-action-sheet
        v-model:show="showUserSwitch"
        title="切换用户"
        :actions="userActions"
        @select="onUserSelect"
      />

      <!-- 新建用户弹窗 -->
      <van-dialog
        v-model:show="showUserCreate"
        title="输入你的名字"
        show-cancel-button
        @confirm="onCreateUser"
      >
        <div class="dialog-input">
          <van-field v-model="newUserName" placeholder="请输入姓名..." />
        </div>
      </van-dialog>

      <!-- 学习报告 -->
      <template v-if="currentUser">
        <div class="section-title">📊 学习报告</div>
        <van-tabs v-model:active="reportSubject">
          <van-tab title="语文" name="语文">
            <ReportSubject :subject="'语文'" :progress="filteredProgress" />
          </van-tab>
          <van-tab title="数学" name="数学">
            <ReportSubject :subject="'数学'" :progress="filteredProgress" />
          </van-tab>
          <van-tab title="英语" name="英语">
            <ReportSubject :subject="'英语'" :progress="filteredProgress" />
          </van-tab>
        </van-tabs>

        <!-- 快捷入口 -->
        <div class="section-title" style="margin-top:20px;">⚡ 快捷入口</div>
        <div class="menu-list">
          <div class="menu-item" @click="router.push('/me/errors')">
            <span>📝 错题本</span>
            <van-icon name="arrow" color="#999" />
          </div>
        </div>
      </template>

      <van-empty v-else description="请先输入姓名开始学习" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/shared/user'
import { getProgress, getAllUsers } from '@/shared/database'
import type { Progress, User } from '@/types'

const router = useRouter()
const { currentUser, login, switchUser, fetchUsers } = useUser()

const reportSubject = ref('语文')
const progressData = ref<Progress[]>([])
const showUserSwitch = ref(false)
const showUserCreate = ref(false)
const newUserName = ref('')
const userList = ref<User[]>([])

const filteredProgress = computed(() =>
  progressData.value.filter(p => p.subject === reportSubject.value)
)

const userActions = computed(() => {
  const actions = userList.value.map(u => ({ name: u.name, id: u.id }))
  actions.push({ name: '+ 新建用户', id: -1 })
  return actions
})

onMounted(async () => {
  if (currentUser.value) {
    progressData.value = await getProgress(currentUser.value.id)
  }
  userList.value = await getAllUsers()
})

async function onUserSelect(action: { name: string; id: number }) {
  showUserSwitch.value = false
  if (action.id === -1) {
    showUserCreate.value = true
    return
  }
  await switchUser(action.name)
  progressData.value = await getProgress(currentUser.value!.id)
}

async function onCreateUser() {
  if (!newUserName.value.trim()) return
  await login(newUserName.value.trim())
  userList.value = await getAllUsers()
  progressData.value = []
  newUserName.value = ''
}
</script>

<script lang="ts">
import { defineComponent, h } from 'vue'
import { Progress as VanProgress } from 'vant'

const ReportSubject = defineComponent({
  props: { subject: String, progress: Array },
  setup(props) {
    return () => {
      const items = props.progress as Progress[]
      if (items.length === 0) {
        return h('div', { style: 'padding:20px;text-align:center;color:#999;' }, '暂无练习记录')
      }
      return h('div', { style: 'padding:12px 0;display:flex;flex-direction:column;gap:10px;' },
        items.map(p => {
          const rate = p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0
          return h('div', {
            style: 'background:#fff;border-radius:10px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,0.05);'
          }, [
            h('div', { style: 'display:flex;justify-content:space-between;margin-bottom:8px;' }, [
              h('span', { style: 'font-weight:600;' }, p.question_type),
              h('span', { style: 'font-size:13px;color:#999;' }, `${p.correct}/${p.total} · ${rate}%`)
            ]),
            h(VanProgress, { percentage: rate, strokeColor: rate >= 60 ? '#1989fa' : '#ee0a24' })
          ])
        })
      )
    }
  }
})
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 16px; padding-top: 60px; }
.user-section { text-align: center; padding: 24px 0 20px; }
.user-avatar { font-size: 48px; margin-bottom: 8px; }
.user-name { font-size: 18px; font-weight: 600; }
.user-name.placeholder { color: #1989fa; font-size: 15px; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.menu-list { background: #fff; border-radius: 12px; overflow: hidden; }
.menu-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px; border-bottom: 1px solid #f5f5f5; font-size: 15px;
}
.dialog-input { padding: 16px; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/ReportPage.vue
git commit -m "feat: add report page with user switching and progress stats"
```

---

### Task 13: 错题本页

**Files:**
- Create: `src/pages/ErrorBookPage.vue`

- [ ] **Step 1: 创建 ErrorBookPage.vue**

```vue
<template>
  <div class="page">
    <van-nav-bar title="错题本" left-text="返回" left-arrow fixed placeholder @click-left="router.back()" />
    <div class="content">
      <van-tabs v-model:active="filterSubject" @change="loadErrors">
        <van-tab title="全部" name="" />
        <van-tab title="语文" name="语文" />
        <van-tab title="数学" name="数学" />
        <van-tab title="英语" name="英语" />
      </van-tabs>

      <van-loading v-if="loading" class="loading" type="spinner" size="24" />
      <van-empty v-else-if="errors.length === 0" description="暂无错题 🎉" />

      <div v-else class="error-list">
        <div v-for="item in errors" :key="item.id" class="error-card" @click="redoError(item)">
          <div class="error-header">
            <van-tag :type="subjectTag(item.question.subject)">{{ item.question.subject }}</van-tag>
            <van-tag plain type="danger" size="small">{{ item.question.question_type }}</van-tag>
            <span class="error-time">{{ formatTime(item.created_at) }}</span>
          </div>
          <div class="error-stem">{{ getStem(item.question.content) }}</div>
          <div class="error-answer">
            <span class="wrong-answer">你的答案：{{ item.user_answer }}</span>
            <span class="correct-answer">正确答案：{{ getCorrectAnswer(item.question.answer) }}</span>
          </div>
          <div class="redo-hint">点击重做 →</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUser } from '@/shared/user'
import { getErrorRecords, removeErrorRecord } from '@/shared/database'
import { getCorrectAnswerDisplay } from '@/shared/scoring'
import type { AnswerRecord, Question, ChoiceContent, FillBlankContent, ReadingContent } from '@/types'

interface ErrorItem extends AnswerRecord {
  question: {
    id: number
    subject: string
    question_type: string
    content: any
    answer: any
    explanation: string
  }
}

const router = useRouter()
const { currentUser } = useUser()

const loading = ref(false)
const filterSubject = ref('')
const errors = ref<ErrorItem[]>([])

onMounted(() => loadErrors())

async function loadErrors() {
  if (!currentUser.value) return
  loading.value = true
  const subject = filterSubject.value || undefined
  errors.value = await getErrorRecords(currentUser.value.id, subject)
  loading.value = false
}

function getStem(content: any): string {
  if (content.stem) return content.stem.substring(0, 60)
  if (content.passage) return content.passage.substring(0, 60) + '...'
  return '查看详情'
}

function getCorrectAnswer(answer: any): string {
  if (!answer) return ''
  return getCorrectAnswerDisplay(answer)
}

function subjectTag(subject: string): string {
  const map: Record<string, 'primary' | 'warning' | 'success'> = {
    '语文': 'primary', '数学': 'warning', '英语': 'success'
  }
  return map[subject] || 'primary'
}

function formatTime(time: string): string {
  if (!time) return ''
  return time.substring(5, 16)
}

async function redoError(item: ErrorItem) {
  await removeErrorRecord(currentUser.value!.id, item.question_id)
  router.push({
    path: '/practice',
    query: {
      subject: item.question.subject,
      type: item.question.question_type
    }
  })
}
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 0 16px 16px; padding-top: 10px; }
.loading { display: flex; justify-content: center; padding: 40px 0; }
.error-list { display: flex; flex-direction: column; gap: 10px; padding-top: 12px; }
.error-card {
  background: #fff; border-radius: 10px; padding: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.error-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.error-time { font-size: 11px; color: #ccc; margin-left: auto; }
.error-stem { font-size: 14px; color: #333; margin-bottom: 8px; }
.error-answer { display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
.wrong-answer { color: #c62828; }
.correct-answer { color: #2e7d32; }
.redo-hint { font-size: 12px; color: #1989fa; margin-top: 8px; text-align: right; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/ErrorBookPage.vue
git commit -m "feat: add error book page with filtering and redo"
```

---

### Task 14: 示例题库数据

**Files:**
- Create: `src/subjects/chinese/data/chinese-questions.ts`
- Create: `src/subjects/math/data/math-formulas.ts`
- Create: `src/subjects/math/data/math-questions.ts`
- Create: `src/subjects/english/data/english-questions.ts`

- [ ] **Step 1: 创建语文题库 chinese-questions.ts**

```typescript
import type { Question } from '@/types'

// 每题不设 id，由数据库自动分配
export const chineseQuestions: Omit<Question, 'id'>[] = [
  // === 拼音写汉字 ===
  {
    subject: '语文', question_type: '拼音', grade: 6, difficulty: 1,
    content: { stem: '看拼音写汉字：tài yáng', hint: '天上发光的那个' },
    answer: { type: 'text', value: '太阳' },
    explanation: '"太"表示程度，"阳"表示阳光。太阳是地球最近的恒星。'
  },
  {
    subject: '语文', question_type: '拼音', grade: 6, difficulty: 1,
    content: { stem: '看拼音写汉字：shū fǎ', hint: '写字的艺术' },
    answer: { type: 'text', value: '书法' },
    explanation: '"书"指书写，"法"指法则方法。书法是写字的艺术。'
  },
  {
    subject: '语文', question_type: '拼音', grade: 6, difficulty: 2,
    content: { stem: '看拼音写汉字：qín miǎn', hint: '勤奋努力' },
    answer: { type: 'text', value: '勤勉' },
    explanation: '"勤"指勤劳不偷懒，"勉"指勉励努力。'
  },
  {
    subject: '语文', question_type: '拼音', grade: 6, difficulty: 2,
    content: { stem: '看拼音写汉字：kuí wú', hint: '形容身材高大' },
    answer: { type: 'text', value: '魁梧' },
    explanation: '"魁"指高大，"梧"指梧桐树高大挺拔。'
  },

  // === 补全诗词 ===
  {
    subject: '语文', question_type: '诗词', grade: 6, difficulty: 1,
    content: { stem: '床前明月光，\n疑是______霜。\n举头望明月，\n低头思故乡。' },
    answer: { type: 'text', value: '地上' },
    explanation: '出自李白《静夜思》。月光照在床前，诗人怀疑是地上结了霜。'
  },
  {
    subject: '语文', question_type: '诗词', grade: 6, difficulty: 1,
    content: { stem: '春眠不觉晓，\n处处闻______。\n夜来风雨声，\n花落知多少。' },
    answer: { type: 'text', value: '啼鸟' },
    explanation: '出自孟浩然《春晓》。春天的早晨，到处都能听到鸟鸣声。'
  },
  {
    subject: '语文', question_type: '诗词', grade: 6, difficulty: 2,
    content: { stem: '______一何怒，\n妇啼一何苦。' },
    answer: { type: 'text', value: '吏呼' },
    explanation: '出自杜甫《石壕吏》。官吏的呼喝多么愤怒，老妇的啼哭多么悲苦。'
  },

  // === 修改病句 ===
  {
    subject: '语文', question_type: '改错', grade: 6, difficulty: 1,
    content: {
      stem: '下面句子有什么问题？请选出正确的修改方式。',
      sentence: '通过这次活动，使我受到了很大的教育。',
      options: [
        { key: 'A', text: '删除"通过"' },
        { key: 'B', text: '删除"使"' },
        { key: 'C', text: '删除"这次活动"' },
        { key: 'D', text: '不用修改' }
      ]
    },
    answer: { type: 'choice', value: 'B' },
    explanation: '句子缺主语。"通过……使……"句式同时出现导致主语缺失，删除"使"即可让"我"成为主语。'
  },
  {
    subject: '语文', question_type: '改错', grade: 6, difficulty: 2,
    content: {
      stem: '下面句子有什么问题？请选出正确的修改方式。',
      sentence: '他经常回忆过去的往事。',
      options: [
        { key: 'A', text: '改为"他经常回忆过去"' },
        { key: 'B', text: '改为"他经常回忆往事"' },
        { key: 'C', text: 'A和B都可以' },
        { key: 'D', text: '不用修改' }
      ]
    },
    answer: { type: 'choice', value: 'C' },
    explanation: '"过去"和"往事"语义重复，删掉任意一个即可。'
  },

  // === 课内阅读 ===
  {
    subject: '语文', question_type: '课内阅读', grade: 6, difficulty: 2,
    content: {
      passageTitle: '《少年闰土》节选',
      passage: '深蓝的天空中挂着一轮金黄的圆月，下面是海边的沙地，都种着一望无际的碧绿的西瓜。其间有一个十一二岁的少年，项带银圈，手捏一柄钢叉，向一匹猹尽力地刺去。那猹却将身一扭，反从他的胯下逃走了。',
      questions: [
        {
          stem: '这段文字描写的是什么时间?',
          options: [
            { key: 'A', text: '清晨' },
            { key: 'B', text: '正午' },
            { key: 'C', text: '夜晚' },
            { key: 'D', text: '傍晚' }
          ]
        },
        {
          stem: '少年手里拿的是什么?',
          options: [
            { key: 'A', text: '木棍' },
            { key: 'B', text: '钢钗' },
            { key: 'C', text: '钢叉' },
            { key: 'D', text: '渔网' }
          ]
        }
      ]
    },
    answer: { type: 'reading', value: ['C', 'C'] },
    explanation: '1. "深蓝的天空""金黄的圆月"表明是夜晚。2. 原文明确写到"手捏一柄钢叉"。'
  },

  // === 课外阅读 ===
  {
    subject: '语文', question_type: '课外阅读', grade: 6, difficulty: 2,
    content: {
      passageTitle: '《小草》',
      passage: '春天来了，小草从土里钻了出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。坐着，躺着，打两个滚，踢几脚球，赛几趟跑，捉几回迷藏。风轻悄悄的，草软绵绵的。',
      questions: [
        {
          stem: '这段文字描写的是什么季节?',
          options: [
            { key: 'A', text: '春天' },
            { key: 'B', text: '夏天' },
            { key: 'C', text: '秋天' },
            { key: 'D', text: '冬天' }
          ]
        },
        {
          stem: '小草给人什么感觉?',
          options: [
            { key: 'A', text: '硬硬的' },
            { key: 'B', text: '软绵绵的' },
            { key: 'C', text: '扎手的' },
            { key: 'D', text: '干枯的' }
          ]
        }
      ]
    },
    answer: { type: 'reading', value: ['A', 'B'] },
    explanation: '1. 原文第一句"春天来了"。2. 原文最后一句"草软绵绵的"。'
  }
]
```

- [ ] **Step 2: 创建数学公式数据 math-formulas.ts**

```typescript
import type { MathFormula } from '@/types'

export const mathFormulas: Omit<MathFormula, 'id'>[] = [
  // 一年级
  { grade: 1, category: '加减法', name: '加法交换律', formula: 'a + b = b + a', description: '两个数相加，交换加数的位置，和不变。' },
  { grade: 1, category: '加减法', name: '凑十法', formula: '9+几 → 凑成10+(几-1)', description: '计算9加几时，先把几分成1和另一个数，9+1=10再加剩下的数。' },

  // 二年级
  { grade: 2, category: '乘法', name: '乘法口诀', formula: '一一得一 ~ 九九八十一', description: '九九乘法口诀表是计算乘除法的基础。' },
  { grade: 2, category: '乘法', name: '乘法交换律', formula: 'a × b = b × a', description: '两个数相乘，交换因数的位置，积不变。' },

  // 三年级
  { grade: 3, category: '几何', name: '长方形周长', formula: 'C = (a + b) × 2', description: '长方形周长 = (长 + 宽) × 2' },
  { grade: 3, category: '几何', name: '正方形周长', formula: 'C = 4a', description: '正方形周长 = 边长 × 4' },
  { grade: 3, category: '几何', name: '长方形面积', formula: 'S = a × b', description: '长方形面积 = 长 × 宽' },
  { grade: 3, category: '几何', name: '正方形面积', formula: 'S = a²', description: '正方形面积 = 边长 × 边长' },

  // 四年级
  { grade: 4, category: '运算律', name: '乘法分配律', formula: '(a + b) × c = a × c + b × c', description: '两个数的和与一个数相乘，可以先把它们分别与这个数相乘，再相加。' },
  { grade: 4, category: '运算律', name: '加法结合律', formula: '(a + b) + c = a + (b + c)', description: '三个数相加，先把前两个数相加再加第三个数，或先把后两个数相加再加第一个数，和不变。' },
  { grade: 4, category: '几何', name: '三角形面积', formula: 'S = a × h ÷ 2', description: '三角形面积 = 底 × 高 ÷ 2' },
  { grade: 4, category: '几何', name: '平行四边形面积', formula: 'S = a × h', description: '平行四边形面积 = 底 × 高' },
  { grade: 4, category: '几何', name: '梯形面积', formula: 'S = (a + b) × h ÷ 2', description: '梯形面积 = (上底 + 下底) × 高 ÷ 2' },

  // 五年级
  { grade: 5, category: '几何', name: '长方体体积', formula: 'V = a × b × h', description: '长方体体积 = 长 × 宽 × 高' },
  { grade: 5, category: '几何', name: '正方体体积', formula: 'V = a³', description: '正方体体积 = 棱长 × 棱长 × 棱长' },
  { grade: 5, category: '分数', name: '分数加减法', formula: 'a/b ± c/d = (ad ± bc) / bd', description: '异分母分数相加减，先通分再计算。' },
  { grade: 5, category: '分数', name: '分数乘法', formula: 'a/b × c/d = ac/bd', description: '分数乘分数，分子乘分子，分母乘分母。' },
  { grade: 5, category: '小数', name: '小数乘法', formula: '先按整数乘，再点小数点', description: '因数中一共有几位小数，就从积的右边起数出几位，点上小数点。' },

  // 六年级
  { grade: 6, category: '几何', name: '圆的周长', formula: 'C = πd = 2πr', description: '圆周长 = 圆周率 × 直径 = 2 × 圆周率 × 半径，π≈3.14' },
  { grade: 6, category: '几何', name: '圆的面积', formula: 'S = πr²', description: '圆面积 = 圆周率 × 半径的平方' },
  { grade: 6, category: '几何', name: '圆柱体积', formula: 'V = πr²h', description: '圆柱体积 = 底面积(πr²) × 高' },
  { grade: 6, category: '几何', name: '圆锥体积', formula: 'V = πr²h ÷ 3', description: '圆锥体积 = 同底等高圆柱体积的 1/3' },
  { grade: 6, category: '比例', name: '比例的基本性质', formula: 'a : b = c : d → ad = bc', description: '在比例里，两个外项的积等于两个内项的积。' },
  { grade: 6, category: '百分数', name: '百分率公式', formula: '百分率 = 数量 ÷ 总数 × 100%', description: '出勤率、合格率、成活率等百分率的通用公式。' }
]
```

- [ ] **Step 3: 创建数学题库 math-questions.ts**

```typescript
import type { Question } from '@/types'

export const mathQuestions: Omit<Question, 'id'>[] = [
  // 六年级计算题（小升初复习重点）
  {
    subject: '数学', question_type: '计算', grade: 6, difficulty: 1,
    content: { stem: '一个圆的半径是 5cm，它的周长是多少？(π取3.14)', options: [
      { key: 'A', text: '15.7cm' }, { key: 'B', text: '31.4cm' },
      { key: 'C', text: '78.5cm' }, { key: 'D', text: '10cm' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: 'C = 2πr = 2 × 3.14 × 5 = 31.4cm'
  },
  {
    subject: '数学', question_type: '计算', grade: 6, difficulty: 1,
    content: { stem: '一个圆的半径是 3cm，它的面积是多少？(π取3.14)', options: [
      { key: 'A', text: '18.84cm²' }, { key: 'B', text: '9.42cm²' },
      { key: 'C', text: '28.26cm²' }, { key: 'D', text: '12.56cm²' }
    ]},
    answer: { type: 'choice', value: 'C' },
    explanation: 'S = πr² = 3.14 × 3² = 3.14 × 9 = 28.26cm²'
  },
  {
    subject: '数学', question_type: '计算', grade: 6, difficulty: 2,
    content: { stem: '一个圆柱的底面半径是 2cm，高是 5cm，它的体积是多少？(π取3.14)', options: [
      { key: 'A', text: '31.4cm³' }, { key: 'B', text: '62.8cm³' },
      { key: 'C', text: '20cm³' }, { key: 'D', text: '125.6cm³' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: 'V = πr²h = 3.14 × 4 × 5 = 62.8cm³'
  },
  {
    subject: '数学', question_type: '计算', grade: 6, difficulty: 2,
    content: { stem: '一个圆锥的底面半径是 3cm，高是 6cm，它的体积是多少？(π取3.14)', options: [
      { key: 'A', text: '169.56cm³' }, { key: 'B', text: '56.52cm³' },
      { key: 'C', text: '84.78cm³' }, { key: 'D', text: '28.26cm³' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: 'V = πr²h ÷ 3 = 3.14 × 9 × 6 ÷ 3 = 169.56 ÷ 3 = 56.52cm³'
  },
  {
    subject: '数学', question_type: '计算', grade: 5, difficulty: 1,
    content: { stem: '一个梯形，上底 4cm，下底 6cm，高 5cm，面积是多少？', options: [
      { key: 'A', text: '20cm²' }, { key: 'B', text: '50cm²' },
      { key: 'C', text: '25cm²' }, { key: 'D', text: '30cm²' }
    ]},
    answer: { type: 'choice', value: 'C' },
    explanation: 'S = (a+b) × h ÷ 2 = (4+6) × 5 ÷ 2 = 10 × 5 ÷ 2 = 25cm²'
  },
  {
    subject: '数学', question_type: '计算', grade: 6, difficulty: 3,
    content: { stem: '如果 a:b = 3:4，b:c = 2:5，那么 a:c = ?', options: [
      { key: 'A', text: '3:5' }, { key: 'B', text: '3:10' },
      { key: 'C', text: '6:20' }, { key: 'D', text: '3:8' }
    ]},
    answer: { type: 'choice', value: 'B' },
    explanation: 'a:b = 3:4 = 6:8，b:c = 2:5 = 8:20，所以 a:b:c = 6:8:20，a:c = 6:20 = 3:10'
  }
]
```

- [ ] **Step 4: 创建英语题库 english-questions.ts**

```typescript
import type { Question } from '@/types'

export const englishQuestions: Omit<Question, 'id'>[] = [
  // === 单词拼写 ===
  {
    subject: '英语', question_type: '单词', grade: 6, difficulty: 1,
    content: { stem: '请拼写单词：苹果', hint: 'a____e' },
    answer: { type: 'text', value: 'apple' },
    explanation: 'apple: a-p-p-l-e，是一种常见的水果。'
  },
  {
    subject: '英语', question_type: '单词', grade: 6, difficulty: 1,
    content: { stem: '请拼写单词：香蕉', hint: 'b_____' },
    answer: { type: 'text', value: 'banana' },
    explanation: 'banana: b-a-n-a-n-a，注意有3个a和2个n。'
  },
  {
    subject: '英语', question_type: '单词', grade: 6, difficulty: 1,
    content: { stem: '请拼写单词：学生', hint: 's______' },
    answer: { type: 'text', value: 'student' },
    explanation: 'student: s-t-u-d-e-n-t，注意结尾是-ent不是-ant。'
  },
  {
    subject: '英语', question_type: '单词', grade: 6, difficulty: 2,
    content: { stem: '请拼写单词：图书馆', hint: 'l______' },
    answer: { type: 'text', value: 'library' },
    explanation: 'library: l-i-b-r-a-r-y，注意有两个r。'
  },
  {
    subject: '英语', question_type: '单词', grade: 6, difficulty: 2,
    content: { stem: '请拼写单词：天气', hint: 'w______' },
    answer: { type: 'text', value: 'weather' },
    explanation: 'weather: w-e-a-t-h-e-r，注意不要和whether混淆。'
  },

  // === 句子练习 ===
  {
    subject: '英语', question_type: '句子', grade: 6, difficulty: 1,
    content: {
      stem: '选择正确的句子：',
      options: [
        { key: 'A', text: 'She are a student.' },
        { key: 'B', text: 'She is a student.' },
        { key: 'C', text: 'She am a student.' },
        { key: 'D', text: 'She be a student.' }
      ]
    },
    answer: { type: 'choice', value: 'B' },
    explanation: '主语 She 是第三人称单数，be动词用 is。'
  },
  {
    subject: '英语', question_type: '句子', grade: 6, difficulty: 1,
    content: {
      stem: '"他每天骑自行车上学"的正确翻译是：',
      options: [
        { key: 'A', text: 'He go to school by bike every day.' },
        { key: 'B', text: 'He goes to school by bike every day.' },
        { key: 'C', text: 'He going to school by bike every day.' },
        { key: 'D', text: 'He went to school by bike every day.' }
      ]
    },
    answer: { type: 'choice', value: 'B' },
    explanation: 'every day 表示一般现在时，主语 He 三单，动词 go 要加 -es 变成 goes。'
  },

  // === 阅读理解 ===
  {
    subject: '英语', question_type: '英语阅读', grade: 6, difficulty: 2,
    content: {
      passage: `Tom is a student. He is twelve years old. He gets up at 6:30 every morning. He goes to school at 7:30. He likes English and math. After school, he often plays basketball with his friends. He goes home at 5:00 in the afternoon. He does his homework after dinner. He goes to bed at 9:00.`,
      questions: [
        {
          stem: 'How old is Tom?',
          options: [
            { key: 'A', text: 'Ten' }, { key: 'B', text: 'Eleven' },
            { key: 'C', text: 'Twelve' }, { key: 'D', text: 'Thirteen' }
          ]
        },
        {
          stem: 'What does Tom often do after school?',
          options: [
            { key: 'A', text: 'Watch TV' }, { key: 'B', text: 'Play basketball' },
            { key: 'C', text: 'Play football' }, { key: 'D', text: 'Go home' }
          ]
        },
        {
          stem: 'When does Tom do his homework?',
          options: [
            { key: 'A', text: 'After school' }, { key: 'B', text: 'Before dinner' },
            { key: 'C', text: 'After dinner' }, { key: 'D', text: 'In the morning' }
          ]
        }
      ]
    },
    answer: { type: 'reading', value: ['C', 'B', 'C'] },
    explanation: '1. "He is twelve years old." 2. "he often plays basketball with his friends." 3. "He does his homework after dinner."'
  }
]
```

- [ ] **Step 5: 在 main.ts 中添加题库导入逻辑。更新 src/main.ts**

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { importQuestions, importFormulas } from '@/shared/database'
import { chineseQuestions } from '@/subjects/chinese/data/chinese-questions'
import { mathQuestions } from '@/subjects/math/data/math-questions'
import { mathFormulas } from '@/subjects/math/data/math-formulas'
import { englishQuestions } from '@/subjects/english/data/english-questions'

// Vant 组件
import { Tabbar, TabbarItem, NavBar, Button, Field, RadioGroup, Radio, Checkbox, CheckboxGroup, Progress, Circle, Dialog, ActionSheet, Toast, Popup, Cell, CellGroup, Tag, Empty, Loading, Overlay, Tabs, Tab, Icon } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(router)

const vantComponents = [Tabbar, TabbarItem, NavBar, Button, Field, RadioGroup, Radio, Checkbox, CheckboxGroup, Progress, Circle, Dialog, ActionSheet, Toast, Popup, Cell, CellGroup, Tag, Empty, Loading, Overlay, Tabs, Tab, Icon]
vantComponents.forEach(c => {
  if (c.name) app.component(c.name, c)
})

app.mount('#app')

// 首次启动时导入题库数据
async function initData() {
  try {
    await importQuestions(chineseQuestions as any[])
    await importQuestions(mathQuestions as any[])
    await importQuestions(englishQuestions as any[])
    await importFormulas(mathFormulas)
  } catch (e) {
    console.error('题库初始化失败:', e)
  }
}
initData()
```

- [ ] **Step 6: Commit**

```bash
git add src/subjects/chinese/data/ src/subjects/math/data/ src/subjects/english/data/ src/main.ts
git commit -m "feat: add sample question bank data for all subjects"
```

---

### Task 15: README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: 创建 README.md**

````markdown
# 小升初练习 App

面向小学六年级学生的小升初练习题复习应用，涵盖**语文、数学、英语**三大板块。

## 技术栈

| 层级 | 选型 |
|------|------|
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite |
| UI 组件库 | Vant 4（移动端优先） |
| 路由 | Vue Router 4 |
| 数据库 | SQLite（开发环境: sql.js WASM，APK: capacitor-community/sqlite） |
| 打包 | Capacitor（Web → Android APK） |
| 后端 | 无，纯前端离线运行 |

## 功能

### 语文
- 拼音写汉字、补全诗词、修改病句、课内阅读、课外阅读

### 数学
- 1-6 年级公式大全，各年级对应题型练习

### 英语
- 单词拼写、句子练习、阅读理解

### 通用
- 随机出题（每次 20 题）、即时批改 + 解析、错题本、学习进度统计
- 多用户切换（输入名字即可，无密码）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:5173
```

## 部署

### Web 部署

```bash
npm run build
# 将 dist/ 目录部署到任意静态服务器（Nginx 等）
```

### Android APK 打包

```bash
# 添加 Android 平台
npx cap add android

# 同步前端代码到原生项目
npx cap sync

# 打开 Android Studio 打包
npx cap open android
# Android Studio → Build → Build Bundle(s) / APK(s) → Build APK(s)
```

## 项目结构

```
src/
├── subjects/
│   ├── chinese/          # 语文模块（页面 + 题型组件 + 题库）
│   ├── math/             # 数学模块（页面 + 公式列表 + 题库）
│   └── english/          # 英语模块（页面 + 题型组件 + 题库）
├── shared/               # 共享服务层
│   ├── database/         # SQLite 封装 + CRUD
│   ├── scoring/          # 评分引擎
│   ├── user/             # 用户管理
│   └── progress/         # 进度追踪（集成在 database 中）
├── pages/                # 通用页面
│   ├── PracticePage.vue  # 统一练习页（所有题型共用）
│   ├── ReportPage.vue    # 学习报告 + 用户切换
│   └── ErrorBookPage.vue # 错题本
├── router/               # Vue Router
├── types/                # TypeScript 类型
├── App.vue               # 底部 TabBar 壳
└── main.ts               # 入口 + 题库初始化
```

## 题库格式

题目以 TypeScript 文件导出，首次启动自动导入 SQLite。

### 选择题

```typescript
{
  subject: '语文', question_type: '改错', grade: 6, difficulty: 1,
  content: {
    stem: '题目描述',
    options: [{ key: 'A', text: '选项A' }, ...]
  },
  answer: { type: 'choice', value: 'A' },
  explanation: '解析说明'
}
```

### 填空题

```typescript
{
  subject: '语文', question_type: '拼音', grade: 6, difficulty: 1,
  content: { stem: '看拼音写汉字：tài yáng', hint: '可选提示' },
  answer: { type: 'text', value: '太阳' },  // 或 ['太阳', '日头'] 多个可接受答案
  explanation: '解析说明'
}
```

### 阅读理解

```typescript
{
  subject: '英语', question_type: '英语阅读', grade: 6, difficulty: 2,
  content: {
    passage: '文章内容...',
    questions: [
      { stem: '问题1', options: [{ key: 'A', text: '...' }, ...] }
    ]
  },
  answer: { type: 'reading', value: ['A', 'B'] },
  explanation: '解析说明'
}
```

## 添加题目

1. 在对应学科 `data/` 目录下编辑题库文件
2. 按上述格式添加题目对象到数组中
3. 重新运行 `npm run dev`，新题目自动导入
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with project overview and usage guide"
```

---

### Task 16: 验证与修复

**Files:**
- 检查所有文件完整性

- [ ] **Step 1: 检查 TypeScript 编译**

Run: `npx vue-tsc --noEmit`
Expected: 无类型错误（如有则修复）

- [ ] **Step 2: 验证 dev 启动**

Run: `npm run dev`
Expected: http://localhost:5173 可访问，4 个 Tab 可切换

- [ ] **Step 3: 验证完整流程**

手动测试：
1. 进入「我的」→ 输入名字 → 确认用户创建成功
2. 进入「语文」→ 点击「拼音写汉字」→ 答题 → 提交 → 查看批改
3. 完成一轮 20 题 → 查看成绩汇总
4. 进入「数学」→ 查看公式大全
5. 进入「英语」→ 答题 → 查看错题本

- [ ] **Step 4: 修复发现的问题并 Commit**

```bash
git add -A
git commit -m "fix: issues found during verification"
```

- [ ] **Step 5: 提交实现计划**

```bash
git add docs/superpowers/plans/2026-05-26-xiaoshengchu-practice-app-plan.md
git commit -m "docs: add implementation plan"
```
