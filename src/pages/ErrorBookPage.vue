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
          <div class="redo-hint">点击重做 →</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/shared/user'
import { getErrorRecords, removeErrorRecord } from '@/shared/database'
import { getCorrectAnswerDisplay } from '@/shared/scoring'
import type { AnswerRecord } from '@/types'

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
