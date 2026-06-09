import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { importQuestions, importFormulas, getMeta, setMeta } from '@/shared/database'
import { chineseQuestions } from '@/subjects/chinese/data/chinese-questions'
import { mathQuestions } from '@/subjects/math/data/math-questions'
import { mathFormulas } from '@/subjects/math/data/math-formulas'
import { englishQuestions } from '@/subjects/english/data/english-questions'

import { Tabbar, TabbarItem, NavBar, Button, Field, RadioGroup, Radio, Checkbox, CheckboxGroup, Progress, Circle, Dialog, ActionSheet, Toast, Popup, Cell, CellGroup, Tag, Empty, Loading, Overlay, Tabs, Tab, Icon } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(router)

const vantComponents = [Tabbar, TabbarItem, NavBar, Button, Field, RadioGroup, Radio, Checkbox, CheckboxGroup, Progress, Circle, Dialog, ActionSheet, Toast, Popup, Cell, CellGroup, Tag, Empty, Loading, Overlay, Tabs, Tab, Icon]
vantComponents.forEach(c => {
  if (c.name) app.component(c.name, c)
})

app.mount('#app')

const CURRENT_SEED_VERSION = '2026-06-question-bank-v2'

async function initData() {
  try {
    const seedVersion = await getMeta('seed_version')
    if (seedVersion === CURRENT_SEED_VERSION) return
    await importQuestions(chineseQuestions as any[])
    await importQuestions(mathQuestions as any[])
    await importQuestions(englishQuestions as any[])
    await importFormulas(mathFormulas)
    await setMeta('seed_version', CURRENT_SEED_VERSION)
  } catch (e) {
    console.error('题库初始化失败:', e)
  }
}
initData()
