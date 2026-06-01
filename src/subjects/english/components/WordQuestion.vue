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
