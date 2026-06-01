import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import type { Question, User, AnswerRecord, Progress, MathFormula } from '@/types'

let db: SqlJsDatabase
let initPromise: Promise<SqlJsDatabase> | null = null

async function getDb(): Promise<SqlJsDatabase> {
  if (initPromise) return initPromise
  initPromise = (async () => {
    const SQL = await initSqlJs({
      locateFile: () => new URL(`${import.meta.env.BASE_URL}sql-wasm-browser.wasm`, window.location.href).href
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
    return db
  })()
  return initPromise
}

function createTables(db: SqlJsDatabase) {
  db.run('PRAGMA foreign_keys = ON')
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
    const contentParsed = JSON.parse(row.content as string)
    const answerParsed = JSON.parse(row.answer as string)
    rows.push({
      ...row,
      content: contentParsed,
      answer: answerParsed,
      question: {
        id: row.question_id,
        subject: row.subject,
        question_type: row.question_type,
        grade: (row as any).grade || 6,
        difficulty: (row as any).difficulty || 1,
        content: contentParsed,
        answer: answerParsed,
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

export async function getQuestionCount(): Promise<number> {
  const d = await getDb()
  const stmt = d.prepare('SELECT COUNT(*) as count FROM questions')
  stmt.step()
  const result = stmt.getAsObject() as { count: number }
  stmt.free()
  return result.count
}
