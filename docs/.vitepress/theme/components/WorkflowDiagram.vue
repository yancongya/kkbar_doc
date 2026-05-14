<template>
  <!-- 手机模式 -->
  <div v-if="isMobile" class="workflow-container workflow-container--mobile" :class="{ 'is-visible': isVisible }">
    <div class="mobile-card">
      <div class="terminal-card terminal-card--mobile">
        <div class="terminal-card__header">
          <span class="terminal-dot terminal-dot--red"></span>
          <span class="terminal-dot terminal-dot--yellow"></span>
          <span class="terminal-dot terminal-dot--green"></span>
          <span class="terminal-card__title">动作类型</span>
        </div>
        <div class="terminal-card__body">
          <div class="terminal-card__items">
            <div v-for="(panel, pIdx) in panelsData" :key="pIdx" class="terminal-item">
              <i class="bi terminal-item__icon" :class="panel.icon" :style="{ color: panel.color }"></i>
              <span class="terminal-item__text">{{ panel.title }}</span>
            </div>
          </div>
        </div>
        <span class="terminal-card__io"></span>
      </div>
    </div>
    <!-- 上连线 -->
    <div class="mobile-line mobile-line--top">
      <span class="mobile-dot" :class="{ 'mobile-dot--rtl': !isLTR }"></span>
    </div>
    <button class="workflow-center" type="button" @click="handleClick" @dblclick="handleDblClick">
      <div class="center-btn" :class="{ 'center-btn--playing': isPlaying }">
        <img v-if="logoVersion === 1" src="/assets/logo/logo_animated.svg" class="center-btn__logo" :key="logoKey" alt="Kkbar" />
        <img v-else src="/assets/logo/logo_animated-light.svg" class="center-btn__logo" :key="logoKey" alt="Kkbar" />
      </div>
    </button>
    <!-- 下连线 -->
    <div class="mobile-line mobile-line--bottom">
      <span class="mobile-dot" :class="{ 'mobile-dot--rtl': !isLTR }"></span>
    </div>
    <div class="workflow-right">
      <div class="grid-panel">
        <div class="grid-panel__header" @click.stop="switchPanel">
          <span class="grid-panel__title">{{ currentPanelTitle }}</span>
          <i class="bi bi-chevron-right grid-panel__arrow"></i>
        </div>
        <div class="grid-panel__body">
          <div v-for="(btn, idx) in currentPanelButtons" :key="idx"
               class="grid-btn"
               :class="{ 'grid-btn--active': activeBtnIdx === idx }">
            <i class="bi" :class="btn.icon" :style="{ color: btn.color }"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 桌面模式 -->
  <div v-else class="workflow-outer" ref="outer" :style="{ height: outerHeight + 'px' }" :class="{ 'is-visible': isVisible }">
    <div class="workflow-container" ref="container" :style="{ transform: `scale(${scale})`, 'transform-origin': 'top center' }">
      <div class="workflow-left">
        <div v-for="(panel, pIdx) in panelsData" :key="pIdx"
             class="terminal-card"
             :data-idx="pIdx"
             :class="{ 'terminal-card--pulse': isFlowSwitching }">
          <div class="terminal-card__header">
            <i class="bi terminal-card__icon" :class="panel.icon" :style="{ color: panel.color }"></i>
            <span class="terminal-card__title">{{ panel.title }}</span>
          </div>
          <div class="terminal-card__body">
            <div class="terminal-card__line">{{ panel.item }}</div>
          </div>
          <span class="terminal-card__io"></span>
        </div>
      </div>
      <button class="workflow-center" type="button" @click="handleClick" @dblclick="handleDblClick">
        <div class="center-btn" :class="{ 'center-btn--playing': isPlaying }">
          <img v-if="logoVersion === 1" src="/assets/logo/logo_animated.svg" class="center-btn__logo" :key="logoKey" alt="Kkbar" />
          <img v-else src="/assets/logo/logo_animated-light.svg" class="center-btn__logo" :key="logoKey" alt="Kkbar" />
        </div>
      </button>
      <div class="workflow-right" ref="rightPanel">
        <div class="grid-panel" ref="gridPanel">
          <div class="grid-panel__header" @click.stop="switchPanel">
            <span class="grid-panel__title">{{ currentPanelTitle }}</span>
            <i class="bi bi-chevron-right grid-panel__arrow"></i>
          </div>
          <div class="grid-panel__body">
            <div v-for="(btn, idx) in currentPanelButtons" :key="idx"
                 class="grid-btn"
                 :class="{ 'grid-btn--active': activeBtnIdx === idx }"
                 :data-idx="idx">
              <i class="bi" :class="btn.icon" :style="{ color: btn.color }"></i>
            </div>
          </div>
        </div>
        <span class="grid-panel__io"></span>
      </div>
      <svg class="workflow-lines" ref="svgEl">
        <path v-for="i in 9" :key="'l'+i" class="flow-line flow-line-left" stroke="#a78bfa" stroke-width="2" fill="none" stroke-linecap="round" />
        <path class="flow-line flow-line-right" stroke="#818cf8" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <circle v-for="(p, i) in panelsData" :key="'dot-l'+i" class="flow-dot flow-dot-left" r="4" :fill="p.color" />
        <circle v-for="i in 5" :key="'dot-r'+i" class="flow-dot flow-dot-right" r="4" fill="#818cf8" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

