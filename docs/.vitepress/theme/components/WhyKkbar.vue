<template>
  <section id="why-kkbar" class="why-section">
    <h2 class="why-title">为什么选择 Kkbar</h2>
    <p class="why-subtitle">{{ isExpanded ? '一站式解决全部你全部痛点' : '点击中心发射痛点球' }}</p>

    <div class="sphere-viewport"
         ref="viewportRef"
         @mousedown="onDragStart"
         @mousemove="onDragMove"
         @mouseup="onDragEnd"
         @mouseleave="onDragEnd"
         @touchstart.passive="onTouchStart"
         @touchmove.passive="onTouchMove"
         @touchend="onDragEnd">

      <!-- SVG 连线 -->
      <svg class="sphere-lines" ref="svgRef" :class="{ 'lines-visible': isExpanded }">
        <line v-for="(line, i) in lines" :key="i"
          :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
          class="sphere-line" />
      </svg>

      <!-- 粒子效果 -->
      <div class="particles" v-if="isAnimating">
        <div v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)"></div>
      </div>

      <div class="sphere-scene" :style="sphereStyle">
        <div v-for="(card, idx) in painPoints" :key="idx"
             class="sphere-card"
             :class="{ 'card-expanded': isExpanded, 'card-animating': isAnimating }"
             :style="cardStyle(idx)">
          <div class="terminal-card">
            <div class="terminal-card__header">
              <i class="bi terminal-card__icon" :class="card.icon" :style="{ color: card.color }"></i>
              <span class="terminal-card__title">{{ card.pain }}</span>
            </div>
            <div class="terminal-card__body">
              <div class="terminal-card__line terminal-card__pain">{{ card.pain }}</div>
              <div class="terminal-card__line terminal-card__solution">{{ card.solution }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中心 Logo -->
      <div class="sphere-center" :class="{ 'center-expanded': isExpanded }" @click="toggleSphere">
        <div class="center-btn" :class="{ 'btn-pulse': !isExpanded }">
          <img v-if="isDark" src="/assets/logo/logo_animated.svg" class="center-btn__logo" alt="Kkbar" />
          <img v-else src="/assets/logo/logo_animated-light.svg" class="center-btn__logo" alt="Kkbar" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineProps({ isDark: { type: Boolean, default: true } })

const painPoints = [
  { icon: 'bi-translate', pain: 'Kbar 纯英文劝退', solution: '完整中文界面 + 详细文档', color: '#818cf8' },
  { icon: 'bi-palette2', pain: '界面朴素到没朋友', solution: 'UI/UX自定性极强，主题任选', color: '#c084fc' },
  { icon: 'bi-lightning-charge', pain: '只会跑脚本太单调', solution: '9种动作类型覆盖AE全场景', color: '#fbbf24' },
  { icon: 'bi-folder2-open', pain: '脚本一多就找不到', solution: '分类管理 · 搜索 · 收藏夹', color: '#34d399' },
  { icon: 'bi-keyboard', pain: '鼠标点到手抽筋', solution: '快捷键触发，一键执行', color: '#60a5fa' },
  { icon: 'bi-cloud-arrow-up', pain: '换电脑配置全白给', solution: 'Gist云备份，随时恢复', color: '#22d3ee' },
  { icon: 'bi-phone-laptop', pain: '公司家里两套配置', solution: '导出导入，无缝迁移', color: '#a78bfa' },
  { icon: 'bi-braces', pain: '测试代码要开新文件', solution: 'Scriptlet即时执行，即写即用', color: '#2dd4bf' },
  { icon: 'bi-folder-symlink', pain: '常用素材到处找很麻烦', solution: '快速导入文件/文件夹到项目或合成', color: '#fb923c' },
  { icon: 'bi-window-stack', pain: '吃灰插件藏在菜单深处', solution: '面板动作直达，告别翻菜单', color: '#60a5fa' },
  { icon: 'bi-clipboard-data', pain: '常用文本反复手打', solution: '剪贴板管理，一键粘贴', color: '#f472b6' },
  { icon: 'bi-image', pain: '图标选择太单调', solution: '内置+FA+Bootstrap+自定义图标', color: '#a3e635' },
  { icon: 'bi-grid-3x3-gap', pain: '按钮太多太凌乱', solution: '多热键合一按钮 · 多面板布局', color: '#e879f9' },
  { icon: 'bi-hand-index', pain: '左手太忙不方便点击', solution: '长按触发面板选择，解放双手', color: '#f97316' },
  { icon: 'bi-arrows-angle-expand', pain: '常用按钮太难找', solution: '拖拽调整大小位置，自由布局', color: '#06b6d4' },
]

const count = painPoints.length
const radiusX = 360
const radiusY = 220
const radiusZ = 300
const viewportRef = ref(null)
const svgRef = ref(null)
const lines = ref([])

// 动画状态
const isExpanded = ref(false)
const isAnimating = ref(false)
const animationProgress = ref(0)

// 使用斐波那契球面均匀分布
function fibonacciSphere(n, rx, ry, rz) {
  const points = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rAtY = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i
    points.push({
      x: Math.cos(theta) * rAtY * rx,
      y: y * ry,
      z: Math.sin(theta) * rAtY * rz,
    })
  }
  return points
}

