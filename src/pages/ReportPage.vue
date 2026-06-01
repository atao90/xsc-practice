<template>
  <div class="page">
    <van-nav-bar title="我的" fixed placeholder />
    <div class="content">
      <div class="user-section">
        <div class="user-avatar">🧑‍🎓</div>
        <div class="user-name" v-if="currentUser" @click="showUserSwitch = true">
          {{ currentUser.name }} <van-icon name="arrow-down" size="12" />
        </div>
        <div class="user-name placeholder" v-else @click="showUserCreate = true">
          点击输入姓名开始学习
        </div>
      </div>

      <van-action-sheet
        v-model:show="showUserSwitch"
        title="切换用户"
        :actions="userActions"
        @select="onUserSelect"
      />

      <van-dialog
        v-model:show="showUserCreate"
        title="输入你的名字"
        show-cancel-button
        @confirm="onCreateUser"
      >
        <div class="dialog-input">
          <van-field v-model="newUserName" placeholder="请输入姓名..." />
        </div>
      </van-dialog>

      <template v-if="currentUser">
        <div class="section-title">📊 学习报告</div>
        <van-tabs v-model:active="reportSubject">
          <van-tab title="语文" name="语文">
            <ReportSubject :subject="'语文'" :progress="filteredProgress" />
          </van-tab>
          <van-tab title="数学" name="数学">
            <ReportSubject :subject="'数学'" :progress="filteredProgress" />
          </van-tab>
          <van-tab title="英语" name="英语">
            <ReportSubject :subject="'英语'" :progress="filteredProgress" />
          </van-tab>
        </van-tabs>

        <div class="section-title" style="margin-top:20px;">⚡ 快捷入口</div>
        <div class="menu-list">
          <div class="menu-item" @click="router.push('/me/errors')">
            <span>📝 错题本</span>
            <van-icon name="arrow" color="#999" />
          </div>
        </div>
      </template>

      <van-empty v-else description="请先输入姓名开始学习" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Progress as VanProgress } from 'vant'
import { useUser } from '@/shared/user'
import { getProgress, getAllUsers } from '@/shared/database'
import type { Progress, User } from '@/types'

const ReportSubject = defineComponent({
  props: { subject: String, progress: Array },
  setup(props) {
    return () => {
      const items = props.progress as Progress[]
      if (items.length === 0) {
        return h('div', { style: 'padding:20px;text-align:center;color:#999;' }, '暂无练习记录')
      }
      return h('div', { style: 'padding:12px 0;display:flex;flex-direction:column;gap:10px;' },
        items.map(p => {
          const rate = p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0
          return h('div', {
            style: 'background:#fff;border-radius:10px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,0.05);'
          }, [
            h('div', { style: 'display:flex;justify-content:space-between;margin-bottom:8px;' }, [
              h('span', { style: 'font-weight:600;' }, p.question_type),
              h('span', { style: 'font-size:13px;color:#999;' }, `${p.correct}/${p.total} · ${rate}%`)
            ]),
            h(VanProgress, { percentage: rate, strokeColor: rate >= 60 ? '#1989fa' : '#ee0a24' })
          ])
        })
      )
    }
  }
})

const router = useRouter()
const { currentUser, login, switchUser } = useUser()

const reportSubject = ref('语文')
const progressData = ref<Progress[]>([])
const showUserSwitch = ref(false)
const showUserCreate = ref(false)
const newUserName = ref('')
const userList = ref<User[]>([])

const filteredProgress = computed(() =>
  progressData.value.filter(p => p.subject === reportSubject.value)
)

const userActions = computed(() => {
  const actions = userList.value.map(u => ({ name: u.name, id: u.id }))
  actions.push({ name: '+ 新建用户', id: -1 })
  return actions
})

onMounted(async () => {
  if (currentUser.value) {
    progressData.value = await getProgress(currentUser.value.id)
  }
  userList.value = await getAllUsers()
})

async function onUserSelect(action: { name: string; id: number }) {
  showUserSwitch.value = false
  if (action.id === -1) {
    showUserCreate.value = true
    return
  }
  await switchUser(action.name)
  progressData.value = await getProgress(currentUser.value!.id)
}

async function onCreateUser() {
  if (!newUserName.value.trim()) return
  await login(newUserName.value.trim())
  userList.value = await getAllUsers()
  progressData.value = []
  newUserName.value = ''
}
</script>

<style scoped>
.page { min-height: 100vh; }
.content { padding: 16px; padding-top: 60px; }
.user-section { text-align: center; padding: 24px 0 20px; }
.user-avatar { font-size: 48px; margin-bottom: 8px; }
.user-name { font-size: 18px; font-weight: 600; }
.user-name.placeholder { color: #1989fa; font-size: 15px; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.menu-list { background: #fff; border-radius: 12px; overflow: hidden; }
.menu-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px; border-bottom: 1px solid #f5f5f5; font-size: 15px;
}
.dialog-input { padding: 16px; }
</style>
