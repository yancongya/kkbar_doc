# 调用 AE 内置菜单命令

调用 After Effects 内部菜单命令，快速执行标准操作。

## 使用方法

1. 在设置面板中添加或编辑按钮
2. 设置按钮名称和图标
3. 选择动作类型为 **菜单命令**
4. 在搜索框中输入菜单名称（如"撤销"、"导出"）
5. 从下拉列表中选择要执行的菜单命令
6. 点击左上角保存并关闭设置面板

## 核心特点

- **数据持久化**：使用 JSON 文件存储（按版本分离），避免硬编码
- **高性能搜索**：采用"按需加载 + 本地过滤"架构，搜索零延迟
- **智能交互**：搜索框复用为结果展示框，点击即选中，输入即重置
- **版本隔离**：支持切换不同 AE 版本的命令集，确保兼容性

:::warning 执行前提
- 当前 AE 版本有对应的菜单命令数据文件
- 如果搜索不到目标命令，可能是当前 AE 版本的数据文件未包含该命令
:::

## 适用场景

- 快速执行常用菜单命令（如撤销、重做、导出）
- 替代手动点击菜单的繁琐操作
- 绑定快捷键实现一键执行

## 命令 ID 数据来源

菜单命令数据来自 GitHub 仓库 **[hyperbrew/after-effects-command-ids](https://github.com/hyperbrew/after-effects-command-ids)**，该项目维护了 After Effects 各版本的完整菜单命令 ID 列表。

- **在线搜索工具**：[hyperbrew.github.io/after-effects-command-ids](https://hyperbrew.github.io/after-effects-command-ids/)
- **GitHub 仓库**：[hyperbrew/after-effects-command-ids](https://github.com/hyperbrew/after-effects-command-ids)
- **JSON 数据文件**：[tree/master/json](https://github.com/hyperbrew/after-effects-command-ids/tree/master/json)

Kkbar 内置了 AE 2015 ~ 2025 共 11 个版本的命令数据，共 909 条命令。
