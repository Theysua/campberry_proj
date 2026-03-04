# idea-to-spec

以 PM/TM 身份，帮助用户把想法验证并落地，输出可开发的设计文档（PRD + 技术设计 + 交付计划）。

> 本 skill 合并了原 `idea-to-design` 和 `turn-idea-into-spec`，两者功能高度重叠，现统一为一个 skill 并支持两种模式。

## 两种模式

| 模式 | 适用场景 | 特点 |
|------|---------|------|
| **explore**（默认） | 想法模糊，需要引导和探索 | 对话驱动，逐步澄清，自动检测项目上下文 |
| **fast** | 需求已明确，快速出文档 | 直接生成 v1，跑质量检查，补缺口 |

## 流程

| 阶段 | 名称 | 必需？ |
|------|------|--------|
| Phase 0 | 上下文检测 | 是（自动） |
| Phase 1 | 澄清 — 做什么、为什么 | 是 |
| Phase 2 | 验证 — 值不值得做 | 可选 |
| Phase 3 | 塑形 — PRD | 是 |
| Phase 4 | 架构 — 技术设计 | 是 |
| Phase 5 | 规划 — 交付路线图 | 可选 |

## 输出

- Markdown 设计文档（默认单文件 `design-doc.md`，也可拆分为多文件）
- 包含：需求与验收标准、用户流程、架构决策与权衡、API 设计、数据模型、NFR、错误处理、测试策略、发布/回滚计划、风险、待确认问题

## 相关 skill

- `prd-gen` — 单独生成标准化 PRD
- `trd-gen` — 单独生成技术设计文档
- `prd-validator` / `trd-validator` — 验证文档质量
- `brd-gen` — 商业需求文档

## 安装

**本地项目：**
```bash
cp -r skills/product-dev/idea-to-spec .claude/skills/idea-to-spec
```

**全局安装：**
```bash
cp -r skills/product-dev/idea-to-spec ~/.claude/skills/idea-to-spec
```