defineProps({ isDark: { type: Boolean, default: true } })
const emit = defineEmits(['flowChange'])

// 进场动画状态
const isVisible = ref(false)

onMounted(() => {
  // 延迟一帧开始进场动画
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})

// 面板数据（纯静态，不需要响应式位置）
const panelsData = [
  { title: 'JSX 脚本', item: 'my-script.jsx', icon: 'bi-play-fill', color: '#ef4444' },
  { title: '预设应用', item: 'animation.ffx', icon: 'bi-magic', color: '#f97316' },
  { title: '效果特效', item: '高斯模糊', icon: 'bi-layers-fill', color: '#eab308' },
  { title: '表达式', item: 'loopOut("cycle")', icon: 'bi-code-slash', color: '#22c55e' },
  { title: '脚本片段', item: 'app.project.active', icon: 'bi-braces', color: '#14b8a6' },
  { title: '扩展面板', item: 'com.adobe.ae', icon: 'bi-window', color: '#3b82f6' },
  { title: '菜单命令', item: '新建项目 (ID: 2)', icon: 'bi-list-ul', color: '#6366f1' },
  { title: '剪贴板', item: '$FILE:path/to', icon: 'bi-clipboard-fill', color: '#8b5cf6' },
  { title: 'Shell 命令', item: 'powershell -Command', icon: 'bi-terminal-fill', color: '#ec4899' }
]

// DOM refs
const container = ref(null)
const outer = ref(null)
const rightPanel = ref(null)
const gridPanel = ref(null)
const svgEl = ref(null)

// 手机模式检测
const isMobile = ref(false)
const MOBILE_BREAKPOINT = 768

// 缩放相关
const scale = ref(1)
const outerHeight = ref(520)
const DESIGN_WIDTH = 900  // 设计最小宽度

function updateScale() {
  if (isMobile.value) {
    scale.value = 1
    return
  }
  const parentWidth = outer.value?.parentElement?.offsetWidth || window.innerWidth
  const s = Math.min(1, parentWidth / DESIGN_WIDTH)
  scale.value = s
  outerHeight.value = 520 * s
}

function checkMobile() {
  isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT
}

// 状态
const isFlowSwitching = ref(false)
const isPlaying = ref(false)
const logoKey = ref(0)
const logoVersion = ref(1)
const panelVersion = ref(1)
const flowDir = 'ltr' // 当前流向
const activeBtnIdx = ref(-1) // 当前高亮的按钮索引

