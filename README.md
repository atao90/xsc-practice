# 小升初练习 App

面向小学六年级学生的小升初练习题复习应用，涵盖**语文、数学、英语**三大板块。

## 技术栈

| 层级 | 选型 |
|------|------|
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite |
| UI 组件库 | Vant 4（移动端优先） |
| 路由 | Vue Router 4 |
| 数据库 | SQLite（开发环境: sql.js WASM，APK: capacitor-community/sqlite） |
| 打包 | Capacitor（Web → Android APK） |
| 后端 | 无，纯前端离线运行 |

## 功能

### 语文
- 拼音写汉字、补全诗词、修改病句、课内阅读、课外阅读

### 数学
- 1-6 年级公式大全，各年级对应题型练习

### 英语
- 单词拼写、句子练习、阅读理解

### 通用
- 随机出题（每次 20 题）、即时批改 + 解析、错题本、学习进度统计
- 多用户切换（输入名字即可，无密码）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:5173
```

## 部署

### Web 部署

```bash
npm run build
# 将 dist/ 目录部署到任意静态服务器（Nginx 等）
```

### Android APK 打包

```bash
# 添加 Android 平台
npx cap add android

# 同步前端代码到原生项目
npx cap sync

# 打开 Android Studio 打包
npx cap open android
# Android Studio → Build → Build Bundle(s) / APK(s) → Build APK(s)
```

## 项目结构

```
src/
├── subjects/
│   ├── chinese/          # 语文模块（页面 + 题型组件 + 题库）
│   ├── math/             # 数学模块（页面 + 公式列表 + 题库）
│   └── english/          # 英语模块（页面 + 题型组件 + 题库）
├── shared/               # 共享服务层
│   ├── database/         # SQLite 封装 + CRUD
│   ├── scoring/          # 评分引擎
│   └── user/             # 用户管理
├── pages/                # 通用页面
│   ├── PracticePage.vue  # 统一练习页（所有题型共用）
│   ├── ReportPage.vue    # 学习报告 + 用户切换
│   └── ErrorBookPage.vue # 错题本
├── router/               # Vue Router
├── types/                # TypeScript 类型
├── App.vue               # 底部 TabBar 壳
└── main.ts               # 入口 + 题库初始化
```

## 题库格式

题目以 TypeScript 文件导出，首次启动自动导入 SQLite。

### 选择题

```typescript
{
  subject: '语文', question_type: '改错', grade: 6, difficulty: 1,
  content: {
    stem: '题目描述',
    options: [{ key: 'A', text: '选项A' }, ...]
  },
  answer: { type: 'choice', value: 'A' },
  explanation: '解析说明'
}
```

### 填空题

```typescript
{
  subject: '语文', question_type: '拼音', grade: 6, difficulty: 1,
  content: { stem: '看拼音写汉字：tài yáng', hint: '可选提示' },
  answer: { type: 'text', value: '太阳' },
  explanation: '解析说明'
}
```

### 阅读理解

```typescript
{
  subject: '英语', question_type: '英语阅读', grade: 6, difficulty: 2,
  content: {
    passage: '文章内容...',
    questions: [
      { stem: '问题1', options: [{ key: 'A', text: '...' }, ...] }
    ]
  },
  answer: { type: 'reading', value: ['A', 'B'] },
  explanation: '解析说明'
}
```

## 添加题目

1. 在对应学科 `data/` 目录下编辑题库文件
2. 按上述格式添加题目对象到数组中
3. 重新运行 `npm run dev`，新题目自动导入
