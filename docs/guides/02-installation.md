# 安装

![首页](/assets/images/install.png)

## 系统要求

:::warning ⚠️ 系统要求

- Adobe After Effects CC 2020+
- Windows 10+ / macOS 10.15+

当前在以上环境测试通过，其他版本理论上兼容，但未经完整验证。
:::

## 安装方式

:::code-group

```bash
1. 下载 Kkbar 安装包（[点击下载 .zxp 文件](#)）
2. 使用 ZXP Installer 或 Anastasiy Extension Manager 打开 .zxp 文件
3. 完成安装后重启 Adobe After Effects
4. 在菜单栏选择 窗口 > 扩展 > Kkbar
```

```bash
1. 下载 Kkbar 压缩包（[点击下载 .zip 文件](#)）
2. 解压得到 Kkbar 文件夹
3. 将文件夹复制到 CEP 扩展目录（见下方说明）
4. 重启 Adobe After Effects
5. 在菜单栏选择 窗口 > 扩展 > Kkbar
```

:::

:::details 📁 CEP 扩展目录路径

- **Windows 用户级**：`%APPDATA%\Adobe\CEP\extensions\`
- **Windows 系统级**：`C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
- **macOS**：`~/Library/Application Support/Adobe/CEP/extensions/`
  :::

## 首次启动

首次启动 Kkbar 时，面板会在默认路径创建 `KkbarDB` 文件夹用于存储数据：

- **Windows**：`%APPDATA%\KkbarDB`
- **macOS**：`~/Library/Application Support/KkbarDB`

初始状态下没有任何按钮和分类，需要手动创建。

:::tip 💡 建议
首次使用建议在 **设置 > 数据库** 中自定义数据库目录，便于后续管理数据文件。
:::