// 面板版本数据
const panelVersions = {
  1: { title: 'Kkbar 1', buttons: [
    { icon: 'bi-play-fill', color: '#22c55e' }, { icon: 'bi-clipboard-fill', color: '#f97316' },
    { icon: 'bi-magic', color: '#a78bfa' }, { icon: 'bi-layers-fill', color: '#4a9eff' },
    { icon: 'bi-code-slash', color: '#ef4444' }, { icon: 'bi-window', color: '#eab308' },
    { icon: 'bi-list-ul', color: '#ec4899' }, { icon: 'bi-file-code-fill', color: '#06b6d4' },
    { icon: 'bi-terminal-fill', color: '#8b5cf6' }
  ]},
  2: { title: 'Kkbar 2', buttons: [
    { icon: 'bi-braces', color: '#f97316' }, { icon: 'bi-stack', color: '#22c55e' },
    { icon: 'bi-lightning', color: '#8b5cf6' }, { icon: 'bi-hash', color: '#4a9eff' },
    { icon: 'bi-terminal', color: '#ef4444' }, { icon: 'bi-display', color: '#ec4899' },
    { icon: 'bi-menu-button-wide-fill', color: '#eab308' }, { icon: 'bi-clipboard2-fill', color: '#06b6d4' },
    { icon: 'bi-cpu-fill', color: '#a78bfa' }
  ]},
  3: { title: 'Kkbar 3', buttons: [
    { icon: 'bi-file-earmark-code-fill', color: '#a78bfa' }, { icon: 'bi-grid-3x3-gap-fill', color: '#818cf8' },
    { icon: 'bi-lightning-fill', color: '#f59e0b' }, { icon: 'bi-hash', color: '#3b82f6' },
    { icon: 'bi-chevron-right', color: '#16a34a' }, { icon: 'bi-display', color: '#d97706' },
    { icon: 'bi-card-checklist', color: '#db2777' }, { icon: 'bi-journal-text', color: '#dc2626' },
    { icon: 'bi-wrench-adjustable', color: '#0891b2' }
  ]}
}
const currentPanelTitle = computed(() => panelVersions[panelVersion.value].title)
const currentPanelButtons = computed(() => panelVersions[panelVersion.value].buttons)

function switchPanel() {
  panelVersion.value = panelVersion.value >= 3 ? 1 : panelVersion.value + 1
}

// ============ 核心：纯 DOM 位置存储 ============
// 卡片位置数组（普通对象，非响应式）
const cardPositions = []
// 右侧面板位置
const rightPos = { x: 0, y: 0 }

// 初始化卡片位置
function initCardPositions() {
  // 手机模式下不初始化卡片位置
  if (isMobile.value) return

  const cw = container.value?.offsetWidth || 800
  // 偏移量分布曲线：整体右移，波浪形交错
  const offsets = [0.15, 0.02, 0.22, -0.02, 0.28, 0.00, 0.18, 0.06, 0.12]
  const yGap = 55

  const cards = container.value.querySelectorAll('.terminal-card')
  cards.forEach((card, i) => {
    let x = Math.round(cw * offsets[i])
    x = Math.max(x, -15)  // 限制左侧最大偏移，避免超出屏幕
    const y = i * yGap
    cardPositions[i] = { x, y }
    card.style.left = x + 'px'
    card.style.top = y + 'px'
  })
}

// ============ 连线物理系统（弹簧-质点 + Verlet 积分）============
const NODE_COUNT = 16       // 每条连线的节点数
const GRAVITY = 0.8         // 重力
const DAMPING = 0.97        // 阻尼（0-1，越大越慢停下来）
const STIFFNESS = 0.2       // 弹簧刚度
const ITERATIONS = 8        // 约束迭代次数

// 连线节点数组（每条连线一个数组）
const ropes = []  // 左侧连线
let rightRope = null  // 右侧连线

// 流向状态
const isLTR = ref(true)

// 光点动画
const dotAnimations = []

// 初始化连线节点
function initRopes() {
  ropes.length = 0
  for (let i = 0; i < 9; i++) {
    ropes.push(createRope())
  }
  rightRope = createRope()
  
  // 初始化光点动画
  initDotAnimations()
}

// 初始化光点动画
function initDotAnimations() {
  // 清除旧动画
  dotAnimations.forEach(anim => anim?.kill())
  dotAnimations.length = 0
  
  const svg = svgEl.value
  if (!svg) return
  
  // 左侧连线的光点
  const leftDots = svg.querySelectorAll('.flow-dot-left')
  leftDots.forEach((dot, i) => {
    const line = svg.querySelectorAll('.flow-line-left')[i]
    if (!line) return
    
    const anim = { progress: Math.random(), speed: 0.002 + Math.random() * 0.002, dot, line }
    dotAnimations.push(anim)
  })
  
  // 右侧连线的光点（多个）
  const rightDots = svg.querySelectorAll('.flow-dot-right')
  const rightLine = svg.querySelector('.flow-line-right')
  if (rightLine) {
    rightDots.forEach((dot, i) => {
      // 每个光点错开起始位置
      const anim = { progress: i * 0.2, speed: 0.003 + Math.random() * 0.002, dot, line: rightLine }
      dotAnimations.push(anim)
    })
  }
}

