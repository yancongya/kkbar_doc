<template>
  <section class="why-section">
    <h2 class="why-title">为什么选择 Kkbar</h2>
    <p class="why-subtitle">拖拽旋转 · 点击卡片查看详情</p>

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
      <svg class="sphere-lines" ref="svgRef">
        <line v-for="(line, i) in lines" :key="i"
          :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
          class="sphere-line" />
      </svg>

      <div class="sphere-scene" :style="sphereStyle">
        <div v-for="(card, idx) in painPoints" :key="idx"
             class="sphere-card"
             :style="cardTransform(idx)">
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
      <div class="sphere-center">
        <div class="center-btn">
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
  { icon: 'bi-translate', pain: 'Kbar 原版纯英文', solution: 'Kkbar 完整汉化', color: '#818cf8' },
  { icon: 'bi-palette2', pain: 'UI 简陋，交互生硬', solution: '多主题 · 毛玻璃 · 流畅动画', color: '#c084fc' },
  { icon: 'bi-lightning-charge', pain: '原版功能单一', solution: '九大动作类型覆盖全场景', color: '#fbbf24' },
  { icon: 'bi-folder2-open', pain: '脚本扩展太多太乱', solution: '分类 · 搜索 · 收藏 · 一键直达', color: '#34d399' },
  { icon: 'bi-layout-wtf', pain: 'AE 界面布局凌乱', solution: '统一工具栏替代零散面板', color: '#60a5fa' },
  { icon: 'bi-cloud-arrow-up', pain: '数据备份麻烦', solution: '一键导出配置，随时恢复', color: '#22d3ee' },
  { icon: 'bi-phone-laptop', pain: '跨设备同步麻烦', solution: '导出/导入配置，无缝迁移', color: '#a78bfa' },
  { icon: 'bi-braces', pain: '脚本代码片段无法快速测试', solution: 'Scriptlet 即时执行代码片段', color: '#2dd4bf' },
  { icon: 'bi-code-slash', pain: '表达式调试效率低', solution: '一键应用表达式，快速迭代', color: '#fb923c' },
  { icon: 'bi-window-stack', pain: '已安装扩展藏在菜单深处', solution: '面板动作一键打开 CEP 扩展', color: '#60a5fa' },
  { icon: 'bi-clipboard-data', pain: '常用文本反复手动输入', solution: '剪贴板存储常用内容，一键粘贴', color: '#f472b6' },
  { icon: 'bi-collection-play', pain: '素材分散各处难管理', solution: '统一入口管理所有素材资源', color: '#a3e635' },
]

const count = painPoints.length
const radiusX = 360
const radiusY = 220
const radiusZ = 300
const viewportRef = ref(null)
const svgRef = ref(null)
const lines = ref([])

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

function cardTransform(idx) {
  const p = spherePoints[idx]
  // 先定位到球面位置，再反向旋转使卡片始终朝向镜头
  return {
    transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateY(${-rotY.value}deg) rotateX(${-rotX.value}deg)`,
  }
}

function project3D(x, y, z, rx, ry, perspective, cx, cy) {
  // 弧度
  const rxR = (rx * Math.PI) / 180
  const ryR = (ry * Math.PI) / 180
  // 绕 Y 轴旋转
  let x1 = x * Math.cos(ryR) + z * Math.sin(ryR)
  let z1 = -x * Math.sin(ryR) + z * Math.cos(ryR)
  // 绕 X 轴旋转
  let y1 = y * Math.cos(rxR) - z1 * Math.sin(rxR)
  let z2 = y * Math.sin(rxR) + z1 * Math.cos(rxR)
  // 透视投影
  const scale = perspective / (perspective + z2)
  return {
    x: cx + x1 * scale,
    y: cy + y1 * scale,
  }
}

function updateLines() {
  if (!viewportRef.value) return
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
  startAuto()
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

function toggleCard(idx) {
  // 点击卡片时短暂放大效果
}

function startAuto() {
  stopAuto()
  autoTimer = setInterval(() => {
    if (!isDragging.value) {
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
  startAuto()
  // 连线更新（低频，避免布局抖动）
  setTimeout(() => {
    updateLines()
    lineTimer = setInterval(updateLines, 100)
  }, 500)
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
}

.sphere-line {
  stroke: rgba(167, 139, 250, 0.15);
  stroke-width: 1;
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

/* 浅色主题 */
.sphere-center {
  position: absolute;
  z-index: 10;
  pointer-events: none;
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
  animation: center-pulse 3s ease-in-out infinite;
}

.center-btn__logo {
  width: 38px;
  height: 38px;
}

@keyframes center-pulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(167, 139, 250, 0.4); }
  50% { box-shadow: 0 8px 56px rgba(167, 139, 250, 0.65); }
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
