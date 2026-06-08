# Android APK 打包与手机安装操作指南

本文档用于记录本项目从“修改业务代码”到“通过 GitHub Actions 云端打包 APK，再安装到手机”的完整操作流程。以后每次改完代码，可以直接按本文档一步一步执行。

> 适用项目：小升初练习 App  
> 技术路线：Vue 3 + Vite + Capacitor + GitHub Actions  
> 推荐方式：GitHub Actions 云端打包 APK，本机不需要安装 Java、Android Studio、Android SDK、Gradle。

---

## 目录

- [一、整体流程概览](#一整体流程概览)
- [二、每次修改业务代码后的标准操作](#二每次修改业务代码后的标准操作)
- [三、第一次使用 GitHub Actions 打包 APK 的配置步骤](#三第一次使用-github-actions-打包-apk-的配置步骤)
- [四、手动运行 GitHub Actions 打包 APK](#四手动运行-github-actions-打包-apk)
- [五、下载 APK](#五下载-apk)
- [六、安装到手机](#六安装到手机)
- [七、修改 App 图标后如何重新打包](#七修改-app-图标后如何重新打包)
- [八、AI 解答功能的智谱 API Key 配置](#八ai-解答功能的智谱-api-key-配置)
- [九、常见问题处理](#九常见问题处理)
- [十、重要文件说明](#十重要文件说明)

---

## 一、整体流程概览

以后你只需要记住这条主线：

```text
修改业务代码
  ↓
本地测试页面是否正常
  ↓
提交并 push 到 GitHub
  ↓
GitHub Actions 自动/手动打包 APK
  ↓
下载 Actions 生成的 zip
  ↓
解压得到 app-debug.apk
  ↓
发送到手机并安装
```

本机不需要安装 Java 环境。APK 的真正打包工作由 GitHub Actions 的云端 Linux 机器完成。

---

## 二、每次修改业务代码后的标准操作

这是你以后最常用的一套流程。

### 1. 修改业务代码

比如你修改这些内容：

```text
src/
├── pages/
├── subjects/
├── shared/
├── router/
└── App.vue
```

常见修改包括：

- 修改页面样式
- 增加题库
- 修改题目逻辑
- 修改按钮文案
- 修改练习流程
- 修改错题本
- 修改学习报告
- 修改 App 图标

---

### 2. 本地启动预览

在项目根目录执行：

```bash
npm install
npm run dev
```

浏览器打开：

```text
http://localhost:5173
```

确认页面能正常打开，主要功能能正常使用。

> 如果你只是很小的文案修改，也可以不本地预览，但推荐至少运行一次看看。

---

### 3. 本地构建检查，可选但推荐

在项目根目录执行：

```bash
npm run build
```

如果出现类似下面结果，说明 Web 端构建通过：

```text
✓ built in xxxs
```

如果这里失败，GitHub Actions 大概率也会失败，所以要先修复本地错误。

---

### 4. 提交代码

如果你使用命令行：

```bash
git status
git add .
git commit -m "update app"
git push
```

如果你使用 VS Code：

1. 打开左侧 Source Control / 源代码管理
2. 确认修改文件列表
3. 输入提交信息，比如：

```text
update app
```

4. 点击 Commit
5. 点击 Sync Changes / Push

如果你使用 GitHub Desktop：

1. 查看 changed files
2. 输入 Summary，比如：

```text
update app
```

3. 点击 Commit to main
4. 点击 Push origin

---

### 5. 等待 GitHub Actions 打包

push 后，GitHub Actions 通常会自动开始打包。

进入 GitHub 仓库：

```text
Actions -> Build Android APK
```

你会看到一条新的运行记录。

等待它变成绿色对勾：

```text
Success
```

然后就可以下载 APK。

---

## 三、第一次使用 GitHub Actions 打包 APK 的配置步骤

如果仓库里已经有下面文件，就不需要重复做本节：

```text
.github/workflows/android-apk.yml
```

如果没有，就按下面步骤创建。

---

### 1. 在 GitHub 创建 workflow 文件

打开 GitHub 仓库页面，点击：

```text
Add file -> Create new file
```

文件名填写：

```text
.github/workflows/android-apk.yml
```

注意：必须包含 `.github/workflows/` 这个路径。

---

### 2. 粘贴 GitHub Actions 配置

将下面内容完整粘贴进去：

```yaml
name: Build Android APK

on:
  workflow_dispatch:
  push:
    branches:
      - main
      - master

jobs:
  build-apk:
    name: Build Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Install dependencies
        run: npm install

      - name: Build web app
        run: npm run build
        env:
          VITE_ZHIPU_API_KEY: ${{ secrets.VITE_ZHIPU_API_KEY }}
          VITE_ZHIPU_API_URL: https://open.bigmodel.cn/api/paas/v4/chat/completions
          VITE_ZHIPU_MODEL: glm-4-flash

      - name: Sync Capacitor Android project
        run: npx cap sync android

      - name: Make Gradle executable
        run: chmod +x android/gradlew

      - name: Build debug APK
        run: |
          cd android
          ./gradlew assembleDebug

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: xiaoshengchu-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

说明：

- `workflow_dispatch` 表示可以在 GitHub 页面手动点击运行。
- `push` 表示每次 push 到 `main` 或 `master` 分支时自动运行。
- `Setup Java` 是云端打包 APK 所需环境，不需要安装到你的电脑。
- `Build debug APK` 会生成 debug APK。
- `Upload APK` 会把 APK 上传到 GitHub Actions 的 Artifacts 区域，供你下载。

---

### 3. 提交 workflow 文件

点击 GitHub 页面右上角绿色按钮：

```text
Commit changes
```

提交到当前主分支，一般是：

```text
main
```

提交后，GitHub Actions 会自动运行一次。

---

## 四、手动运行 GitHub Actions 打包 APK

如果你想手动重新打包一次，可以这样操作。

### 1. 进入 Actions 页面

打开 GitHub 仓库，点击顶部菜单：

```text
Actions
```

---

### 2. 选择 workflow

左侧点击：

```text
Build Android APK
```

---

### 3. 点击 Run workflow

右侧会看到按钮：

```text
Run workflow
```

点击它。

---

### 4. 选择分支

选择你要打包的分支，一般是：

```text
main
```

---

### 5. 开始运行

再次点击绿色按钮：

```text
Run workflow
```

然后等待运行完成。

---

## 五、下载 APK

### 1. 找到成功的运行记录

进入：

```text
GitHub 仓库 -> Actions -> Build Android APK
```

点击最新的一条运行记录。

成功的运行记录左侧会显示绿色对勾。

---

### 2. 找到 Artifacts

进入运行详情页后，默认在 `Summary` 页面。

往页面最下面滚动，找到：

```text
Artifacts
```

里面应该有：

```text
xiaoshengchu-debug-apk
```

---

### 3. 下载 zip

点击：

```text
xiaoshengchu-debug-apk
```

浏览器会下载一个 zip 文件，类似：

```text
xiaoshengchu-debug-apk.zip
```

---

### 4. 解压 zip

在电脑上右键 zip 文件：

```text
解压到当前文件夹
```

或：

```text
Extract All...
```

解压后，里面应该有：

```text
app-debug.apk
```

这个 `app-debug.apk` 才是真正安装到手机上的文件。

---

## 六、安装到手机

### 方式一：数据线安装，推荐

1. 用 USB 数据线连接手机和电脑。
2. 手机弹出 USB 连接方式时，选择：

```text
文件传输 / MTP
```

3. 在电脑里打开手机存储。
4. 将 `app-debug.apk` 复制到手机的：

```text
Download
```

或：

```text
下载
```

文件夹。

5. 手机打开“文件管理器”。
6. 找到 `app-debug.apk`。
7. 点击安装。

---

### 方式二：QQ / 微信 / 网盘传输

也可以把 `app-debug.apk` 发到手机：

- QQ 我的设备
- 微信文件传输助手
- 网盘
- 邮箱

然后在手机上点击 APK 安装。

注意：微信有时会限制 APK 安装。如果微信打不开，建议改用：

- QQ
- 数据线
- 网盘
- 浏览器下载

---

### 允许安装未知来源应用

第一次安装自己打包的 APK，手机通常会提示：

```text
禁止安装未知来源应用
```

或者：

```text
为了安全，你的手机不允许安装来自此来源的应用
```

按提示进入设置，允许当前 App 安装未知应用。

关键点：

> 你用哪个 App 打开 APK，就给哪个 App 开权限。

例如：

- 用文件管理器打开 APK，就允许“文件管理器”安装未知应用。
- 用浏览器下载 APK，就允许“浏览器”安装未知应用。
- 用 QQ 打开 APK，就允许“QQ”安装未知应用。

常见路径：

```text
设置 -> 安全 -> 安装未知应用
```

或：

```text
设置 -> 应用管理 -> 特殊应用权限 -> 安装未知应用
```

不同品牌手机路径不同，按系统提示操作即可。

---

### 安装新版前是否需要卸载旧版？

通常同一个 debug APK 可以直接覆盖安装。

如果提示：

```text
应用未安装
```

可以尝试：

1. 先卸载手机上的旧版“小升初练习”。
2. 再安装新的 `app-debug.apk`。

注意：

> 卸载旧 App 会清空这个 App 的本地数据，比如答题记录、学习进度等。

---

## 七、修改 App 图标后如何重新打包

Android App 图标在：

```text
android/app/src/main/res/
```

主要相关目录：

```text
android/app/src/main/res/mipmap-mdpi/
android/app/src/main/res/mipmap-hdpi/
android/app/src/main/res/mipmap-xhdpi/
android/app/src/main/res/mipmap-xxhdpi/
android/app/src/main/res/mipmap-xxxhdpi/
android/app/src/main/res/mipmap-anydpi-v26/
```

常见图标文件：

```text
ic_launcher.png
ic_launcher_round.png
ic_launcher_foreground.png
ic_launcher_background.xml
```

推荐方式：

1. 准备一张 `1024 x 1024` 的 PNG 图标。
2. 搜索并打开在线工具：

```text
Android app icon generator
```

或：

```text
Android Asset Studio Launcher Icon
```

3. 上传图标，生成 Android launcher icon。
4. 下载生成的 zip。
5. 将生成的 `mipmap-*` 文件夹覆盖到：

```text
android/app/src/main/res/
```

6. 提交并 push 到 GitHub。
7. GitHub Actions 重新打包 APK。
8. 下载新的 APK 安装到手机。

如果手机桌面图标没有变化，可以：

1. 先卸载旧 App。
2. 再安装新版 APK。

Android 有时会缓存旧图标，卸载重装最稳。

---

## 八、AI 解答功能的智谱 API Key 配置

项目的错题本里有 `AI解答` 功能，会调用智谱大模型接口。

重要提醒：

> 不要把真实 API Key 写进代码，也不要提交到 GitHub。

你之前暴露过的 Key 建议在智谱控制台重置/删除，然后使用新的 Key。

---

### 1. 本地开发时配置 Key

在项目根目录创建文件：

```text
.env.local
```

内容示例：

```env
VITE_ZHIPU_API_KEY=你的新智谱apikey
VITE_ZHIPU_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
VITE_ZHIPU_MODEL=glm-4-flash
```

说明：

- `.env.local` 已被 `.gitignore` 忽略，不会提交到 GitHub。
- 当前项目直接使用 `.env` 配置智谱 Key。
- 修改 `.env` 后，需要重启 `npm run dev`。

---

### 2. GitHub Actions 云端打包时配置 Key

因为 APK 是 GitHub Actions 云端构建的，所以还需要把 Key 配到 GitHub Secrets。

操作步骤：

1. 打开 GitHub 仓库。
2. 进入：

```text
Settings -> Secrets and variables -> Actions
```

3. 点击：

```text
New repository secret
```

4. Name 填：

```text
VITE_ZHIPU_API_KEY
```

5. Secret 填你的新智谱 API Key。
6. 点击保存。

workflow 构建时会通过下面配置注入 Key：

```yaml
- name: Build web app
  run: npm run build
  env:
    VITE_ZHIPU_API_KEY: ${{ secrets.VITE_ZHIPU_API_KEY }}
    VITE_ZHIPU_API_URL: https://open.bigmodel.cn/api/paas/v4/chat/completions
    VITE_ZHIPU_MODEL: glm-4-flash
```

---

### 3. 安全说明

当前方案是“前端直连智谱 API”。优点是简单，不需要服务器。

但要注意：

- `VITE_*` 环境变量会进入前端构建产物。
- APK 可以被逆向分析，所以 Key 仍然可能被提取。
- 该方案适合个人自用、临时验证、低风险场景。
- 如果后续要正式发布给很多人使用，建议改成“后端代理”：Key 放服务器，App 只调用你的后端接口。

---

## 九、常见问题处理

### 1. Actions 里找不到 APK

进入：

```text
Actions -> Build Android APK -> 某一次运行记录 -> Summary
```

往页面底部找：

```text
Artifacts
```

点击：

```text
xiaoshengchu-debug-apk
```

下载 zip。

如果没有 `Artifacts`，检查运行是否成功：

- 绿色对勾：成功，应该有 Artifacts。
- 红色叉号：失败，不会生成 APK。
- 黄色/蓝色转圈：还在运行，继续等待。

---

### 2. Actions 运行失败

点进失败的运行记录，查看失败步骤。

重点看这几个步骤：

```text
Install dependencies
Build web app
Sync Capacitor Android project
Build debug APK
Upload APK
```

常见失败原因：

#### 依赖安装失败

如果 `npm install` 失败，通常是依赖版本或网络问题。

可以重新运行一次 workflow。

#### Web 构建失败

如果 `Build web app` 失败，说明代码本身构建不过。

先在本地运行：

```bash
npm run build
```

修复错误后重新 push。

#### Android 构建失败

如果 `Build debug APK` 失败，查看 Gradle 报错。

常见原因：

- Android 工程文件没有提交完整。
- `android/` 目录缺失。
- Gradle 配置异常。
- Capacitor 同步失败。

---

### 3. 报错：找不到 android/gradlew

说明 GitHub 仓库里没有提交 Android 工程。

确认仓库中是否存在：

```text
android/gradlew
android/app/
android/build.gradle
```

如果没有，需要把本地 `android/` 目录提交到 GitHub。

命令行方式：

```bash
git add android capacitor.config.ts package.json package-lock.json vite.config.ts src/shared/database/index.ts
git commit -m "add android apk build support"
git push
```

---

### 4. 下载的是 zip，不是 APK

这是正常的。

GitHub Actions 的 artifact 下载下来就是 zip。

你需要先解压：

```text
xiaoshengchu-debug-apk.zip
```

解压后得到：

```text
app-debug.apk
```

安装的是 `app-debug.apk`，不是 zip。

---

### 5. 手机提示“解析包时出现问题”

可能原因：

- 你点的是 zip，不是 apk。
- APK 没有下载完整。
- 手机 Android 版本太低。
- APK 构建失败或文件损坏。

处理方式：

1. 确认已经解压 zip。
2. 确认点击的是 `app-debug.apk`。
3. 重新从 GitHub Actions 下载一次 artifact。
4. 重新安装。

---

### 6. 手机提示“应用未安装”

可能原因：

- 手机上已有同包名但签名不同的旧版本。
- 安装包损坏。
- 系统限制安装。

处理方式：

1. 卸载旧版“小升初练习”。
2. 重新安装新的 `app-debug.apk`。
3. 如果仍失败，重新下载 APK。

注意：卸载旧版会清空本地学习记录。

---

### 7. 安装后打开白屏

可能原因：

- Web 构建资源路径错误。
- `sql-wasm-browser.wasm` 没有被打包进去。
- 前端代码运行时报错。

检查：

1. 本地运行：

```bash
npm run build
```

2. 确认构建后存在：

```text
dist/sql-wasm-browser.wasm
```

3. 确认 [vite.config.ts](vite.config.ts) 中有：

```ts
base: './'
```

4. 确认 [src/shared/database/index.ts](src/shared/database/index.ts) 中加载的是：

```text
sql-wasm-browser.wasm
```

---

### 8. 安装后数据没有保留

当前第一版 APK 使用的是：

```text
sql.js + localStorage
```

特点：

- App 内数据保存在本地 WebView 存储中。
- 正常关闭再打开，数据一般会保留。
- 卸载 App 后，数据会被清空。
- 如果手机系统清理 App 数据，学习记录也可能被清空。

如果未来需要更稳定的数据保存，可以再迁移到：

```text
@capacitor-community/sqlite
```

也就是 Android 原生 SQLite。

---

## 十、重要文件说明

### Capacitor 配置

```text
capacitor.config.ts
```

作用：告诉 Capacitor App 名称、包名、Web 构建目录。

关键配置：

```ts
appId: 'com.xiaoshengchu.practice'
appName: '小升初练习'
webDir: 'dist'
```

---

### Android 原生工程

```text
android/
```

作用：真正用于构建 APK 的 Android 工程。

必须提交到 GitHub，否则 GitHub Actions 无法打包 APK。

---

### GitHub Actions 配置

```text
.github/workflows/android-apk.yml
```

作用：让 GitHub 云端自动打包 APK。

---

### Vite 配置

```text
vite.config.ts
```

关键配置：

```ts
base: './'
```

作用：让打包后的静态资源适配 Android WebView。

---

### sql.js WASM 文件

```text
public/sql-wasm-browser.wasm
```

作用：App 内数据库运行依赖的 WASM 文件。

构建后应该出现在：

```text
dist/sql-wasm-browser.wasm
```

---

## 最终日常操作清单

以后每次改完代码，按这个清单走：

```text
1. 修改业务代码
2. 本地运行 npm run dev 查看页面
3. 本地运行 npm run build，确认构建通过
4. git add .
5. git commit -m "update app"
6. git push
7. 打开 GitHub 仓库 -> Actions -> Build Android APK
8. 等待运行成功，看到绿色对勾
9. 进入运行详情页底部 Artifacts
10. 下载 xiaoshengchu-debug-apk.zip
11. 解压得到 app-debug.apk
12. 将 app-debug.apk 传到手机
13. 手机允许未知来源安装
14. 点击安装
15. 打开“小升初练习”验证功能
```

如果只是想重新打包当前代码，不修改代码，可以直接：

```text
GitHub 仓库 -> Actions -> Build Android APK -> Run workflow -> 选择 main -> Run workflow
```

然后下载新的 APK 即可。