// 更新光点位置（每帧调用）
function updateDots() {
  dotAnimations.forEach(anim => {
    const { dot, line, speed } = anim
    if (!dot || !line) return
    
    // 更新进度
    anim.progress += speed * (isLTR.value ? 1 : -1)
    if (anim.progress > 1) anim.progress = 0
    if (anim.progress < 0) anim.progress = 1
    
    // 获取路径长度
    const length = line.getTotalLength()
    const point = line.getPointAtLength(anim.progress * length)
    
    // 更新光点位置
    dot.setAttribute('cx', point.x)
    dot.setAttribute('cy', point.y)
  })
}

function createRope() {
  const nodes = []
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: 0, y: 0,
      prevX: 0, prevY: 0,
      pinned: false
    })
  }
  return { nodes }
}

// 更新连线物理
function updateRopePhysics(rope, startX, startY, endX, endY) {
  const nodes = rope.nodes
  const n = nodes.length
  
  // 设置端点
  nodes[0].x = startX
  nodes[0].y = startY
  nodes[0].pinned = true
  nodes[n - 1].x = endX
  nodes[n - 1].y = endY
  nodes[n - 1].pinned = true
  
  // Verlet 积分（更新位置）
  for (let i = 1; i < n - 1; i++) {
    const node = nodes[i]
    const vx = (node.x - node.prevX) * DAMPING
    const vy = (node.y - node.prevY) * DAMPING
    
    node.prevX = node.x
    node.prevY = node.y
    
    node.x += vx
    node.y += vy + GRAVITY
  }
  
  // 约束求解（保持节点间距）
  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let i = 0; i < n - 1; i++) {
      const a = nodes[i]
      const b = nodes[i + 1]
      
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      // 目标间距（均匀分布）
      const targetDist = 1 / (n - 1)
      
      if (dist > 0) {
        const diff = (dist - targetDist) / dist * STIFFNESS
        
        if (!a.pinned) {
          a.x += dx * diff * 0.5
          a.y += dy * diff * 0.5
        }
        if (!b.pinned) {
          b.x -= dx * diff * 0.5
          b.y -= dy * diff * 0.5
        }
      }
    }
  }
}

// 将连线节点转换为 SVG 路径
function ropeToPath(rope) {
  const nodes = rope.nodes
  if (nodes.length < 2) return ''
  
  let d = `M ${nodes[0].x} ${nodes[0].y}`
  
  // 使用二次贝塞尔曲线平滑连接
  for (let i = 1; i < nodes.length - 1; i++) {
    const prev = nodes[i - 1]
    const curr = nodes[i]
    const next = nodes[i + 1]
    
    const cp1x = prev.x + (curr.x - prev.x) * 0.5
    const cp1y = prev.y + (curr.y - prev.y) * 0.5
    const cp2x = curr.x + (next.x - curr.x) * 0.5
    const cp2y = curr.y + (next.y - curr.y) * 0.5
    
    d += ` Q ${curr.x} ${curr.y} ${cp2x} ${cp2y}`
  }
  
  // 最后一个节点
  const last = nodes[nodes.length - 1]
  d += ` L ${last.x} ${last.y}`
  
  return d
}

