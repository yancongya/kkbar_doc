# 脚本代码直接运行

直接在配置面板中输入 ExtendScript 代码，点击按钮时立即执行，无需外部文件。

## 使用方法

1. 在设置面板中添加或编辑按钮
2. 设置按钮名称和图标
3. 选择动作类型为 **代码片段**
4. 在代码编辑器中输入 ExtendScript 代码
5. 点击"运行 Scriptlet"按钮测试效果
6. 点击左上角保存并关闭设置面板

## 核心特点

- **即写即执行**：无需创建外部文件，直接在配置面板输入代码即可运行
- **完整的 ExtendScript 能力**：可以调用 AE 的所有脚本 API（`app`、`File`、`Folder` 等）
- **代码编辑器**：使用 `CodeEditor` 组件，支持语法高亮、自动补全和操作按钮
- **详细错误报告**：执行失败时显示错误类型、行号和详细消息
- **UndoGroup 支持**：自动包裹在 `app.beginUndoGroup` 中，支持 AE 撤销操作

## 代码框通用功能

代码编辑器提供以下按钮：

| 按钮 | 说明 |
|------|------|
| 复制 | 将内容复制到剪贴板 |
| 导出 | 将内容保存为本地文件 |
| 清除 | 清空当前输入的内容 |
| 运行 | 执行代码（表达式/剪贴板/脚本/Shell 命令） |

:::warning 执行前提
- 代码语法正确
- 所需的对象存在（如活动合成、选中图层等）
- 如果执行失败，会显示详细的错误信息
:::

:::tip AI 辅助生成
点击代码框上方的 **?** 按钮，会将代码模板复制到剪贴板：

1. **复制代码模板**：包含常用代码示例
2. 打开 AI 网页（如 DeepSeek、通义千问等）
3. 粘贴模板，描述你的需求
4. AI 生成后复制回来即可使用
:::

## 保存到文件

代码片段也可以保存为本地 `.jsx` 文件，方便复用：

1. 点击代码编辑器的保存按钮
2. 选择保存路径和文件名
3. 保存后可通过「脚本文件」动作类型调用

## 代码示例

:::details 创建新合成
```javascript
var comp = app.project.items.addComp("新合成", 1920, 1080, 1, 10, 30);
```
:::

:::details 选中所有图层
```javascript
var comp = app.project.activeItem;
if (comp) {
  for (var i = 1; i <= comp.numLayers; i++) {
    comp.layer(i).selected = true;
  }
}
```
:::

:::details 批量重命名选中图层
```javascript
var sel = app.project.activeItem.selectedLayers;
for (var i = 0; i < sel.length; i++) {
  sel[i].name = "图层_" + (i + 1);
}
```
:::

:::details 导出项目为 AEP
```javascript
var file = new File("/d/temp/project.aep");
app.project.save(file);
```
:::

:::details 创建纯色层
```javascript
var comp = app.project.activeItem;
var solid = comp.layers.addSolid([1, 1, 1], "纯色", comp.width, comp.height, 1);
```
:::

点击"运行 Scriptlet"按钮即可在 AE 中实时测试代码效果。
