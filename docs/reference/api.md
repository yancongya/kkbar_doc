# API 参考

## 前端到后端通信

使用 `evalTS()` 进行类型安全的函数调用：

```typescript
import { evalTS } from "../lib/utils/bolt";

// 执行脚本文件
await evalTS("runScriptFile", filePath);

// 应用预设
await evalTS("applyPreset", filePath);

// 应用效果
await evalTS("applyEffect", matchName);
```

## 后端到前端通信

使用 `dispatchTS()` / `listenTS()` 进行事件通信：

```typescript
// 1. 在 src/shared/universals.d.ts 定义事件类型
// 2. 前端监听
listenTS("myCustomEvent", (data) => { ... })

// 3. 后端触发
dispatchTS("myCustomEvent", payload)
```

## ExtendScript API

详见源码 `src/jsx/aeft/aeft.ts` 和 `src/jsx/phxs/phxs.ts`。
