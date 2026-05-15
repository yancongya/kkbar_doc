#!/bin/bash
# kkbar_doc 推送脚本
# 使用方法: ./push.sh [commit_message]

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}📦 kkbar_doc 推送工具${NC}"
echo "================================"

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ 错误: 当前目录不是 git 仓库${NC}"
    exit 1
fi

# 检查是否有远程仓库
if ! git remote -v | grep -q "origin"; then
    echo -e "${RED}❌ 错误: 未配置远程仓库${NC}"
    exit 1
fi

# 显示当前状态
echo -e "\n${GREEN}📊 当前状态:${NC}"
git status -s

# 检查是否有更改
if [ -z "$(git status -s)" ]; then
    echo -e "\n${GREEN}✅ 工作区干净，无需提交${NC}"
    
    # 检查是否有未推送的提交
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
    
    if [ "$LOCAL" != "$REMOTE" ] && [ -n "$REMOTE" ]; then
        echo -e "${YELLOW}⬆️  有未推送的提交，正在推送...${NC}"
        git push origin $(git branch --show-current)
        echo -e "${GREEN}✅ 推送完成${NC}"
    fi
    exit 0
fi

# 获取提交信息
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
else
    DEFAULT_MSG="docs: 更新文档 $(date '+%Y-%m-%d %H:%M')"
    echo -e "\n${YELLOW}请输入提交信息 (直接回车使用默认):${NC}"
    echo -e "默认: ${DEFAULT_MSG}"
    read -r COMMIT_MSG
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="$DEFAULT_MSG"
    fi
fi

# 添加所有更改
echo -e "\n${GREEN}📝 添加更改...${NC}"
git add -A

# 提交
echo -e "${GREEN}💾 提交中...${NC}"
git commit -m "$COMMIT_MSG"

# 推送
echo -e "${GREEN}⬆️  推送到远程...${NC}"
git push origin $(git branch --show-current)

echo -e "\n${GREEN}✅ 完成！${NC}"
echo -e "提交信息: ${COMMIT_MSG}"
