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
