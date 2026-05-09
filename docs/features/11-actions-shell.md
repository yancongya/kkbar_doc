# Shell 命令

直接执行系统 CMD 或者 PowerShell 命令，无需创建外部脚本文件。

## 使用方法

1. 在设置面板中添加或编辑按钮
2. 设置按钮名称和图标
3. 选择动作类型为 **Shell 命令**
4. 在命令输入框中输入系统命令
5. 可点击运行按钮测试命令
6. 点击左上角保存并关闭设置面板

## 测试运行

配置好命令后，可以直接在设置面板中点击运行按钮测试：

- 右侧的运行按钮可立即执行命令
- 执行结果会显示在日志面板中
- 浏览器预览模式下无法运行（需在 AE 面板中测试）

## 核心特点

- **即写即执行**：无需外部脚本，直接在配置面板输入命令即可运行
- **跨平台支持**：Windows (CMD/PowerShell) 和 macOS (Unix Terminal) 均可使用
- **代码编辑器**：使用代码编辑器组件，支持语法高亮和操作按钮
- **完整日志**：执行过程和结果记录到日志面板
- **导出功能**：支持将命令导出为 `.txt` 文件
- **AI 辅助生成**：内置命令模板，点击即可复制到剪贴板

## 代码框通用功能

代码编辑器提供以下按钮：

| 按钮 | 说明 |
|------|------|
| 复制 | 将内容复制到剪贴板 |
| 导出 | 将内容保存为本地文件 |
| 清除 | 清空当前输入的内容 |
| 运行 | 执行代码（表达式/剪贴板/脚本/Shell 命令） |

## 变量支持

支持以下动态变量，在执行时自动替换：

| 变量 | 说明 |
|------|------|
| `$PROJECT_PATH` | 当前 AE 项目文件完整路径 |
| `$SELECTION_FILE` | 当前选中素材的完整路径 |
| `$SELECTION_FOLDER` | 当前选中素材所在的文件夹路径 |
| `$PROJECT_NAME` | 当前项目名称（不含 .aep 后缀） |
| `$AE_APP_PATH` | Adobe After Effects 安装目录 |

## 完整示例

:::details 打开应用

:::code-group

```bash [Windows]
notepad.exe                                    # 打开记事本
calc.exe                                       # 打开计算器
code .                                         # 打开 VSCode
```

```bash [macOS]
open -a Safari                                 # 打开 Safari
open -a "Visual Studio Code"                   # 打开 VSCode
open -a "After Effects"                        # 打开 AE
open -a "Adobe Photoshop"                      # 打开 PS
```

:::
:::

:::details 打开文件/文件夹

:::code-group

```bash [Windows]
notepad.exe "D:\Projects\notes.txt"            # 打开指定文件
explorer "D:\Projects"                         # 打开文件夹
explorer "$SELECTION_FOLDER"                   # 打开选中素材的文件夹
```

```bash [macOS]
open .                                         # 打开当前目录
open "$PROJECT_PATH"                           # 打开项目所在文件夹
```

:::
:::

:::details 系统信息

:::code-group

```bash [Windows]
ipconfig                                       # 查看 IP 配置
systeminfo                                     # 查看系统信息
dir                                            # 列出目录
```

```bash [macOS]
ls -la                                         # 列出当前目录
pwd                                            # 显示当前路径
top                                            # 查看系统进程
df -h                                          # 查看磁盘空间
```

:::
:::

:::details PowerShell 命令
```
powershell -Command "Get-Process"              # 查看进程
powershell -Command "Get-ChildItem -Recurse"   # 递归列出文件
```
:::

:::details AE 相关
```
"$AE_APP_PATH\Support Files\AfterFX.exe" -r    # 启动 AE（无界面）
"$AE_APP_PATH\Support Files\AfterFX.exe" -s    # 后台渲染模式
```
:::

:::details 使用变量
```
notepad.exe "$PROJECT_PATH"                    # 用记事本打开当前项目
explorer "$PROJECT_PATH"                       # 在资源管理器中打开项目目录
code "$SELECTION_FILE"                         # 用 VSCode 打开选中文件
```
:::

:::tip AI 辅助生成
点击命令输入框上方的 **?** 按钮，会将命令模板复制到剪贴板：

1. **复制 Shell 命令模板**：包含所有可用变量和示例
2. 打开 AI 网页（如 DeepSeek、通义千问等）
3. 粘贴模板，描述你的需求
4. AI 生成后复制回来即可使用
:::

:::warning 执行前提
- 命令语法正确
- 命令路径有效
- Windows 下可能需要管理员权限
:::

:::warning 注意事项
- 命令执行时会隐藏 Windows 命令提示符窗口
- macOS 下命令在终端环境中执行
- 某些系统命令可能需要管理员权限
:::
