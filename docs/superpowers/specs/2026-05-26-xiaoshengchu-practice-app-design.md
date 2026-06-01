# 小升初练习 App 设计文档

## 概述

面向小学六年级学生的小升初练习题复习 App，涵盖语文、数学、英语三大板块。支持本地浏览器运行、静态 Web 部署、以及 Android APK 安装。

## 技术栈

| 层级 | 选型 |
|------|------|
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite |
| UI 组件库 | Vant 4（移动端优先） |
| 路由 | Vue Router 4 |
| 数据库 | SQLite（开发环境用 sql.js WASM，APK 用 capacitor-community/sqlite 原生插件） |
| 打包工具 | Capacitor（Web → APK） |
| 后端 | 无，纯前端离线运行 |

## 功能范围

### 语文
- 根据拼音写汉字（填空）
- 补全诗词（填空）
- 修改病句（选择）
- 课内阅读（阅读理解）
- 课外阅读（阅读理解）

### 数学
- 1-6 年级公式大全（公式浏览 + 说明）
- 各年级对应题型练习（选择 + 填空）

### 英语
- 小学常见单词拼写（填空）
- 句子练习（选择 + 填空）
- 阅读理解（选择）

### 通用功能
- 随机出题（每次 20 题一组）
- 答题即时批改 + 解析展示
- 错题自动记录 → 错题本（可按科目筛选、重做）
- 学习进度统计（各科正确率、完成数）
- 简易用户切换（输入名字即可，无密码）

## 架构

```
src/
├── subjects/
│   ├── chinese/          # 语文模块
│   │   ├── pages/        # 拼音、诗词、改错、阅读各页面
│   │   ├── components/   # 题型组件
│   │   └── data/         # 语文题库 JSON
│   ├── math/             # 数学模块
│   │   ├── pages/        # 公式大全、各年级练习
│   │   ├── components/   # 公式卡片、计算题组件
│   │   └── data/         # 数学题库 JSON
│   └── english/          # 英语模块
│       ├── pages/        # 单词、句子、阅读
│       ├── components/   # 拼写、选择、阅读组件
│       └── data/         # 英语题库 JSON
├── shared/               # 共享服务层
│   ├── database/         # SQLite 封装
│   ├── scoring/          # 评分引擎
│   ├── progress/         # 进度追踪
│   └── user/             # 用户管理
├── router/               # Vue Router 配置
├── App.vue               # 底部 TabBar + 路由出口
└── main.ts               # 入口
```

## 导航与路由

底部 TabBar（Vant Tabbar）4 个导航项：

| Tab | 路由 | 内容 |
|-----|------|------|
| 语文 | `/chinese` → `/chinese/:type` | 5 种题型入口 → 练习页 |
| 数学 | `/math` → `/math/formulas` 或 `/math/grade/:grade` | 公式大全 + 年级列表 → 练习页 |
| 英语 | `/english` → `/english/:type` | 3 种题型入口 → 练习页 |
| 我的 | `/me` → `/me/report`, `/me/errors` | 学习报告 + 错题本 |

练习页统一走 `/practice?subject=X&type=Y`，作答流程只写一次，题型渲染由各学科组件负责。

## 数据库设计

### users
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | |
| name | TEXT NOT NULL | 用户名 |
| created_at | TEXT | 创建时间 |

### questions
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | |
| subject | TEXT | 语文/数学/英语 |
| question_type | TEXT | 拼音/诗词/改错/课内阅读/课外阅读/公式/计算/单词/句子/阅读 |
| grade | INT | 1-6（语文英语填 6） |
| difficulty | INT | 1-简单 2-中等 3-困难 |
| content | TEXT (JSON) | 题目内容 |
| answer | TEXT (JSON) | 正确答案 |
| explanation | TEXT | 解析 |

### answer_records
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | |
| user_id | FK → users | |
| question_id | FK → questions | |
| user_answer | TEXT | 用户提交的答案 |
| is_correct | INT | 0/1 |
| created_at | TEXT | 作答时间 |

### progress
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | |
| user_id | FK → users | |
| subject | TEXT | 学科 |
| question_type | TEXT | 题型 |
| total | INT | 总答题数 |
| correct | INT | 正确数 |
| updated_at | TEXT | 最后更新时间 |

### math_formulas
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | |
| grade | INT | 1-6 |
| category | TEXT | 几何/代数/单位换算/应用题 |
| name | TEXT | 公式名称 |
| formula | TEXT | 公式内容 |
| description | TEXT | 公式说明 |

### questions.content / answer JSON 格式

**选择题：**
```json
// content
{ "stem": "题目", "options": [{"key":"A","text":"..."}] }
// answer
{ "type": "choice", "value": "A" }
```

**填空题：**
```json
// content
{ "stem": "题目", "hint": "可选提示" }
// answer
{ "type": "text", "value": "太阳" }
```

**阅读理解：**
```json
// content
{ "passage": "文章内容", "questions": [{"stem":"...","options":[...]}] }
// answer
{ "type": "reading", "value": ["A","B"] }
```

## 答题流程

1. 学生从科目首页选择题型进入
2. 系统从题库随机抽取 20 题，错题优先
3. 逐题展示 → 学生作答 → 提交 → 即时批改 + 显示解析
4. 答对进入下一题，答错自动记录到错题本
5. 完成全部题目后展示成绩汇总（正确率、错题数）
6. 可选择"再做一轮"或"查看错题"

## 评分规则

| 题型 | 判断方式 |
|------|---------|
| 选择题 | 精确匹配选项 key |
| 填空题 | 去除首尾空格后匹配，支持多个可接受答案 |
| 阅读理解 | 逐小题独立判对错 |

## 进度与错题

- progress 表按 (user_id, subject, question_type) 聚合统计
- 学习报告页展示各科正确率、各题型完成数
- 错题本按科目和题型筛选，点击可重做
- 错题答对后从错题本移除

## 部署

### 本地开发
```bash
npm install
npm run dev
# → http://localhost:5173，浏览器打开即用
```

### Web 部署
```bash
npm run build
# dist/ 目录部署到 Nginx 或任意静态服务器
```

### APK 打包
```bash
npx cap add android
npx cap sync
npx cap open android
# Android Studio → Build → Generate APK
```

## 出题策略

- 默认随机抽 20 题
- 错题优先出现
- 连续答对多题后提升难度等级
