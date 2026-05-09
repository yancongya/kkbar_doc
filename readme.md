# Kkbar 文档站

Kkbar 官方文档项目，基于 VitePress 构建。

## 项目结构

```
kkbar_doc/
├── docs/           # VitePress 文档站（主项目）
├── landing/        # Astro 落地页
├── pixaai/         # 独立展示页
├── assets/         # 静态资源
├── css/            # 公共样式
└── scripts/        # 构建脚本
```

## 快速开始

### 安装依赖

```bash
yarn install
```

### 启动开发服务器

```bash
yarn dev
```

文档站地址：`http://localhost:4321`

### 构建生产版本

```bash
yarn build
```

### 预览生产版本

```bash
yarn preview
```

## 子项目详情

### 📚 docs - VitePress 文档站

用户文档，包含指南、功能说明、图标库、设置和故障排除。

```bash
# 仅构建文档
npx vitepress build docs
```

### 🌐 landing - Astro 落地页

营销落地页面，展示 Kkbar 产品特性。

```bash
cd landing
yarn install
yarn dev
```

### 🎨 pixaai - 展示页

独立的产品展示页面。

```bash
cd pixaai
yarn install
yarn dev
```

## 技术栈

| 模块 | 框架 | 说明 |
|------|------|------|
| docs | VitePress | Vue 3 文档框架 |
| landing | Astro | 静态站点框架 |
| pixaai | - | 静态 HTML + CSS |

## 目录结构

```
docs/
├── .vitepress/
│   ├── config.mts      # VitePress 配置
│   ├── public/         # 公共静态资源
│   └── theme/          # 自定义主题
├── guides/             # 用户指南
├── features/           # 功能文档
├── icons/              # 图标库文档
├── settings/           # 设置说明
└── troubleshooting/    # 故障排除
```

## 贡献指南

1. 文档修改在 `docs/` 目录下进行
2. 遵循 VitePress Markdown 规范
3. 图片放入 `docs/public/assets/` 目录
4. 提交前运行 `yarn build` 确保构建通过

## 许可证

MIT License - 详见 [license.txt](./license.txt)