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
import { reactive, watch } from 'vue'
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
