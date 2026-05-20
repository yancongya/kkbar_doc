---
layout: home
title: Kkbar
hero:
  name: Kkbar
  text: Adobe After Effects 工具栏扩展
  tagline: 基于 Vue 3 + TypeScript + Pinia + Vite 的 CEP 面板，面向脚本、预设、效果与工作流管理
---

<!-- 首页由自定义 Layout 组件渲染 -->

# 开发文档入口

Kkbar 的文档站同时承担“用户手册”和“开发文档”两类职责。下面这几个入口是最值得先看的部分：

## 先看这些

- [项目简介](/guides/01-introduction)：了解 Kkbar 的定位、功能边界和适用场景
- [安装指南](/guides/02-installation)：本地调试、安装与首次运行
- [动作系统](/features/02-actions)：按钮动作类型与执行模型
- [数据库设置](/settings/02-db-settings)：本地数据、导入导出与路径管理
- [云备份](/settings/03-cloud-backup)：GitHub/Gist 相关功能与登录流程
- [API 总览](/reference/01-api)：前后端通信与 ExtendScript 接口
- [开发总览](/reference/00-development-overview)：项目结构、启动方式与开发约定

## 你关心的开发点

- 前端面板在 `docs/.vitepress/theme/`，使用 VitePress 自定义主题承载落地页和文档页布局
- 业务面板在 `src/js/main/`，包括 Vue 组件、Pinia store、服务层和 UI 状态管理
- ExtendScript 代码在 `src/jsx/`，负责与 Adobe 宿主交互
- 前后端通信通过 `evalTS()`、`dispatchTS()`、`listenTS()` 完成

## 维护建议

- 修改 UI 行为时，优先同步更新 `docs/frontend-ui/` 和 `docs/reference/`
- 修改数据结构时，优先同步更新 `docs/database/`
- 修改动作执行逻辑时，优先同步更新 `docs/functions/`
- 新增约定、限制或兼容性说明时，优先放到 `docs/debug/`

