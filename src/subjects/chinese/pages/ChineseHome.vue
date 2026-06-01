<template>
  <div class="page">
    <van-nav-bar title="语文练习" fixed placeholder />
    <div class="content">
      <div class="type-list">
        <div class="type-card" v-for="item in types" :key="item.type" @click="goPractice(item)">
          <div class="type-icon">{{ item.icon }}</div>
          <div class="type-info">
            <div class="type-name">{{ item.name }}</div>
            <div class="type-desc">{{ item.desc }}</div>
          </div>
          <van-icon name="arrow" color="#999" />
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

const types = [
  { type: '拼音', name: '拼音写汉字', desc: '看拼音写出对应的汉字', icon: '✏️' },
  { type: '诗词', name: '补全诗词', desc: '填写诗词中缺失的部分', icon: '📜' },
  { type: '改错', name: '修改病句', desc: '找出并改正句子中的错误', icon: '🔍' },
  { type: '课内阅读', name: '课内阅读', desc: '课本文章阅读理解', icon: '📖' },
  { type: '课外阅读', name: '课外阅读', desc: '课外文章阅读理解', icon: '📚' }
]

function goPractice(item: typeof types[0]) {
  if (!currentUser.value) {
    showToast('请先在「我的」页面输入姓名')
    return
  }
  router.push({ path: '/practice', query: { subject: '语文', type: item.type } })
}
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 16px; padding-top: 60px; }
.type-list { display: flex; flex-direction: column; gap: 12px; }
.type-card {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border-radius: 12px; padding: 18px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.type-icon { font-size: 32px; }
.type-info { flex: 1; }
.type-name { font-size: 16px; font-weight: 600; }
.type-desc { font-size: 12px; color: #999; margin-top: 4px; }
</style>
