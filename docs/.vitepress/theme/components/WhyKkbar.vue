<template>
  <section class="why-section">
    <h2 class="why-title reveal-up">为什么选择 Kkbar</h2>
    <p class="why-subtitle reveal-up">告别混乱，拥抱高效</p>

    <div class="cards-grid">
      <div v-for="(card, idx) in painPoints" :key="idx"
           class="pain-card reveal-up"
           :class="'pain-card--' + card.theme">
        <div class="pain-card__icon">
          <i :class="card.icon"></i>
        </div>
        <h3 class="pain-card__title">{{ card.title }}</h3>
        <p class="pain-card__desc">{{ card.desc }}</p>
        <div class="pain-card__solution">
          <i class="bi bi-check-circle-fill"></i>
          <span>{{ card.solution }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

const painPoints = [
  {
    icon: 'bi bi-translate',
    title: '全中文界面',
    desc: 'Kbar 原版为纯英文，对中文用户不友好。',
    solution: 'Kkbar 完整汉化，母语操作零障碍',
    theme: 'lang',
  },
  {
    icon: 'bi bi-palette2',
    title: '高级 UI/UX',
    desc: '原版界面简陋，缺乏现代化交互体验。',
    solution: '多主题、毛玻璃、流畅动画、响应式布局',
    theme: 'ui',
  },
  {
    icon: 'bi bi-lightning-charge',
    title: '更多高级功能',
    desc: '原版功能单一，无法满足复杂工作流。',
    solution: '九大动作类型，覆盖 AE/PS 全场景',
    theme: 'feat',
  },
  {
    icon: 'bi bi-folder2-open',
    title: '脚本扩展管理',
    desc: '脚本散落各处，找起来费时费力。',
    solution: '分类管理、搜索、收藏，一键直达',
    theme: 'organize',
  },
  {
    icon: 'bi bi-layout-wtf',
    title: 'AE 界面整理',
    desc: 'AE 面板堆叠杂乱，影响工作效率。',
    solution: '统一工具栏替代零散面板，界面清爽',
    theme: 'layout',
  },
  {
    icon: 'bi bi-cloud-arrow-up',
    title: '数据备份',
    desc: '配置丢失 = 从头再来，毫无安全感。',
    solution: '一键导出配置文件，随时备份恢复',
    theme: 'backup',
  },
  {
    icon: 'bi bi-phone-laptop',
    title: '跨设备同步',
    desc: '换台电脑就要重新配置，重复劳动。',
    solution: '导出/导入配置，在多台设备间无缝迁移',
    theme: 'sync',
  },
  {
    icon: 'bi bi-braces',
    title: '脚本片段测试',
    desc: '写好的脚本片段没有地方快速验证。',
    solution: '内置 Scriptlet 动作，即时执行代码片段',
    theme: 'code',
  },
  {
    icon: 'bi bi-code-slash',
    title: '表达式测试',
    desc: '表达式调试要反复切图层属性，效率低。',
    solution: '表达式动作一键应用，快速迭代调试',
    theme: 'expr',
  },
  {
    icon: 'bi bi-window-stack',
    title: '快速打开扩展',
    desc: '已安装的 CEP 扩展藏在菜单深处。',
    solution: '面板动作一键打开指定扩展面板',
    theme: 'panel',
  },
  {
    icon: 'bi bi-clipboard-data',
    title: '剪贴板管理',
    desc: '常用文本反复手动输入，浪费时间。',
    solution: '剪贴板动作存储常用内容，一键粘贴',
    theme: 'clip',
  },
  {
    icon: 'bi bi-collection-play',
    title: '素材管理',
    desc: '预设、脚本、模板分散在硬盘各处。',
    solution: '统一入口管理所有素材资源',
    theme: 'asset',
  },
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

  document.querySelectorAll('.why-section .reveal-up').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<style scoped>
.why-section {
  position: relative;
  width: 100%;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.why-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}

.why-subtitle {
  font-size: 1.1rem;
  color: #888;
  text-align: center;
  margin-bottom: 56px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1100px;
  width: 100%;
}

@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .why-title {
    font-size: 1.8rem;
  }
  .why-section {
    padding: 48px 16px;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}

/* 卡片 */
.pain-card {
  position: relative;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.35s ease,
              border-color 0.3s ease;
  overflow: hidden;
}

.pain-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 16px 16px 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pain-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.12);
}

