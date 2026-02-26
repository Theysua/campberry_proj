# Campberry 项目总结 (Project Summary)

## 项目概述 (Overview)
**Campberry** 是一套专注于帮助高中生与升学顾问探索、筛选及管理优质夏校与课外活动项目（Extracurricular Programs）的现代 Web 平台。该项目包含高度定制化的搜索筛选引擎、直观优美的卡片展示，以及强大的个人/公开清单（Lists）管理闭环。

## 技术栈 (Tech Stack)
*   **前端 (Frontend) - `campberry_frontend`**: 
    *   **架构**: React + Vite
    *   **样式体系**: Tailwind CSS, 结合精心调配的色彩系统（如 `#011936` 深蓝主色，`#892233` 酒红点缀）和玻璃拟物/阴影交互动效。
    *   **路由与状态**: React Router DOM (高度依赖 URL 参数来实现可分享的搜索筛选状态)。
    *   **图标**: Lucide React
*   **后端 (Backend) - `campberry_backend`**:
    *   **架构**: Node.js + Express + TypeScript
    *   **数据库引擎**: PostgreSQL (结合 Prisma ORM 进行 schema 定义与数据交互)
    *   **认证与鉴权**: JWT Token + BCrypt 密码加密

## 核心功能模块 (Core Features)

### 1. 深度检索与过滤引擎 (Advanced Search & Filters)
*   **多维过滤**: 支持查询关键词、特定领域（STEM、Humanities 等）、目标年级、选择性难度（Selectivity）、项目类型、季节。
*   **智能兜底机制**: 清理了隐形过滤状态（如修复了默认隐藏非美国公民许可项目的问题），保证初始数据抓取的 50 余条顶尖数据（如 Stanford 等相关项目）完美铺开。
*   **URL 状态同步**: 过滤器变动实时映射到 URL Query 参数，保障页面刷新及链接分享时的状态一致性。

### 2. 精美交互UI与项目展示 (Premium UI & Datacards)
*   **ProgramCard 核心组件**: 整合了自适应高度、无缝 Logo 填充 (`object-cover`)、截止日期动态状态（如 Soon, Passed 颜色与动态跳动），并且整体卡片可精准跳转。
*   **气泡与快捷操作**: 在卡片层面实现了 Share（复制链接）、Compare 和 **Add to List（核心存储逻辑）** 弹出卡操作。

### 3. "My Lists" 个人清单管理闭环
*   **清单生成**: 用户登录拥有专属 Auth 凭证后，可快速生成独立的选校/项目列表（Public 或 Private 权限）。
*   **便捷数据流**: 用户在 Search 页面浏览时，点击卡片直接通过 `/api/v1/me/lists/:listId/items` 接口静默添加到清单，并且前端提供 Loading/成功对勾的状态交互回馈。
*   **定制详情展示页**: 跳转清单详情页 (`ListDetail` & `MyListDetail`)，可实时拉取该清单下的所有 Program 数据进行展示及排序管理，取代静态死数据。

## 当前环境与开发命令 (Environment Setup)
*   **数据库同步**: `npx prisma db pull` / `npx prisma generate`
*   **后端启动**: 在 `campberry_backend` 目下执行 `npm run dev` (运行于 `:3000`)
*   **前端启动**: 在 `campberry_frontend` 目下执行 `npm run dev` (运行于 `:5173`)

## 下一步蓝图 (Next Steps Roadmap)
1.  **认证系统进阶**: 从本地邮箱密码体系扩展接入 **Google Auth (OAuth 一键登录)**。
2.  **管理交互补充**: 为 My Lists 补充通过前端直接“移出项目 (Remove)”及“拖拽重排序 (Drag to Reorder)”的功能。
3.  **UI 边角打磨**: Dashboard / Landing Page 的商业级展示精进，以及用户体验流程最终 Review。