function updateLines() {
  // 手机模式下不更新物理连线
  if (isMobile.value) {
    requestAnimationFrame(updateLines)
    return
  }
  
  const svg = svgEl.value
  if (!svg) return
  
  const cw = container.value?.offsetWidth || 800
  const ch = container.value?.offsetHeight || 500
  const cx = cw / 2
  const cy = ch / 2
  
  svg.setAttribute('viewBox', `0 0 ${cw} ${ch}`)
  
  // 获取 .workflow-left 容器的偏移
  const leftContainer = container.value.querySelector('.workflow-left')
  const leftOffsetX = leftContainer ? leftContainer.offsetLeft : 20
  const leftOffsetY = leftContainer ? leftContainer.offsetTop : 20
  
  // 更新左侧连线物理
  const leftPaths = svg.querySelectorAll('.flow-line-left')
  const cards = leftContainer ? leftContainer.querySelectorAll('.terminal-card') : []
  leftPaths.forEach((path, i) => {
    const pos = cardPositions[i]
    if (!pos || !ropes[i]) return
    
    // 获取卡片实际高度，计算 IO 接口位置（右侧垂直居中）
    const card = cards[i]
    const cardH = card ? card.offsetHeight : 40
    // 加上 .workflow-left 容器的偏移
    const sx = leftOffsetX + pos.x + 134  // 容器偏移 + 卡片位置 + 卡片宽度 + IO偏移
    const sy = leftOffsetY + pos.y + cardH / 2
    const ex = cx - 50
    const ey = cy
    
    updateRopePhysics(ropes[i], sx, sy, ex, ey)
    path.setAttribute('d', ropeToPath(ropes[i]))
  })
  
  // 更新右侧连线物理
  const rightPath = svg.querySelector('.flow-line-right')
  const rightIo = container.value.querySelector('.grid-panel__io')
  if (rightPath && rightPanel.value && rightRope && rightIo) {
    const ioRect = rightIo.getBoundingClientRect()
    const containerRect = container.value.getBoundingClientRect()
    // IO 接口的中心位置（左侧）
    const rx = ioRect.left - containerRect.left + ioRect.width / 2
    const ry = ioRect.top - containerRect.top + ioRect.height / 2
    
    updateRopePhysics(rightRope, cx + 50, cy, rx, ry)
    rightPath.setAttribute('d', ropeToPath(rightRope))
  }
  
  // 更新光点位置
  updateDots()
  
  requestAnimationFrame(updateLines)
}

// ============ 左侧卡片拖拽 ============
let dragState = null

function onCardMouseDown(e) {
  // 手机模式下禁用拖拽
  if (isMobile.value) return
  
  const card = e.target.closest('.terminal-card')
  if (!card) return
  e.preventDefault()
  
  const idx = parseInt(card.dataset.idx)
  const pos = cardPositions[idx]
  const rect = container.value.getBoundingClientRect()
  
  dragState = {
    card,
    idx,
    startX: e.clientX - rect.left - pos.x,
    startY: e.clientY - rect.top - pos.y
  }
  
  // 停止之前的 GSAP 动画
  gsap.killTweensOf(pos)
  
  document.addEventListener('mousemove', onCardMouseMove)
  document.addEventListener('mouseup', onCardMouseUp)
}

function onCardMouseMove(e) {
  if (!dragState) return
  e.preventDefault()
  
  const rect = container.value.getBoundingClientRect()
  const pos = cardPositions[dragState.idx]
  
  // 直接修改对象 + 直接操作 DOM（零延迟）
  pos.x = e.clientX - rect.left - dragState.startX
  pos.y = e.clientY - rect.top - dragState.startY
  dragState.card.style.left = pos.x + 'px'
  dragState.card.style.top = pos.y + 'px'
}

function onCardMouseUp() {
  if (!dragState) return
  
  // 保存引用（dragState 会被清空）
  const card = dragState.card
  const pos = cardPositions[dragState.idx]
  
  // 清空拖拽状态
  dragState = null
  document.removeEventListener('mousemove', onCardMouseMove)
  document.removeEventListener('mouseup', onCardMouseUp)
  
  // 弹簧惯性（使用保存的引用）
  gsap.to(pos, {
    x: pos.x,
    y: pos.y,
    duration: 1.5,
    ease: 'back.out(1.5)',
    onUpdate: () => {
      card.style.left = pos.x + 'px'
      card.style.top = pos.y + 'px'
    }
  })
}

// ============ 右侧面板拖拽 ============
let rightDragState = null

function onRightMouseDown(e) {
  // 手机模式下禁用拖拽
  if (isMobile.value) return
  
  e.preventDefault()
  rightDragState = {
    startX: e.clientX - rightPos.x,
    startY: e.clientY - rightPos.y
  }
  gsap.killTweensOf(rightPos)
  document.addEventListener('mousemove', onRightMouseMove)
  document.addEventListener('mouseup', onRightMouseUp)
}

function onRightMouseMove(e) {
  if (!rightDragState) return
  e.preventDefault()
  
  rightPos.x = e.clientX - rightDragState.startX
  rightPos.y = e.clientY - rightDragState.startY
  rightPanel.value.style.transform = `translate(${rightPos.x}px, ${rightPos.y}px)`
}