.pain-card:hover::before {
  opacity: 1;
}

/* 主题色 */
.pain-card--lang::before  { background: linear-gradient(90deg, #6366f1, #818cf8); }
.pain-card--ui::before    { background: linear-gradient(90deg, #a855f7, #c084fc); }
.pain-card--feat::before  { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.pain-card--organize::before { background: linear-gradient(90deg, #10b981, #34d399); }
.pain-card--layout::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.pain-card--backup::before { background: linear-gradient(90deg, #06b6d4, #22d3ee); }
.pain-card--sync::before  { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
.pain-card--code::before  { background: linear-gradient(90deg, #14b8a6, #2dd4bf); }
.pain-card--expr::before  { background: linear-gradient(90deg, #f97316, #fb923c); }
.pain-card--panel::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.pain-card--clip::before  { background: linear-gradient(90deg, #ec4899, #f472b6); }
.pain-card--asset::before { background: linear-gradient(90deg, #84cc16, #a3e635); }

.pain-card--lang:hover  { border-color: rgba(99, 102, 241, 0.3); }
.pain-card--ui:hover    { border-color: rgba(168, 85, 247, 0.3); }
.pain-card--feat:hover  { border-color: rgba(245, 158, 11, 0.3); }
.pain-card--organize:hover { border-color: rgba(16, 185, 129, 0.3); }
.pain-card--layout:hover { border-color: rgba(59, 130, 246, 0.3); }
.pain-card--backup:hover { border-color: rgba(6, 182, 212, 0.3); }
.pain-card--sync:hover  { border-color: rgba(139, 92, 246, 0.3); }
.pain-card--code:hover  { border-color: rgba(20, 184, 166, 0.3); }
.pain-card--expr:hover  { border-color: rgba(249, 115, 22, 0.3); }
.pain-card--panel:hover { border-color: rgba(59, 130, 246, 0.3); }
.pain-card--clip:hover  { border-color: rgba(236, 72, 153, 0.3); }
.pain-card--asset:hover { border-color: rgba(132, 204, 22, 0.3); }

/* 图标 */
.pain-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.06);
  color: #a78bfa;
  flex-shrink: 0;
}

.pain-card--lang .pain-card__icon  { color: #818cf8; }
.pain-card--ui .pain-card__icon    { color: #c084fc; }
.pain-card--feat .pain-card__icon  { color: #fbbf24; }
.pain-card--organize .pain-card__icon { color: #34d399; }
.pain-card--layout .pain-card__icon { color: #60a5fa; }
.pain-card--backup .pain-card__icon { color: #22d3ee; }
.pain-card--sync .pain-card__icon  { color: #a78bfa; }
.pain-card--code .pain-card__icon  { color: #2dd4bf; }
.pain-card--expr .pain-card__icon  { color: #fb923c; }
.pain-card--panel .pain-card__icon { color: #60a5fa; }
.pain-card--clip .pain-card__icon  { color: #f472b6; }
.pain-card--asset .pain-card__icon { color: #a3e635; }

.pain-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: #e0e0e0;
  line-height: 1.3;
}

.pain-card__desc {
  font-size: 0.8rem;
  color: #888;
  line-height: 1.5;
  flex: 1;
}

/* 解决方案 */
.pain-card__solution {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.78rem;
  color: #a0a0a0;
  line-height: 1.4;
}

.pain-card__solution i {
  color: #10b981;
  font-size: 14px;
  margin-top: 1px;
  flex-shrink: 0;
}

/* 浅色主题 */
:global(.tw-light) .pain-card,
:global([data-theme="light"]) .pain-card {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.08);
}

:global(.tw-light) .pain-card:hover,
:global([data-theme="light"]) .pain-card:hover {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

:global(.tw-light) .pain-card__title {
  color: #1a1a2e;
}

:global(.tw-light) .pain-card__desc {
  color: #666;
}

:global(.tw-light) .pain-card__solution {
  border-top-color: rgba(0, 0, 0, 0.06);
  color: #555;
}

:global(.tw-light) .pain-card__icon {
  background: rgba(0, 0, 0, 0.04);
}

:global(.tw-light) .why-subtitle {
  color: #666;
}

/* 进场动画 */
.reveal-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
