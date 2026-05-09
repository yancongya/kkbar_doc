# 按钮功能

Kkbar 支持 9 种动作类型，每个按钮可以通过快捷键触发不同的动作，实现一按钮多功能的灵活操作。

## 动作类型总览

| 类型             | 说明                             | 适用场景                                 |
| ---------------- | -------------------------------- | ---------------------------------------- |
| **[jsx、jsxbin](./03-actions-jsx)**  | 执行 .jsx .jsxbin 脚本文件       | 运行自定义 ExtendScript 脚本             |
| **[preset](./04-actions-preset)**       | 应用 .ffx 动画预设               | 批量添加预设动画效果                     |
| **[effect](./05-actions-effect)**       | 应用 AE 内置效果                 | 为选中图层添加效果                       |
| **[expression](./06-actions-expression)**   | 添加表达式代码                   | 驱动属性动态变化                         |
| **[scriptlet](./07-actions-scriptlet)**    | 执行内联代码片段                 | 快速运行小段代码                         |
| **[panel](./08-actions-panel)**        | 打开其他 CEP 面板                | 切换到其他扩展面板                       |
| **[menuItem](./09-actions-menuitem)**     | 调用 AE 菜单命令                 | 执行标准菜单操作                         |
| **[clipboard](./10-actions-clipboard)**    | 解析剪贴板指令或复制文本到剪切板 | 复制文本到剪切板、导入文件路径或执行复制 |
| **[shellCommand](./11-actions-shell)** | 执行系统命令                     | 运行外部程序或脚本                       |
