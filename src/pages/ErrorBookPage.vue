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
            <van-tag plain type="danger" >{{ item.question.question_type }}</van-tag>
            <span class="error-time">{{ formatTime(item.created_at) }}</span>
          </div>
          <div class="error-stem">{{ getStem(item.question.content) }}</div>
          <div class="error-answer">
            <span class="wrong-answer">你的答案：{{ item.user_answer }}</span>
            <span class="correct-answer">正确答案：{{ getCorrectAnswer(item.question.answer) }}</span>
          </div>
          <div class="error-actions">
            <van-button size="small" type="primary" plain @click.stop="openAiAnswer(item)">
              AI解答
            </van-button>
            <span class="redo-hint">点击重做 →</span>
          </div>
        </div>
      </div>
    </div>

    <van-popup
      v-model:show="showAiPopup"
      position="bottom"
      round
      closeable
      class="ai-popup"
      @closed="closeAiPopup"
    >
      <div class="ai-panel">
        <div class="ai-title">AI解答</div>

        <div class="ai-section-title">问题信息</div>
        <van-field
          v-model="aiQuestionText"
          type="textarea"
          autosize
          readonly
          class="ai-question-box"
        />

        <div class="ai-section-title">AI讲解</div>
        <div v-if="aiLoading" class="ai-loading">
          <van-loading type="spinner" size="24">正在生成详细解析...</van-loading>
        </div>

        <div v-else-if="aiAnswerText" class="ai-answer">{{ aiAnswerText }}</div>

        <div v-else-if="aiError" class="ai-error">
          <span>{{ aiError }}</span>
          <van-button size="small" type="primary" @click="retryAiExplanation">
            重试
          </van-button>
        </div>

        <div v-else class="ai-empty">点击错题上的 AI解答，自动生成讲解。</div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUser } from '@/shared/user'
import { getErrorRecords, removeErrorRecord } from '@/shared/database'
import { getCorrectAnswerDisplay } from '@/shared/scoring'
import { explainWrongQuestion, formatQuestionContent } from '@/shared/ai/zhipu'
import type { AnswerRecord, Question, QuestionAnswer, QuestionContent } from '@/types'

interface ErrorItem extends AnswerRecord {
  question: Question
}

const router = useRouter()
const { currentUser } = useUser()

const loading = ref(false)
const filterSubject = ref('')
const errors = ref<ErrorItem[]>([])
const showAiPopup = ref(false)
const selectedError = ref<ErrorItem | null>(null)
const aiQuestionText = ref('')
const aiAnswerText = ref('')
const aiLoading = ref(false)
const aiError = ref('')
let aiAbortController: AbortController | null = null

onMounted(() => loadErrors())

async function loadErrors() {
  if (!currentUser.value) return
  loading.value = true
  const subject = filterSubject.value || undefined
  errors.value = await getErrorRecords(currentUser.value.id, subject) as ErrorItem[]
  loading.value = false
}

function getStem(content: QuestionContent): string {
  if ('stem' in content && content.stem) return content.stem.substring(0, 60)
  if ('passage' in content && content.passage) return content.passage.substring(0, 60) + '...'
  return '查看详情'
}

function getCorrectAnswer(answer: QuestionAnswer): string {
  if (!answer) return ''
  return getCorrectAnswerDisplay(answer)
}

function subjectTag(subject: string): 'primary' | 'warning' | 'success' {
  const map: Record<string, 'primary' | 'warning' | 'success'> = {
    '语文': 'primary', '数学': 'warning', '英语': 'success'
  }
  return map[subject] || 'primary'
}

function formatTime(time: string): string {
  if (!time) return ''
  return time.substring(5, 16)
}

async function openAiAnswer(item: ErrorItem) {
  selectedError.value = item
  aiQuestionText.value = buildAiQuestionPreview(item)
  aiAnswerText.value = ''
  aiError.value = ''
  showAiPopup.value = true
  await requestAiExplanation(item)
}

async function requestAiExplanation(item: ErrorItem) {
  if (aiLoading.value) return

  aiAbortController?.abort()
  aiAbortController = new AbortController()
  aiLoading.value = true
  aiError.value = ''

  try {
    aiAnswerText.value = await explainWrongQuestion({
      subject: item.question.subject,
      questionType: item.question.question_type,
      grade: item.question.grade,
      difficulty: item.question.difficulty,
      content: item.question.content,
      userAnswer: item.user_answer,
      correctAnswer: getCorrectAnswer(item.question.answer),
      explanation: item.question.explanation
    }, {
      signal: aiAbortController.signal
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    aiError.value = error instanceof Error ? error.message : 'AI解答失败，请稍后重试'
    showToast(aiError.value)
  } finally {
    aiLoading.value = false
    aiAbortController = null
  }
}

function retryAiExplanation() {
  if (selectedError.value) {
    requestAiExplanation(selectedError.value)
  }
}

function closeAiPopup() {
  aiAbortController?.abort()
  aiAbortController = null
  aiLoading.value = false
}

function buildAiQuestionPreview(item: ErrorItem): string {
  return `学科：${item.question.subject}
题型：${item.question.question_type}
年级：${item.question.grade || '未知'}
难度：${item.question.difficulty || '未知'}

题目内容：
${formatQuestionContent(item.question.content)}

你的答案：${item.user_answer || '未填写'}
正确答案：${getCorrectAnswer(item.question.answer)}
已有解析：${item.question.explanation || '暂无'}`
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
.error-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.redo-hint { font-size: 12px; color: #1989fa; }
.ai-popup { max-height: 85vh; }
.ai-panel {
  max-height: 85vh;
  overflow-y: auto;
  padding: 18px 16px 24px;
}
.ai-title {
  margin-bottom: 16px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}
.ai-section-title {
  margin: 12px 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.ai-question-box { background: #f7f8fa; border-radius: 8px; }
.ai-loading { display: flex; justify-content: center; padding: 24px 0; }
.ai-answer {
  padding: 12px;
  border-radius: 8px;
  background: #f7f8fa;
  color: #333;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
}
.ai-error {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #c62828;
  font-size: 13px;
}
.ai-empty { color: #999; font-size: 13px; text-align: center; padding: 16px 0; }
</style>
