# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概述

**kkbar_doc** 是 Kkbar（Adobe After Effects/Photoshop 工具栏扩展）的官方文档站。基于 **VitePress 1.6+** 构建，包含完全自定义的落地页，集成交互式 CEP 面板预览、GSAP 滚动动画和 Tailwind CSS。

在线地址：https://kkbar-doc.vercel.app/

## 开发命令

```bash
yarn install             # 安装依赖
yarn dev                 # 启动 VitePress 开发服务器，端口 4321
yarn build               # 生产构建，输出到 docs/.vitepress/dist/
yarn preview             # 预览生产构建，端口 4321
```

`landing/` 目录包含一个独立的 Astro + Starlight 落地页项目（有独立的 `package.json`）。

## 架构

### 双模式布局

站点使用自定义 VitePress 主题（`docs/.vitepress/theme/`），Layout.vue 根据路由切换渲染模式：

- **`/`（首页）** → 渲染 `LandingPage.vue`（自定义全屏落地页，绕过 VitePress 默认主题）
- **其他所有路由** → 渲染 `DefaultTheme.Layout`，导航栏显示动画 Logo

因此 `docs/index.md` 虽然有 `layout: home` 前置配置，但实际内容由 `LandingPage.vue` 渲染。

### 关键文件

- `docs/.vitepress/config.mts` — VitePress 配置：导航栏、侧边栏、head 标签（Bootstrap Icons CDN）
- `docs/.vitepress/theme/index.ts` — 主题入口，继承 DefaultTheme，导入 CSS
- `docs/.vitepress/theme/Layout.vue` — 基于路由的布局切换器
- `docs/.vitepress/theme/LandingPage.vue` — 完整的自定义落地页组件
- `docs/.vitepress/theme/components/CepPreview.vue` — 交互式 CEP 面板模拟组件
- `docs/.vitepress/theme/components/WorkflowDiagram.vue` — 工作流可视化组件
- `docs/.vitepress/theme/components/DialogMockup.vue` — 对话框预览组件
- `docs/.vitepress/theme/styles/index.css` — 所有自定义样式（落地页、CEP 预览、定价卡片、响应式）
- `docs/.vitepress/theme/styles/tailwind.css` — Tailwind 指令导入
- `css/index.css` — 根目录静态 `index.html` 落地页的独立 CSS
- `index.js` — 静态落地页的原生 JS（GSAP 动画、主题切换、导航）

### Tailwind CSS 配置

Tailwind 使用 `tw-` 前缀以避免与 VitePress 样式冲突：

```html
<div class="tw-flex tw-items-center">  <!-- 正确用法 -->
```

配置位于 `tailwind.config.js`，内容扫描路径为 `docs/**/*.{vue,ts,js}`。

### 暗色模式

落地页使用 `.tw-dark` 类（添加在 `<html>` 上）实现暗色模式，而非 VitePress 的 `.dark`。根目录的静态 `index.html` 将主题偏好持久化到 `localStorage('kkbar-dark')`。

### CSS 架构

存在两个内容大量重复的并行 CSS 文件：

1. `docs/.vitepress/theme/styles/index.css` — VitePress 主题使用（LandingPage.vue）
2. `css/index.css` — 独立 `index.html` 使用

两者包含相同的 CEP 预览样式、定价卡片、响应式断点等。修改样式时需考虑是否两个文件都需要更新。

### 图标系统

站点使用 **Bootstrap Icons**，通过 CDN 加载（在 `config.mts` 的 head 中配置）。图标类名格式：`bi bi-icon-name`。

### 动画

- **GSAP** + ScrollTrigger 实现基于滚动的显示动画
- CSS `@keyframes` 实现轮播、动画边框、引导遮罩
- CEP 预览组件具有交互状态（侧边栏折叠、热键栏、长按模式）

## 文档结构

```
docs/
├── guides/          # 简介、安装、快速上手、免费版与付费版
├── features/        # 按钮类型、动作类型（jsx、preset、effect 等）
├── icons/           # 图标系统文档（内置、FontAwesome、Bootstrap、SVG 生成器）
├── settings/        # 主题、数据库设置、云备份
├── troubleshooting/ # 常见问题、调试模式、错误代码
└── reference/       # API 参考
```

文件使用数字前缀（`01-`、`02-` 等）进行排序。

## 部署

推送到 `master` 分支时，GitHub Actions 自动部署到 GitHub Pages。工作流程：
1. `yarn install --frozen-lockfile`
2. `yarn build`（VitePress 构建）
3. 上传 `docs/.vitepress/dist` 作为构建产物
4. 部署到 GitHub Pages

## 注意事项

- 根目录的静态 `index.html` 是独立的落地页，不由 VitePress 提供服务
- `pixaai/` 目录已加入 .gitignore（独立项目/参考资料）
- VitePress 缓存位于 `docs/.vitepress/cache/`（已 gitignore）
- 构建输出位于 `docs/.vitepress/dist/`（已 gitignore）
- `landing/` Astro 项目通过 `file:../..` 引用 `bolt-cep`，需要主 Kkbar 仓库在上级两级目录
