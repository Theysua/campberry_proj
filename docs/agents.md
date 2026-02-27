# Campberry 项目交接文档 (Agent Handoff)

**最后更新**: 2026-02-27

## 1. 项目概述 (Overview)
**Campberry** 是一套专注于帮助高中生与升学顾问探索、筛选及管理优质夏校与课外活动项目（Extracurricular Programs）的现代 Web 平台。该项目包含高度定制化的搜索筛选引擎、直观优美的卡片展示，以及强大的个人/公开清单（Lists）管理闭环。

## 2. UI/UX 设计语言 (Design Language & UI/UX)

项目最近经历了一次全面的 UI/UX 升级，采用了一套基于 **"柔和现代主义" (Soft Modernism)** 的设计语言，旨在提供更温暖、专业且富有吸引力的用户体验。所有后续开发都应严格遵守此规范。

*   **核心理念**: 柔和、现代、专业、友好。
*   **色彩体系**: 
    *   **主色 (Primary)**: `#011936` (深海军蓝)
    *   **强调色 (Accent)**: `#b8243f` (品牌红), 使用渐变 `linear-gradient(135deg, #b8243f, #e8506a)` 用于关键 CTA。
    *   **Hero 背景**: 柔和渐变 `linear-gradient(180deg, #dbeafe, #fce7d6, #fdf2e9)`。
    *   **设计令牌 (Design Tokens)**: 所有颜色、阴影、圆角均已定义为 CSS 变量，必须通过 `var(--token-name)` 使用。
*   **字体与排版**: 
    *   **字体栈**: `Inter`, `sans-serif` (字重 300-900)。
    *   **层级**: 标题 (800-700), 按钮 (600), 正文 (400)。通过字重和字号建立清晰的视觉层次。
*   **组件规范**:
    *   **按钮**: 胶囊形 (`radius-pill`), hover 时上浮并增强阴影。
    *   **卡片**: 超大圆角 (`radius-lg: 24px`), hover 时上浮并增强阴影。
    *   **Header**: 毛玻璃效果 (`backdrop-filter: blur(12px)`)。
*   **动画**: 使用 `fadeInUp` 作为主要入场动画，并对交互提供流畅的 `transition` 反馈。

> **重要提示**: 完整的《前端标准设计语言规范》和 UI 原型修改细节，请参阅项目根目录下的 `campberry_design_handoff.md` 文件。

## 3. 技术栈 (Tech Stack)
*   **前端 (Frontend) - `campberry_frontend`**: 
    *   **架构**: React + Vite
    *   **样式体系**: Tailwind CSS, **已深度集成上述 "柔和现代主义" 设计语言和 Design Token 系统**。
    *   **路由与状态**: React Router DOM (高度依赖 URL 参数来实现可分享的搜索筛选状态)。
    *   **图标**: Lucide React
*   **后端 (Backend) - `campberry_backend`**:
    *   **架构**: Node.js + Express + TypeScript
    *   **数据库引擎**: PostgreSQL (结合 Prisma ORM 进行 schema 定义与数据交互)
    *   **认证与鉴权**: JWT Token + BCrypt 密码加密

## 4. 核心功能模块 (Core Features)

### 4.1. 深度检索与过滤引擎 (Advanced Search & Filters)
*   **多维过滤**: 支持查询关键词、特定领域（STEM、Humanities 等）、目标年级、选择性难度（Selectivity）、项目类型、季节。
*   **智能兜底机制**: 清理了隐形过滤状态，保证初始数据抓取的 50 余条顶尖数据完美铺开。
*   **URL 状态同步**: 过滤器变动实时映射到 URL Query 参数，保障页面刷新及链接分享时的状态一致性。

### 4.2. 精美交互UI与项目展示 (Premium UI & Datacards)
*   **ProgramCard 核心组件**: 遵循新设计规范，采用大圆角、顶部渐变装饰条、清晰的排版层次和 hover 动效。整合了自适应高度、无缝 Logo 填充 (`object-cover`)、截止日期动态状态。
*   **快捷操作**: 在卡片层面实现了 Share（复制链接）、Compare 和 **Add to List（核心存储逻辑）** 弹出卡操作。

### 4.3. "My Lists" 个人清单管理闭环
*   **清单生成**: 用户登录拥有专属 Auth 凭证后，可快速生成独立的选校/项目列表（Public 或 Private 权限）。
*   **便捷数据流**: 用户在 Search 页面浏览时，点击卡片直接通过 `/api/v1/me/lists/:listId/items` 接口静默添加到清单，并且前端提供 Loading/成功对勾的状态交互回馈。
*   **定制详情展示页**: 跳转清单详情页 (`ListDetail` & `MyListDetail`)，可实时拉取该清单下的所有 Program 数据进行展示及排序管理。

## 5. 当前环境与开发命令 (Environment Setup)
*   **数据库同步**: `npx prisma db pull` / `npx prisma generate`
*   **后端启动**: 在 `campberry_backend` 目下执行 `npm run dev` (运行于 `:3000`)
*   **前端启动**: 在 `campberry_frontend` 目下执行 `npm run dev` (运行于 `:5173`)

## 6. 下一步蓝图 (Next Steps Roadmap)
1.  **【已完成】UI/UX 全面升级**: 项目已基于 Base44 风格完成 "柔和现代主义" 设计语言的落地和原型重构。
2.  **认证系统进阶**: 从本地邮箱密码体系扩展接入 **Google Auth (OAuth 一键登录)**，新的 Auth 页面 UI 已在原型中提供。
3.  **管理交互补充**: 为 My Lists 补充通过前端直接“移出项目 (Remove)”及“拖拽重排序 (Drag to Reorder)”的功能。
4.  **Landing Page 开发**: 基于新的设计语言，开发一个引人注目的商业级 Landing Page。
