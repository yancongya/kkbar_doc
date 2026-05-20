# 01. API 总览

本页用于说明 Kkbar 前端面板和 ExtendScript 宿主之间的通信方式，以及动作执行接口的基本约定。

## 1. 前端调用宿主

前端通过 `evalTS()` 调用宿主层导出的函数。适用于执行脚本、应用预设、应用效果、写入表达式、打开面板等需要宿主参与的操作。

```ts
import { evalTS } from "../lib/utils/bolt";

await evalTS("runScriptFile", filePath);
await evalTS("applyPreset", filePath);
await evalTS("applyEffect", matchName);
await evalTS("applyExpression", code);
await evalTS("invokeMenuItem", command);
```

### 常见约定

- 参数尽量使用字符串、布尔值、数字和纯对象
- 传给 ExtendScript 的路径需要先做格式处理，避免 Windows 反斜杠和编码问题
- 宿主函数名应保持稳定，不要频繁改名
- 需要返回结果时，优先返回结构化对象，而不是拼接字符串

## 2. 宿主通知前端

宿主向前端派发事件时，使用 `dispatchTS()` 和 `listenTS()`。

```ts
// 前端监听
listenTS("myCustomEvent", (data) => {
  console.log(data);
});

// 宿主派发
dispatchTS("myCustomEvent", payload);
```

### 适用场景

- 执行进度回传
- 导入导出完成通知
- 失败原因回传
- 宿主状态变化通知

## 3. 动作执行链路

Kkbar 的按钮动作一般走这条链路：

1. 前端读取按钮配置
2. 根据热键或点击状态确定动作
3. 前端做最小校验
4. 必要时调用宿主 API
5. 记录日志并给出执行结果

这意味着：

- UI 层负责选择与提示
- 宿主层负责 Adobe 环境中的实际执行
- 两层都可能产生错误，需要分别排查

## 4. 动作类型与接口对应

| 动作类型 | 前端调用 | 宿主职责 |
| --- | --- | --- |
| `jsx` | `evalTS("runScriptFile", filePath)` | 运行脚本文件 |
| `preset` | `evalTS("applyPreset", filePath)` | 应用预设 |
| `effect` | `evalTS("applyEffect", matchName)` | 应用效果 |
| `expression` | `evalTS("applyExpression", code)` | 写入表达式 |
| `panel` | `csi.requestOpenExtension(panelId)` | 打开其他 CEP 面板 |
| `menuItem` | `evalTS("invokeMenuItem", command)` | 调用宿主菜单命令 |
| `scriptlet` | `evalTS("runScriptlet", code)` | 执行内联脚本 |
| `shellCommand` | `child_process.exec(cmd)` | 由前端本地执行命令 |
| `clipboard` | `executeClipboardDirective(text)` | 解析剪贴板指令或复制文本 |

## 5. 错误处理

建议把错误分成三类处理：

- 前端参数错误：例如空路径、空命令、未选择项目
- 宿主执行错误：例如 AE 项目状态不满足、函数执行失败
- 外部环境错误：例如路径不存在、网络中断、权限不足

## 6. 开发建议

- 新增宿主函数时，先在 `src/jsx/aeft/aeft.ts` 实现，再在前端调用
- 新增事件时，先在 `src/shared/universals.d.ts` 定义类型，再串联前后端
- 新增动作类型时，至少同步更新：
  - `src/js/main/store/kbar.ts`
  - `src/js/main/main.vue`
  - `src/js/main/components/DialogPickAction.vue`
  - `docs/features/`

## 7. ExtendScript 约束

宿主层使用 ExtendScript，必须遵守 ES3 兼容要求：

- 不使用 `let` / `const`
- 不使用箭头函数
- 不使用模板字符串
- 不使用 `async/await`
- 不使用解构、展开、类语法

更多规则见：

- [ExtendScript 开发指南](../extendscript-development-guidelines.md)

