@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo [+] kkbar_doc 推送工具
echo ================================

:: 检查是否在 git 仓库中
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo [X] 错误: 当前目录不是 git 仓库
    exit /b 1
)

:: 显示当前状态
echo.
echo [*] 当前状态:
git status -s

:: 检查是否有更改
git status -s | findstr /r "." >nul 2>&1
if errorlevel 1 (
    echo.
    echo [OK] 工作区干净，无需提交
    
    :: 检查是否有未推送的提交
    for /f "tokens=*" %%i in ('git rev-parse @') do set LOCAL=%%i
    for /f "tokens=*" %%i in ('git rev-parse @{u} 2^>nul') do set REMOTE=%%i
    
    if not "!LOCAL!"=="!REMOTE!" if not "!REMOTE!"=="" (
        echo [==>]  有未推送的提交，正在推送...
        for /f "tokens=*" %%i in ('git branch --show-current') do git push origin %%i
        echo [OK] 推送完成
    )
    exit /b 0
)

:: 获取提交信息
set "COMMIT_MSG=%~1"
if "%COMMIT_MSG%"=="" (
    echo.
    echo 请输入提交信息 ^(直接回车使用默认^):
    set /p COMMIT_MSG="默认: docs: 更新文档 %date% %time:~0,5%: "
    if "!COMMIT_MSG!"=="" set "COMMIT_MSG=docs: 更新文档 %date% %time:~0,5%"
)

:: 添加所有更改
echo.
echo [+] 添加更改...
git add -A

:: 提交
echo [i] 提交中...
git commit -m "%COMMIT_MSG%"

:: 推送
echo [==>]  推送到远程...
for /f "tokens=*" %%i in ('git branch --show-current') do git push origin %%i

echo.
echo [OK] 完成！
echo 提交信息: %COMMIT_MSG%
pause
