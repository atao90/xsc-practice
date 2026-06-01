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
