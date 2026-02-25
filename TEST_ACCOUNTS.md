# Campberry Project Guide & Test Accounts
# Campberry 项目完全指南与测试账号
# Campberry 項目完整指南同測試帳號

---

## 🇺🇸 English (Project Guide & Setup)

**Campberry** is an advanced full-stack platform designed to help high school students, parents, and university admissions counselors easily search, filter, and organize elite pre-college academic programs, internships, and extracurricular activities.

### Core Features
1. **Advanced Filtering Engine**: Easily search for programs by targeting specific keywords, subjects (e.g., STEM, Humanities), locations, eligible grades, or selectivity levels.
2. **URL State Synchronization**: Real-time syncing of filter states with the URL parameters, meaning users can share exactly what they see by sending the link.
3. **Interactive "Program Cards"**: Rich UI cards that display program details like logos, dates, cost summaries, and application deadlines (with dynamic color indicators for approaching deadlines).
4. **"My Lists" Ecosystem**: 
   - Users can create their own curated lists of programs (Public or Private).
   - "Add to List" drop-downs seamlessly connected directly to the search page.
   - Dedicated List Detail Dashboards to group, view, and ultimately share saved programs.

### Architecture
- **Frontend**: React, Vite, Tailwind CSS, React Router DOM, deployed locally at port `5173`.
- **Backend API**: Node.js, Express, TypeScript, RESTful endpoints (`/api/v1/`), running locally at port `3000`.
- **Database Layer**: PostgreSQL via Prisma ORM (`npx prisma studio` at port `5555`).

### Test Accounts
You can use these credentials to log in at `http://localhost:5173/auth` and test features. 

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Student** | Oliver Student | `student@example.com` | `password123` |
| **Student** | Emma Student | `emma@example.com` | `password123` |
| **Counselor** | Sarah Counselor | `counselor@example.com` | `password123` |
| **Admin** | Michael Admin | `admin@campberry.com` | `adminpassword` |

---

## 🇨🇳 普通话 (项目指南与手册)

**Campberry** 是一款专为高中生、家长及升学顾问打造的现代化全栈型一站式平台，旨在帮助用户高效检索、过滤及归档各类顶尖美国夏校、科研实习与课外活动项目。

### 核心功能介绍
1. **深度检索与过滤引擎**：允许用户根据关键词、学科类别（如 STEM 核心学科或人文社科）、地点、特定年级、甚至是录取难度（Selectivity）进行精准沙里淘金。
2. **URL 路由状态同步**：业界顶级的分享体验！用户在左边栏勾选的所有筛选项，都会被实时硬核绑定在浏览器地址（URL）上。复制链接发送给朋友，打开即是相同的过滤结果。
3. **高可用的信息展示 (Program Cards)**：通过极其精美的自适应高度信息卡片，呈现夏校的 Logo、日期、核心简介、费用及截止日期（具备红橙倒计时提示）。
4. **"My Lists" 个人资产闭环**：
   - 用户注册后可独享无限创建个人选校合集清单的功能。
   - 在搜索页面只需点击卡片上的 `+` 号，即可热部署进对应的 List。
   - 具备独立精美的 List Detail 管理页，真正实现从「搜寻」到「沉淀保存」的完美过渡。

### 技术架构
- **前端架构**：React, Vite 引擎, Tailwind CSS 高定样板库, 运行在 `5173` 端口。
- **后端 API**：Node.js, Express, TypeScript 严谨强类型，部署于本地 `3000` 端口。
- **数据库驱动**：PostgreSQL 配合神级 ORM 工具 Prisma，通过 `npx prisma studio` (端 口`5555`) 即可拥有可视化管理员界面。

### 预设测试账号
你可以使用这些账号密码直接在 `http://localhost:5173/auth` 获取 Auth 身份，解锁添加个人清单的功能。

| 角色权限 | 用户名 | 登录邮箱 | 密码 |
| :--- | :--- | :--- | :--- |
| **学生 (Student)** | Oliver Student | `student@example.com` | `password123` |
| **学生 (Student)** | Emma Student | `emma@example.com` | `password123` |
| **升学顾问 (Counselor)** | Sarah Counselor | `counselor@example.com` | `password123` |
| **管理员 (Admin)** | Michael Admin | `admin@campberry.com` | `adminpassword` |

---

## 🇭🇰 粤语 (項目指南同使用手冊)

**Campberry** 係一個超級 advanced 嘅 Full-stack 平台，專門 build 俾一班中學生、老豆老母同埋海外升學顧問用。等大家可以好輕易咁起一個海量嘅美國 Summer School、科研 Internship 同埋課外活動 data 庫入面，search、filter 或者 save 低心水嘅項目。

### 最 Sharp 嘅 Core Features
1. **超級過濾引擎 (Advanced Filtering)**：可以指定 Keyword，或者用 specific 嘅 Field（例如 STEM 呀、Humanities 咁）、年級、甚至係個 Programme 收人有幾難（Selectivity）去 filter 篩選。
2. **跟 URL 行嘅 State Sync**：呢個 function 好痴線！你撳咗乜嘢 filter，個 URL link 會即刻變埋。即係話，你 send 條 link 俾個 friend 睇，佢開出嚟見到嘅完全係同一個版面。
3. **有型嘅 Program Cards**：每一個夏校都有一張好靚嘅 UI Card，有齊 Logo、舉行日子、學費包啲咩，仲有申請 Deadline（如果差唔多到期，日期字眼會有動態顏色提示）。
4. **「My Lists」儲存生態圏**：
   - User 可以 create 自己嘅「心水 List」（可以揀 Public 公開或者 Private 得自己睇）。
   - 喺 Search 嗰版撳個 `+` 掣，就可以一鍵 add 埋入個 List 度。
   - 有個專門嘅 Dashboard 介面俾你慢慢管理或者將來 Share 條 List 出去。

### Backend 同 Frontend 點寫
- **前端 Frontend UI**：React, Vite, 仲用埋 Tailwind CSS 嚟砌啲靚款，local 行緊 `5173` Port。
- **後端 API Server**：用咗 Node.js, Express 同 TypeScript，local 喺 `3000` Port 開服。
- **Database 數據庫**：PostgreSQL 底層，由 Prisma ORM 手把手幫手控制（可以打 `npx prisma studio` 喺 `5555` port 用介面睇 db）。

### 洗緊嘅 Test Account 帳號
準備咗呢堆假帳號，你可以入去 `http://localhost:5173/auth` Login 試玩。

| Account 角色 | 稱呼 | Login 電郵 (Email) | 密碼 (Password) |
| :--- | :--- | :--- | :--- |
| **學生 (Student)** | Oliver Student | `student@example.com` | `password123` |
| **學生 (Student)** | Emma Student | `emma@example.com` | `password123` |
| **升學顧問 (Counselor)**| Sarah Counselor | `counselor@example.com` | `password123` |
| **超級管理員 (Admin)** | Michael Admin | `admin@campberry.com` | `adminpassword` |
