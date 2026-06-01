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
