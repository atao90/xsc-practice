<template>
  <div class="page">
    <van-nav-bar title="公式大全" left-text="返回" left-arrow fixed placeholder @click-left="router.back()" />
    <div class="content">
      <van-tabs v-model:active="activeGrade" sticky>
        <van-tab v-for="g in 6" :key="g" :title="`${g}年级`" :name="g">
          <div class="formula-list">
            <div v-for="f in formulasByGrade(g)" :key="f.id" class="formula-item">
              <div class="formula-name">{{ f.name }}</div>
              <div class="formula-text">{{ f.formula }}</div>
              <div class="formula-desc" v-if="f.description">{{ f.description }}</div>
              <van-tag type="primary" >{{ f.category }}</van-tag>
            </div>
            <van-empty v-if="formulasByGrade(g).length === 0" description="暂无公式数据" />
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFormulas } from '@/shared/database'
import type { MathFormula } from '@/types'

const router = useRouter()
const activeGrade = ref(6)
const allFormulas = ref<MathFormula[]>([])

onMounted(async () => {
  allFormulas.value = await getFormulas()
})

function formulasByGrade(grade: number): MathFormula[] {
  return allFormulas.value.filter(f => f.grade === grade)
}
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 0 16px 16px; }
.formula-list { padding-top: 12px; display: flex; flex-direction: column; gap: 10px; }
.formula-item {
  background: #fff; border-radius: 10px; padding: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.formula-name { font-size: 15px; font-weight: 600; }
.formula-text {
  font-size: 18px; font-weight: bold; color: #1989fa;
  padding: 8px 0; font-family: 'Georgia', serif;
}
.formula-desc { font-size: 12px; color: #999; margin-bottom: 6px; }
</style>
