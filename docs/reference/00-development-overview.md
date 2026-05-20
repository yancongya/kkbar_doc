# 00. 开发总览

本页用于快速了解 Kkbar 的开发结构、启动方式和文档维护规则。

## 1. 项目结构

Kkbar 分为两个主要运行层：

- 前端层：Vue 3 + Pinia + Vite，位于 `src/js/main/`
- 宿主层：ExtendScript，位于 `src/jsx/`

文档站本身位于 `kkbar_doc/docs/`，使用 VitePress 自定义主题展示首页、文档页和落地页。

## 2. 常用命令

- `yarn dev`：启动文档站开发服务器
- `yarn build`：构建文档站静态产物
- `yarn preview`：预览构建结果

如果你在主仓库工作，还应区分前端面板的构建与文档站构建，不要混淆两个项目的工作目录。

## 3. 开发顺序

建议按这个顺序阅读或修改：

1. `docs/guides/01-introduction.md`
2. `docs/reference/01-api.md`
3. `docs/features/02-actions.md`
4. `docs/settings/02-db-settings.md`
5. `docs/settings/03-cloud-backup.md`
6. `docs/frontend-ui/01-系统概述.md`

## 4. 维护原则

- 文档内容尽量以“实际代码行为”为准，不要只写设计意图
- 任何涉及行为变化的改动，都要同步更新对应章节
- 新增功能时，至少补齐“概述 + 使用 + 约束 + 示例”四个部分
- 如果功能依赖 Adobe 行为、GitHub 接口或本地路径规则，必须写清楚前提条件

## 5. 前后端通信

前端调用 ExtendScript 时，使用 `evalTS()`：

```ts
import { evalTS } from "../lib/utils/bolt";

await evalTS("runScriptFile", filePath);
await evalTS("applyPreset", filePath);
await evalTS("applyEffect", matchName);
```

ExtendScript 向前端派发事件时，使用 `dispatchTS()` 和 `listenTS()`：

```ts
// 前端监听
listenTS("myCustomEvent", (data) => {
  console.log(data);
});

// 宿主派发
dispatchTS("myCustomEvent", payload);
```

## 6. 文档联动

以下内容建议互相对照维护：

- `docs/reference/`：接口、总览、实现说明
- `docs/database/`：存储结构、导入导出和状态持久化
- `docs/features/`：动作类型与执行逻辑
- `docs/frontend-ui/`：页面结构、交互与样式
- `docs/debug/`：兼容性、已知问题和错误码

