# Kkbar Docs

<p align="center">
  <img src="https://img.shields.io/badge/VitePress-1.6.3-blue?style=flat-square&logo=vite" alt="VitePress">
  <img src="https://img.shields.io/badge/Astro-4.4.0-purple?style=flat-square&logo=astro" alt="Astro">
  <img src="https://img.shields.io/badge/Vue-3.5-41b883?style=flat-square&logo=vuedotjs" alt="Vue">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

<p align="center">
  <a href="https://kkbar-doc.pages.dev">📖 在线文档</a>
  &nbsp;|&nbsp;
  <a href="https://github.com/yancongya/kkbar_doc">GitHub</a>
</p>

> Kkbar 官方文档站，基于 VitePress 构建。

## 项目结构

```
kkbar_doc/
├── docs/           # VitePress 文档站 (主要)
├── landing/        # Astro 落地页
├── pixaai/         # 静态展示页
└── assets/         # 公共资源
```

| 目录 | 技术栈 | 说明 |
|------|--------|------|
| `docs/` | VitePress + Vue 3 | 用户文档、指南、功能说明 |
| `landing/` | Astro + Starlight | 营销落地页 |
| `pixaai/` | Tailwind CSS | 产品展示页 |

## 快速开始

### 安装

```bash
yarn install
```

### 启动文档站

```bash
# 主文档站 (docs)
yarn docs:dev

# 或直接
npx vitepress dev docs --port 4321
```

### 构建

```bash
yarn docs:build
npx vitepress build docs
```

### 预览

```bash
yarn docs:preview
```

## 子项目

### docs - VitePress 文档站

```bash
cd docs
# 启动
yarn dev
# 构建
yarn build
```

### landing - Astro 落地页

```bash
cd landing
yarn install
yarn dev
```

### pixaai - 静态页

```bash
cd pixaai
yarn
yarn start:tailwind
```

## 文档结构

```
docs/
├── .vitepress/
│   ├── config.mts      # VitePress 配置
│   ├── public/         # 静态资源
│   └── theme/          # 自定义主题
├── guides/             # 用户指南
├── features/           # 功能文档
├── icons/              # 图标库文档
├── settings/           # 设置说明
└── troubleshooting/    # 故障排除
```

## 技术徽章

| 徽章 | 说明 |
|------|------|
| ![VitePress](https://img.shields.io/badge/VitePress-1.6.3-blue) | 文档框架 |
| ![Astro](https://img.shields.io/badge/Astro-4.4.0-purple) | 静态站点 |
| ![Vue](https://img.shields.io/badge/Vue-3.5-41b883) | UI 框架 |
| ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8) | CSS 框架 |
| ![License](https://img.shields.io/badge/License-MIT-green) | 开源协议 |

## 贡献

欢迎提交 Issue 和 Pull Request！

1. 文档修改在 `docs/` 目录下进行
2. 遵循 VitePress Markdown 规范
3. 图片放入 `docs/public/assets/` 目录
4. 提交前运行 `yarn docs:build` 确保构建通过