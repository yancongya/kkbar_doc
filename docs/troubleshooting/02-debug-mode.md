# 02. 调试模式

## 开启 CEP 调试模式

### Windows

1. 打开注册表编辑器（运行 `regedit`）
2. 导航到 `HKEY_CURRENT_USER\Software\Adobe\CSXS.11`
3. 新建字符串值，名称为 `PlayerDebugMode`，值为 `1`
4. 重启 Adobe After Effects

> 注：`CSXS.11` 中的版本号可能因 AE 版本不同而有所差异：
> - AE 2020: CSXS.11
> - AE 2021: CSXS.12
> - AE 2022: CSXS.13
> - 以此类推

### macOS

1. 打开终端
2. 执行命令：
   ```bash
   defaults write com.adobe.CSXS.11 PlayerDebugMode -string "1"
   ```
3. 重启 Adobe After Effects

---

## 查看日志

### Kkbar 内置日志

1. 在主面板中点击右键或使用快捷键打开日志查看器
2. 日志包含：信息、警告、错误等类型
3. 可按类型过滤查看

### 浏览器调试

1. 在面板地址栏添加调试参数：`#__debug__`
2. 使用浏览器开发者工具（F12）查看控制台输出

---

## 常见问题排查

| 症状 | 可能原因 | 解决方法 |
|------|----------|----------|
| 按钮点击无反应 | 脚本执行失败 | 查看日志中的错误信息 |
| 图标显示异常 | 图标文件路径问题 | 检查图标文件是否存在 |
| 面板无法打开 | CEP 扩展未正确安装 | 重新安装或检查扩展目录 |