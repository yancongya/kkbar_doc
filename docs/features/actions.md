# 动作类型

| 类型 | 说明 | 执行方式 |
|------|------|----------|
| `jsx` | 执行 JSX 脚本文件 | `evalTS("runScriptFile", filePath)` |
| `preset` | 应用预设文件 | `evalTS("applyPreset", filePath)` |
| `effect` | 应用效果 | `evalTS("applyEffect", matchName)` |
| `expression` | 应用表达式 | `evalTS("applyExpression", code)` |
| `panel` | 打开 CEP 面板 | `csi.requestOpenExtension(panelId)` |
| `menuItem` | 调用菜单命令 | `evalTS("invokeMenuItem", command)` |
| `scriptlet` | 执行代码片段 | `evalTS("runScriptlet", code)` |
| `shellCommand` | 执行 Shell 命令 | `child_process.exec(cmd)` |
| `spacer` | 间隔符 | 无动作 |