const spherePoints = fibonacciSphere(count, radiusX, radiusY, radiusZ)

// 旋转状态
const rotX = ref(-15)
const rotY = ref(0)
const targetRotX = ref(-15)
const targetRotY = ref(0)
const isDragging = ref(false)
const dragStart = { x: 0, y: 0 }
const dragStartRot = { x: 0, y: 0 }

let autoTimer = null
let raf = null

const sphereStyle = computed(() => ({
  transform: `rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`,
}))

// 卡片样式（支持动画）
function cardStyle(idx) {
  const p = spherePoints[idx]
  const progress = animationProgress.value
  
  if (!isExpanded.value && !isAnimating.value) {
    // 收缩状态：所有卡片在中心
    return {
      transform: `translate3d(0px, 0px, 0px) scale(0)`,
      opacity: 0,
      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }
  }
  
  if (isAnimating.value) {
    // 动画中：从中心发射到球面位置
    const currentX = p.x * progress
    const currentY = p.y * progress
    const currentZ = p.z * progress
    const scale = 0.3 + 0.7 * progress
    const opacity = progress
    
    return {
      transform: `translate3d(${currentX}px, ${currentY}px, ${currentZ}px) rotateY(${-rotY.value}deg) rotateX(${-rotX.value}deg) scale(${scale})`,
      opacity: opacity,
      transition: 'none',
    }
  }
  
  // 展开状态：球面位置
  return {
    transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateY(${-rotY.value}deg) rotateX(${-rotX.value}deg)`,
    opacity: 1,
    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }
}

// 粒子样式
function particleStyle(i) {
  const angle = (i / 20) * Math.PI * 2
  const distance = 50 + Math.random() * 100
  const size = 2 + Math.random() * 4
  const duration = 0.5 + Math.random() * 0.5
  const delay = Math.random() * 0.3
  
  return {
    '--angle': `${angle}rad`,
    '--distance': `${distance}px`,
    '--size': `${size}px`,
    '--duration': `${duration}s`,
    '--delay': `${delay}s`,
    '--color': painPoints[i % painPoints.length].color,
  }
}

// 切换球体状态
function toggleSphere() {
  if (isAnimating.value) return
  
  if (isExpanded.value) {
    // 收缩动画
    isAnimating.value = true
    animateProgress(1, 0, 600, () => {
      isExpanded.value = false
      isAnimating.value = false
      stopAuto()
    })
  } else {
    // 展开动画（发射效果）
    isExpanded.value = true
    isAnimating.value = true
    animateProgress(0, 1, 800, () => {
      isAnimating.value = false
      startAuto()
    })
  }
}

// 动画进度控制
function animateProgress(from, to, duration, callback) {
  const startTime = Date.now()
  
  function update() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 使用缓动函数
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2
    
    animationProgress.value = from + (to - from) * eased
    
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      animationProgress.value = to
      callback()
    }
  }
  
  requestAnimationFrame(update)
}

function project3D(x, y, z, rx, ry, perspective, cx, cy) {
  const rxR = (rx * Math.PI) / 180
  const ryR = (ry * Math.PI) / 180
  let x1 = x * Math.cos(ryR) + z * Math.sin(ryR)
  let z1 = -x * Math.sin(ryR) + z * Math.cos(ryR)
  let y1 = y * Math.cos(rxR) - z1 * Math.sin(rxR)
  let z2 = y * Math.sin(rxR) + z1 * Math.cos(rxR)
  const scale = perspective / (perspective + z2)
  return {
    x: cx + x1 * scale,
    y: cy + y1 * scale,
  }
}

function updateLines() {
  if (!viewportRef.value || !isExpanded.value) return
  const vpRect = viewportRef.value.getBoundingClientRect()
  const cx = vpRect.width / 2
  const cy = vpRect.height / 2
  const cards = viewportRef.value.querySelectorAll('.sphere-card')
  const newLines = []
  cards.forEach((card) => {
    const r = card.getBoundingClientRect()
    const x2 = r.left + r.width / 2 - vpRect.left
    const y2 = r.top + r.height / 2 - vpRect.top
    newLines.push({ x1: cx, y1: cy, x2, y2 })
  })
  lines.value = newLines
}

function onDragStart(e) {
  if (!isExpanded.value) return
  isDragging.value = true
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  dragStartRot.x = rotX.value
  dragStartRot.y = rotY.value
  stopAuto()
}

function onDragMove(e) {
  if (!isDragging.value) return
  const dx = e.clientX - dragStart.x
  const dy = e.clientY - dragStart.y
  targetRotY.value = dragStartRot.y + dx * 0.4
  targetRotX.value = Math.max(-60, Math.min(60, dragStartRot.x - dy * 0.4))
}

function onDragEnd() {
  isDragging.value = false
  if (isExpanded.value) {
    startAuto()
  }
}

function onTouchStart(e) {
  if (e.touches.length === 1) {
    onDragStart({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })
  }
}

function onTouchMove(e) {
  if (e.touches.length === 1) {
    onDragMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })
  }
}

function startAuto() {
  stopAuto()
  autoTimer = setInterval(() => {
    if (!isDragging.value && isExpanded.value) {
      targetRotY.value += 0.15
    }
  }, 16)
}

function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}

function animate() {
  rotX.value += (targetRotX.value - rotX.value) * 0.08
  rotY.value += (targetRotY.value - rotY.value) * 0.08
  raf = requestAnimationFrame(animate)
}

let lineTimer = null

onMounted(() => {
  animate()
  // 初始状态：收缩，等待滚动触发展开
  animationProgress.value = 0
  
  // 监听滚动，进入视口时自动展开
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isExpanded.value) {
        setTimeout(() => {
          toggleSphere()
        }, 300)
      }
    })
  }, { threshold: 0.3 })
  
  if (viewportRef.value) {
    observer.observe(viewportRef.value)
  }
  
  // 连线更新
  lineTimer = setInterval(updateLines, 100)
})

onUnmounted(() => {
  stopAuto()
  if (lineTimer) clearInterval(lineTimer)
  if (raf) cancelAnimationFrame(raf)
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
  overflow: visible;
}

.why-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}

.why-subtitle {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-bottom: 32px;
  transition: all 0.3s ease;
}

/* 球体视口 */
.sphere-viewport {
  position: relative;
  width: 100%;
  max-width: 700px;
  height: 560px;
  perspective: 1200px;
  cursor: grab;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sphere-viewport:active {
  cursor: grabbing;
}

/* SVG 连线 */
.sphere-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.sphere-lines.lines-visible {
  opacity: 1;
}

.sphere-line {
  stroke: rgba(167, 139, 250, 0.15);
  stroke-width: 1;
}

/* 粒子效果 */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  animation: particle-burst var(--duration) ease-out var(--delay) forwards;
  opacity: 0;
}

@keyframes particle-burst {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + cos(var(--angle)) * var(--distance)),
      calc(-50% + sin(var(--angle)) * var(--distance))
    ) scale(1);
    opacity: 0;
  }
}

/* 球体场景 */
.sphere-scene {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transition: none;
  z-index: 2;
}

/* 卡片定位 */
.sphere-card {
  position: absolute;
  left: -95px;
  top: -28px;
  transform-style: preserve-3d;
  will-change: transform, opacity;
}

/* ── Terminal Card ── */
.terminal-card {
  position: relative;
  width: 190px;
  background: rgba(30, 30, 46, 0.92);
  border-radius: 5px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
}

.terminal-card:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 32px rgba(167, 139, 250, 0.3);
  border-color: rgba(167, 139, 250, 0.3);
}

.terminal-card__header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  background: rgba(45, 45, 63, 0.9);
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

.terminal-card__body {
  padding: 4px 6px;
  min-height: 28px;
}

.terminal-card__line {
  font-size: 9px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  color: #a0a0b0;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.terminal-card__pain {
  opacity: 1;
  transform: translateY(0);
}

.terminal-card__solution {
  opacity: 0;
  transform: translateY(4px);
  color: #10b981;
}

.terminal-card:hover .terminal-card__pain {
  opacity: 0;
  transform: translateY(-4px);
}

.terminal-card:hover .terminal-card__solution {
  opacity: 1;
  transform: translateY(0);
}

/* 中心按钮 */
.sphere-center {
  position: absolute;
  z-index: 10;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.sphere-center:hover {
  transform: scale(1.1);
}

.sphere-center.center-expanded {
  transform: scale(0.8);
  opacity: 0.7;
}

.center-btn {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #818cf8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(167, 139, 250, 0.4);
  transition: all 0.3s ease;
}

.center-btn.btn-pulse {
  animation: center-pulse 2s ease-in-out infinite;
}

.center-btn__logo {
  width: 38px;
  height: 38px;
}

@keyframes center-pulse {
  0%, 100% { 
    box-shadow: 0 8px 32px rgba(167, 139, 250, 0.4);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 8px 56px rgba(167, 139, 250, 0.65);
    transform: scale(1.05);
  }
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .sphere-viewport {
    height: 360px;
    perspective: 900px;
    transform: scale(0.6);
    transform-origin: center center;
  }

  .sphere-card {
    left: -80px;
    top: -24px;
  }

  .terminal-card {
    width: 160px;
  }

  .why-title {
    font-size: 1.6rem;
  }

  .why-section {
    padding: 24px 16px 40px;
  }
}

/* 浅色主题 */
html:not(.dark) .terminal-card {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
  border: none;
}
html:not(.dark) .terminal-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(99, 102, 241, 0.15);
  border: none;
}
html:not(.dark) .terminal-card__header {
  background: linear-gradient(to bottom, #f8f9fa, #f1f3f5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
html:not(.dark) .terminal-card__title {
  color: #1a1a2e;
}
html:not(.dark) .terminal-card__line {
  color: #495057;
}
html:not(.dark) .terminal-card__solution {
  color: #059669;
}
html:not(.dark) .terminal-card__icon {
  opacity: 0.9;
}
html:not(.dark) .why-subtitle {
  color: #888;
}
html:not(.dark) .sphere-line {
  stroke: rgba(99, 102, 241, 0.15);
}
html:not(.dark) .center-btn {
  background: linear-gradient(135deg, #818cf8, #6366f1);
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.25);
}
</style>