function onRightMouseUp() {
  if (!rightDragState) return
  
  const panel = rightPanel.value
  
  rightDragState = null
  document.removeEventListener('mousemove', onRightMouseMove)
  document.removeEventListener('mouseup', onRightMouseUp)
  
  gsap.to(rightPos, {
    x: 0,
    y: 0,
    duration: 1.2,
    ease: 'elastic.out(0.8, 0.4)',
    onUpdate: () => {
      if (panel) {
        panel.style.transform = `translate(${rightPos.x}px, ${rightPos.y}px)`
      }
    }
  })
}

// ============ 生命周期 ============
let btnAnimTimer = null

onMounted(() => {
  // 检测手机模式
  checkMobile()
  updateScale()

  // 初始化位置
  initCardPositions()
  initRopes()

  // 绑定事件（事件委托）
  container.value.addEventListener('mousedown', onCardMouseDown)
  gridPanel.value.addEventListener('mousedown', onRightMouseDown)

  // 启动连线更新循环
  requestAnimationFrame(updateLines)

  // 启动按钮高亮循环动画
  startBtnAnimation()

  // resize 处理
  const handleResize = () => {
    checkMobile()
    updateScale()
    initCardPositions()
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  container.value?.removeEventListener('mousedown', onCardMouseDown)
  gridPanel.value?.removeEventListener('mousedown', onRightMouseDown)
  document.removeEventListener('mousemove', onCardMouseMove)
  document.removeEventListener('mouseup', onCardMouseUp)
  document.removeEventListener('mousemove', onRightMouseMove)
  document.removeEventListener('mouseup', onRightMouseUp)
  if (btnAnimTimer) clearInterval(btnAnimTimer)
})

// 按钮高亮循环动画（随机）
function startBtnAnimation() {
  const totalBtns = 9
  
  btnAnimTimer = setInterval(() => {
    // 随机选择一个按钮
    activeBtnIdx.value = Math.floor(Math.random() * totalBtns)
  }, 600) // 每 600ms 随机切换
}

// ============ 其他交互 ============
function handleClick() {
  isLTR.value = !isLTR.value
  isFlowSwitching.value = true
  logoVersion.value = logoVersion.value === 1 ? 2 : 1
  isPlaying.value = true
  logoKey.value++
  
  // 通知父组件流向改变
  emit('flowChange', isLTR.value ? 'ltr' : 'rtl')
  
  setTimeout(() => { isFlowSwitching.value = false; isPlaying.value = false }, 800)
}

function handleDblClick() {
  initCardPositions()
}
</script>

<style scoped>
.workflow-outer {
  width: 100%;
  overflow: visible;
}

.workflow-container {
  position: relative;
  width: 100%;
  min-width: 900px;
  height: 520px;
  padding: 10px;
  overflow: visible;
  user-select: none;
}

.workflow-left {
  position: absolute;
  left: 20px;
  top: 20px;
  width: 200px;
  height: calc(100% - 40px);
}

.terminal-card {
  position: absolute;
  width: 130px;
  background: #1e1e2e;
  border-radius: 5px;
  cursor: grab;
  z-index: 10;
}

.terminal-card:active { cursor: grabbing; }

.terminal-card__header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  background: #2d2d3f;
}

.terminal-dot { width: 5px; height: 5px; border-radius: 50%; }
.terminal-dot--red { background: #ff5f57; }
.terminal-dot--yellow { background: #febc2e; }
.terminal-dot--green { background: #28c840; }

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

@keyframes io-breathe {
  0%, 100% { opacity: 0.6; transform: translateY(-50%) scale(1); }
  50% { opacity: 1; transform: translateY(-50%) scale(1.2); }
}

.terminal-card__body { padding: 4px 6px; }
.terminal-card__line {
  font-size: 9px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  color: #a0a0b0;
}

/* 中间按钮 */
.workflow-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.center-btn {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #818cf8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  animation: pulse-breathe 2.5s ease-in-out infinite;
}

.center-btn:hover { transform: scale(1.05); }
.center-btn:active { transform: scale(0.95); }

@keyframes pulse-breathe {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px 8px rgba(167, 139, 250, 0.2);
  }
}

.center-btn__logo { width: 32px; height: 32px; }

/* 右侧面板 */
.workflow-right {
  position: absolute;
  right: 20px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  z-index: 10;
}

.grid-panel {
  background: #2d2d3f;
  border-radius: 10px;
  overflow: hidden;
  cursor: grab;
}

.grid-panel:active {
  cursor: grabbing;
}

.grid-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #1e1e2e;
  cursor: pointer;
}

.grid-panel__title {
  font-size: 12px;
  font-weight: 600;
  color: #e0e0e0;
}

.grid-panel__arrow { font-size: 10px; color: #888; }

.grid-panel__body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
}

.grid-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #1e1e2e;
  border-radius: 8px;
  font-size: 20px;
  transition: background 0.3s ease, border-color 0.2s ease;
  border: 1px solid transparent;
}

