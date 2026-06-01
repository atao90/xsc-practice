<template>
  <div class="formula-card">
    <div class="formula-name">{{ formula.name }}</div>
    <div class="formula-text">{{ formula.formula }}</div>
    <div class="formula-desc" v-if="formula.description">{{ formula.description }}</div>
  </div>
</template>

<script setup lang="ts">
import type { MathFormula } from '@/types'
defineProps<{ formula: MathFormula }>()
</script>

<style scoped>
.formula-card {
  background: #fff; border-radius: 10px; padding: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.formula-name { font-size: 15px; font-weight: 600; }
.formula-text { font-size: 18px; font-weight: bold; color: #1989fa; padding: 8px 0; }
.formula-desc { font-size: 12px; color: #999; }
</style>
