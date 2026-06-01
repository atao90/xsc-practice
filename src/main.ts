import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { importQuestions, importFormulas, getQuestionCount } from '@/shared/database'
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

async function initData() {
  try {
    const count = await getQuestionCount()
    if (count > 0) return
    await importQuestions(chineseQuestions as any[])
    await importQuestions(mathQuestions as any[])
    await importQuestions(englishQuestions as any[])
    await importFormulas(mathFormulas)
  } catch (e) {
    console.error('题库初始化失败:', e)
  }
}
initData()
