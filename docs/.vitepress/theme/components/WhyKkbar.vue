<template>
  <section class="why-section">
    <h2 class="why-title reveal-up">为什么选择 Kkbar</h2>
    <p class="why-subtitle reveal-up">告别混乱，拥抱高效</p>

    <div class="why-layout">
      <!-- 左侧卡片列 -->
      <div class="why-col why-col--left">
        <div v-for="(card, idx) in leftCards" :key="idx"
             class="terminal-card reveal-up"
             :class="{ 'terminal-card--pulse': false }">
          <div class="terminal-card__header">
            <i class="bi terminal-card__icon" :class="card.icon" :style="{ color: card.color }"></i>
            <span class="terminal-card__title">{{ card.title }}</span>
          </div>
          <div class="terminal-card__body">
            <div class="terminal-card__line">{{ card.desc }}</div>
          </div>
          <span class="terminal-card__io"></span>
        </div>
      </div>

      <!-- 中间 Kkbar Logo -->
      <div class="why-center reveal-up">
        <div class="center-btn">
          <img src="/assets/logo/logo_animated.svg" class="center-btn__logo" alt="Kkbar" />
        </div>
      </div>

      <!-- 右侧卡片列 -->
      <div class="why-col why-col--right">
        <div v-for="(card, idx) in rightCards" :key="idx"
             class="terminal-card reveal-up"
             :class="{ 'terminal-card--pulse': false }">
          <div class="terminal-card__header">
            <i class="bi terminal-card__icon" :class="card.icon" :style="{ color: card.color }"></i>
            <span class="terminal-card__title">{{ card.title }}</span>
          </div>
          <div class="terminal-card__body">
            <div class="terminal-card__line">{{ card.desc }}</div>
          </div>
          <span class="terminal-card__io terminal-card__io--left"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

const leftCards = [
  { icon: 'bi-translate', title: '全中文界面', desc: 'Kbar 原版纯英文，Kkbar 完整汉化', color: '#818cf8' },
  { icon: 'bi-palette2', title: '高级 UI/UX', desc: '多主题 · 毛玻璃 · 流畅动画', color: '#c084fc' },
  { icon: 'bi-lightning-charge', title: '更多高级功能', desc: '九大动作类型覆盖全场景', color: '#fbbf24' },
  { icon: 'bi-folder2-open', title: '脚本扩展管理', desc: '分类 · 搜索 · 收藏 · 一键直达', color: '#34d399' },
  { icon: 'bi-layout-wtf', title: 'AE 界面整理', desc: '统一工具栏替代零散面板', color: '#60a5fa' },
  { icon: 'bi-cloud-arrow-up', title: '数据备份', desc: '一键导出配置，随时恢复', color: '#22d3ee' },
]

const rightCards = [
  { icon: 'bi-phone-laptop', title: '跨设备同步', desc: '导出/导入配置，无缝迁移', color: '#a78bfa' },
  { icon: 'bi-braces', title: '脚本片段测试', desc: 'Scriptlet 即时执行代码片段', color: '#2dd4bf' },
  { icon: 'bi-code-slash', title: '表达式测试', desc: '一键应用表达式，快速调试', color: '#fb923c' },
  { icon: 'bi-window-stack', title: '快速打开扩展', desc: '面板动作一键打开 CEP 扩展', color: '#60a5fa' },
  { icon: 'bi-clipboard-data', title: '剪贴板管理', desc: '常用内容存储，一键粘贴', color: '#f472b6' },
  { icon: 'bi-collection-play', title: '素材管理', desc: '统一入口管理所有素材资源', color: '#a3e635' },
]

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  document.querySelectorAll('.why-section .reveal-up').forEach((el, idx) => {
    el.style.transitionDelay = `${idx * 60}ms`
    observer.observe(el)
  })
})
</script>

<style scoped>
.why-section {
  position: relative;
  width: 100%;
  padding: 80px 24px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.why-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}

.why-subtitle {
  font-size: 1rem;
  color: #888;
  text-align: center;
  margin-bottom: 60px;
}

/* 三列布局 */
.why-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  max-width: 960px;
  width: 100%;
}

.why-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  max-width: 260px;
}

.why-col--left { align-items: flex-end; }
.why-col--right { align-items: flex-start; }

/* 中间 Logo */
.why-center {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-btn {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #818cf8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(167, 139, 250, 0.35);
  animation: center-pulse 3s ease-in-out infinite;
}

.center-btn__logo {
  width: 38px;
  height: 38px;
}

@keyframes center-pulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(167, 139, 250, 0.35); }
  50% { box-shadow: 0 8px 48px rgba(167, 139, 250, 0.55); }
}

/* ── Terminal Card（复用 WorkflowDiagram 风格） ── */
.terminal-card {
  position: relative;
  width: 220px;
  background: #1e1e2e;
  border-radius: 5px;
  z-index: 10;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.terminal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.terminal-card__header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  background: #2d2d3f;
}

.terminal-card__icon {
  font-size: 7px;
  line-height: 1;
  width: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.terminal-card__title {
  font-size: 10px;
  color: #e0e0e0;
  margin-left: 2px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
}

.terminal-card__body { padding: 4px 6px; }

.terminal-card__line {
  font-size: 9px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  color: #a0a0b0;
}

/* IO 指示灯 */
.terminal-card__io {
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #a78bfa;
  z-index: 2;
  animation: io-breathe 2s ease-in-out infinite;
}

.terminal-card__io--left {
  right: auto;
  left: -4px;
}

@keyframes io-breathe {
  0%, 100% { opacity: 0.6; transform: translateY(-50%) scale(1); }
  50% { opacity: 1; transform: translateY(-50%) scale(1.2); }
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .why-layout {
    flex-direction: column;
    gap: 24px;
  }

  .why-col {
    max-width: 100%;
    align-items: center;
  }

  .why-col--left,
  .why-col--right {
    align-items: center;
  }

  .terminal-card {
    width: 260px;
  }

  .why-title {
    font-size: 1.6rem;
  }

  .why-section {
    padding: 48px 16px 64px;
  }
}

/* 浅色主题 */
:global(.tw-light) .terminal-card,
:global([data-theme="light"]) .terminal-card {
  background: #f0f0f4;
}

:global(.tw-light) .terminal-card__header,
:global([data-theme="light"]) .terminal-card__header {
  background: #e0e0e8;
}

:global(.tw-light) .terminal-card__title,
:global([data-theme="light"]) .terminal-card__title {
  color: #1a1a2e;
}

:global(.tw-light) .terminal-card__line,
:global([data-theme="light"]) .terminal-card__line {
  color: #555;
}

:global(.tw-light) .why-subtitle,
:global([data-theme="light"]) .why-subtitle {
  color: #666;
}

/* 进场动画 */
.reveal-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
