<template>
  <div class="page">
    <van-nav-bar :title="title" fixed placeholder @click-left="handleBack">
      <template #left><van-icon name="arrow-left" size="18" /></template>
    </van-nav-bar>

    <div class="content">
      <van-loading v-if="loading" class="loading" type="spinner" size="32" />

      <template v-else-if="!session.isFinished && currentQuestion">
        <div class="progress-bar">
          <van-progress :percentage="progressPercent" stroke-color="#1989fa" />
          <span class="progress-text">{{ session.currentIndex + 1 }} / {{ session.questions.length }}</span>
        </div>

        <div class="question-area">
          <component
            :is="questionComponent"
            :key="session.currentIndex"
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
  '计算': SentenceQuestion,
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
let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null

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

  session.value.subject = subject as Subject
  session.value.questionType = type as QuestionType

  if (!currentUser.value) {
    router.replace('/me')
    return
  }

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

  try {
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
  } catch (e) {
    console.error('保存答题记录失败:', e)
  }

  autoAdvanceTimer = setTimeout(() => {
    autoAdvanceTimer = null
    nextQuestion()
  }, 1500)
}

function nextQuestion() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer)
    autoAdvanceTimer = null
  }
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
.action-area { position: fixed; bottom: 50px; left: 0; right: 0; padding: 12px 16px; background: #fff; box-shadow: 0 -2px 8px rgba(0,0,0,0.06); }
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
