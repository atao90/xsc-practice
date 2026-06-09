<template>
  <div class="page">
    <van-nav-bar title="数学练习" fixed placeholder />
    <div class="content">
      <div class="section-title">📐 公式大全</div>
      <div class="formula-preview" @click="router.push('/math/formulas')">
        <div class="preview-text">查看 1-6 年级所有数学公式</div>
        <van-icon name="arrow" color="#999" />
      </div>

      <div class="section-title" style="margin-top:20px;">🧠 公式练习</div>
      <div class="formula-practice" @click="goFormulaPractice">
        <div>
          <div class="practice-title">公式应用与记忆</div>
          <div class="practice-desc">随机练习小学常用数学公式</div>
        </div>
        <van-icon name="arrow" color="#999" />
      </div>

      <div class="section-title" style="margin-top:20px;">📝 年级练习</div>
      <div class="grade-grid">
        <div
          v-for="grade in 6" :key="grade"
          class="grade-card"
          @click="goGradePractice(grade)"
        >
          <div class="grade-num">{{ grade }}</div>
          <div class="grade-label">年级</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUser } from '@/shared/user'

const router = useRouter()
const { currentUser } = useUser()

function goFormulaPractice() {
  if (!currentUser.value) {
    showToast('请先在「我的」页面输入姓名')
    return
  }
  router.push({ path: '/practice', query: { subject: '数学', type: '公式' } })
}

function goGradePractice(grade: number) {
  if (!currentUser.value) {
    showToast('请先在「我的」页面输入姓名')
    return
  }
  router.push({ path: '/practice', query: { subject: '数学', type: '计算', grade: String(grade) } })
}
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 16px; padding-top: 60px; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.formula-preview {
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px; padding: 20px; color: #fff;
}
.preview-text { font-size: 15px; }
.formula-practice {
  display: flex; align-items: center; justify-content: space-between;
  background: #fff; border-radius: 12px; padding: 18px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.practice-title { font-size: 15px; font-weight: 600; }
.practice-desc { font-size: 12px; color: #999; margin-top: 4px; }
.grade-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.grade-card {
  background: #fff; border-radius: 12px; padding: 20px 16px;
  text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.grade-num { font-size: 32px; font-weight: bold; color: #1989fa; }
.grade-label { font-size: 13px; color: #999; margin-top: 4px; }
</style>
