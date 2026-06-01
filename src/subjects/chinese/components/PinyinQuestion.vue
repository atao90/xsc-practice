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
import { ref, computed, watch } from 'vue'
import type { FillBlankContent } from '@/types'

const props = defineProps<{ content: FillBlankContent }>()
const emit = defineEmits<{ 'update:answer': [value: string] }>()

const answer = ref('')

const pinyinText = computed(() => {
  return props.content.stem.replace('看拼音写汉字：', '').replace('根据拼音写汉字：', '').trim()
})

watch(answer, (v) => emit('update:answer', v))
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