.grid-btn:hover {
  border-color: rgba(167, 139, 250, 0.4);
  background: #252540;
}

.grid-btn--active {
  background: #2a2a40;
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.15);
}

.grid-btn i { font-size: 18px; }

/* 右侧面板 IO 接口 */
.grid-panel__io {
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #818cf8;
  z-index: 2;
  animation: io-breathe 2s ease-in-out infinite;
}

/* 连线 */
.workflow-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  overflow: visible;
}

.flow-line {
  stroke-opacity: 0.5;
}

/* 响应式 */
/* 手机模式 */
.workflow-container--mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  height: auto;
  min-width: auto;
  padding: 0;
  overflow: hidden;
}

/* 上方卡片 */
.mobile-card {
  width: 100%;
  padding: 0 10px;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.terminal-card--mobile {
  width: 100% !important;
  cursor: default;
  position: relative !important;
  box-sizing: border-box;
  border-radius: 8px;
}

.terminal-card--mobile .terminal-card__io,
.workflow-container--mobile .grid-panel__io {
  display: none;
}

.terminal-card__items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  padding: 8px 0;
}

.terminal-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.terminal-item__icon {
  font-size: 10px;
  width: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.terminal-item__text {
  font-size: 10px;
  color: #a0a0b0;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  white-space: nowrap;
}

/* 中间按钮 + 连线容器 */
.workflow-container--mobile .workflow-center {
  position: relative;
  left: auto;
  top: auto;
  transform: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
}

/* 手机模式连线 */
.mobile-line {
  width: 2px;
  height: 48px;
  background: linear-gradient(to bottom, #a78bfa, #818cf8);
  opacity: 0.6;
  border-radius: 1px;
  position: relative;
  overflow: visible;
}

.mobile-line--bottom {
  background: linear-gradient(to bottom, #818cf8, #a78bfa);
}

/* 手机模式光点 */
.mobile-dot {
  position: absolute;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  border-radius: 50%;
  background: #a78bfa;
  box-shadow: 0 0 8px #a78bfa;
  animation: mobile-dot-down 1.2s ease-in-out infinite;
}

.mobile-line--bottom .mobile-dot {
  animation-delay: 0.6s;
}

/* 反向光点 */
.mobile-dot--rtl {
  animation-name: mobile-dot-up !important;
}

@keyframes mobile-dot-down {
  0% { top: 0; opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: calc(100% - 6px); opacity: 0; }
}

@keyframes mobile-dot-up {
  0% { top: calc(100% - 6px); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 0; opacity: 0; }
}

.workflow-container--mobile .center-btn {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.workflow-container--mobile .center-btn__logo {
  width: 24px;
  height: 24px;
}

/* 下方面板 */
.workflow-container--mobile .workflow-right {
  position: relative;
  right: auto;
  top: auto;
  transform: none;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 10px;
  margin-top: 8px;
  box-sizing: border-box;
}

.workflow-container--mobile .grid-panel {
  width: 100%;
  box-sizing: border-box;
  border-radius: 10px;
}

.workflow-container--mobile .grid-panel__header {
  padding: 6px 10px;
}

.workflow-container--mobile .grid-panel__title {
  font-size: 11px;
}

.workflow-container--mobile .grid-panel__body {
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  padding: 6px;
}

.workflow-container--mobile .grid-btn {
  width: 100% !important;
  height: 40px;
  border-radius: 6px;
}

.workflow-container--mobile .grid-btn i {
  font-size: 16px;
}

@media (max-width: 768px) {
  .workflow-container:not(.workflow-container--mobile) { height: auto; min-height: 700px; }
  .workflow-left {
    position: relative;
    left: 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
    height: auto;
  }
  .terminal-card { position: relative !important; top: auto !important; left: auto !important; width: 160px; }
  .workflow-center { position: relative; left: auto; top: auto; transform: none; display: flex; justify-content: center; margin: 20px 0; }
  .workflow-right { position: relative; right: auto; top: auto; transform: none; display: flex; justify-content: center; }
  .workflow-lines { display: none; }
}

/* 亮色模式 */
html:not(.dark) .terminal-card { 
  background: #ffffff; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
  border-radius: 8px;
}
html:not(.dark) .terminal-card__header { 
  background: linear-gradient(to bottom, #f8f9fa, #f1f3f5); 
}
html:not(.dark) .terminal-card__title { color: #1a1a2e; }
html:not(.dark) .terminal-card__line { color: #495057; }
html:not(.dark) .terminal-card__io { background: #7c3aed; }

html:not(.dark) .grid-panel { 
  background: #ffffff; 
  box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05);
  border-radius: 12px;
}
html:not(.dark) .grid-panel__header { 
  background: linear-gradient(to bottom, #f8f9fa, #f1f3f5); 
}
html:not(.dark) .grid-panel__title { color: #1a1a2e; }
html:not(.dark) .grid-panel__io { background: #6366f1; }

html:not(.dark) .grid-btn { 
  background: #f8f9fa; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.06);
}
html:not(.dark) .grid-btn:hover {
  border-color: rgba(99, 102, 241, 0.4);
  background: #f0f0f5;
}
html:not(.dark) .grid-btn--active { 
  background: #e9ecef; 
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.1);
}

html:not(.dark) .center-btn { 
  background: linear-gradient(135deg, #7c3aed, #6366f1); 
  box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4);
}

html:not(.dark) .flow-line-left { stroke: #7c3aed; }
html:not(.dark) .flow-line-right { stroke: #6366f1; }

html:not(.dark) .flow-dot-right { fill: #6366f1; }

/* 亮色模式 - 手机模式 */
html:not(.dark) .terminal-item__text {
  color: #495057;
}

html:not(.dark) .workflow-container--mobile .workflow-center::before,
html:not(.dark) .workflow-container--mobile .workflow-center::after {
  background: linear-gradient(to bottom, #7c3aed, #6366f1);
}

html:not(.dark) .mobile-card .terminal-card {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
}

html:not(.dark) .mobile-card .terminal-card__header {
  background: linear-gradient(to bottom, #f8f9fa, #f1f3f5);
}

html:not(.dark) .mobile-card .terminal-card__title {
  color: #1a1a2e;
}

html:not(.dark) .workflow-container--mobile .grid-panel {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05);
}

html:not(.dark) .workflow-container--mobile .grid-panel__header {
  background: linear-gradient(to bottom, #f8f9fa, #f1f3f5);
}

html:not(.dark) .workflow-container--mobile .grid-panel__title {
  color: #1a1a2e;
}

html:not(.dark) .workflow-container--mobile .grid-btn {
  background: #f8f9fa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.06);
}

html:not(.dark) .workflow-container--mobile .grid-btn--active {
  background: #e9ecef;
}

html:not(.dark) .mobile-dot {
  background: #7c3aed;
  box-shadow: 0 0 8px #7c3aed;
}

html:not(.dark) .mobile-line {
  background: linear-gradient(to bottom, #7c3aed, #6366f1);
}

html:not(.dark) .mobile-line--bottom {
  background: linear-gradient(to bottom, #6366f1, #7c3aed);
}

/* 进场动画 */
.workflow-outer,
.workflow-container--mobile {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.workflow-outer.is-visible,
.workflow-container--mobile.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 桌面模式 - 各部分错开进场 */
.workflow-outer.is-visible .workflow-left {
  animation: slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.workflow-outer.is-visible .workflow-center {
  animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both;
}

.workflow-outer.is-visible .workflow-lines {
  animation: fade-in 0.8s ease 0.4s both;
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 手机模式 - 各部分错开进场 */
.workflow-container--mobile.is-visible .mobile-card {
  animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.workflow-container--mobile.is-visible .mobile-line--top {
  animation: scale-y-in 0.4s ease 0.2s both;
}

.workflow-container--mobile.is-visible .workflow-center {
  animation: scale-in-mobile 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
}

.workflow-container--mobile.is-visible .mobile-line--bottom {
  animation: scale-y-in 0.4s ease 0.35s both;
}

.workflow-container--mobile.is-visible .workflow-right {
  animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-y-in {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes scale-in-mobile {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
