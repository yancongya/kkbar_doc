<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import CepPreview from './components/CepPreview.vue'
import ThemeSwitch from './components/ThemeSwitch.vue'

import DialogMockup from './components/DialogMockup.vue';
import WorkflowDiagram from './components/WorkflowDiagram.vue';
import WhyKkbar from './components/WhyKkbar.vue';
import DownloadPage from './components/DownloadPage.vue';

const isDark = ref(true)
const isHeaderCollapsed = ref(true)
const isNavDropdownOpen = ref(false)
const workflowDirection = ref('ltr')

function onFlowChange(direction) {
  workflowDirection.value = direction
}

// 主题切换
watch(isDark, (dark) => {
  document.documentElement.classList.toggle('tw-dark', dark)
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('kkbar-dark', String(dark))
  localStorage.setItem('vitepress-theme-appearance', dark ? 'dark' : 'light')
})

const isVideoOpen = ref(false)
const showSupportQr = ref(false)
const fullscreenImage = ref<string | null>(null)
let hoverTimer: ReturnType<typeof setTimeout> | null = null
const showEmailToast = ref(false)
const carouselRef = ref<HTMLElement | null>(null)
const carouselSlide = ref(0)
let carouselTimer: ReturnType<typeof setInterval> | null = null

function scrollToSlide(idx: number) {
  if (!carouselRef.value) return
  const children = carouselRef.value.children
  if (!children[idx]) return
  const itemW = children[0].offsetWidth + 24 // gap-6 = 24px
  carouselRef.value.scrollTo({ left: idx * itemW, behavior: 'smooth' })
  carouselSlide.value = idx
}

function openVideo() {
  isVideoOpen.value = true
}

function closeVideo() {
  isVideoOpen.value = false
}

function startHoverTimer(img: string) {
  hoverTimer = setTimeout(() => {
    fullscreenImage.value = img
  }, 800)
}

function cancelHoverTimer() {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}

function closeFullscreen() {
  fullscreenImage.value = null
}

function onEscKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && fullscreenImage.value) {
    fullscreenImage.value = null
  }
}

onMounted(() => {
  document.addEventListener('keydown', onEscKey)
})

async function copyEmail() {
  try {
    await navigator.clipboard.writeText('2655283737@qq.com')
    showEmailToast.value = true
    setTimeout(() => { showEmailToast.value = false }, 2000)
  } catch {
    alert('复制失败')
  }
}

const featureData: Record<string, { title: string; desc: string; link: string }> = {
  jsx: { title: 'JSX 脚本', desc: '执行本地 .jsx/.jsxbin 脚本文件，调用 AE/PS 完整 API，支持 Undo 撤销。', link: '/features/03-actions-jsx/' },
  preset: { title: '预设应用', desc: '应用 .prfpset 预设文件到选中图层，支持批量应用和撤销。', link: '/features/04-actions-preset/' },
  effect: { title: '效果特效', desc: '快速应用 AE/PS 内置效果到图层，支持效果参数预设。', link: '/features/05-actions-effect/' },
  expression: { title: '表达式', desc: '为属性添加动画表达式，支持代码编辑器和常用表达式模板。', link: '/features/06-actions-expression/' },
  scriptlet: { title: '脚本片段', desc: '直接在配置面板输入代码片段，点击按钮立即执行。', link: '/features/07-actions-scriptlet/' },
  panel: { title: '扩展面板', desc: '打开其他 CEP 扩展面板，快速切换工作区。', link: '/features/08-actions-panel/' },
  menuItem: { title: '菜单命令', desc: '调用 AE/PS 菜单命令，快速执行常用操作。', link: '/features/09-actions-menuitem/' },
  clipboard: { title: '剪贴板', desc: '一键复制预设文本到剪贴板，支持代码片段、文件路径、AE 属性引用等。', link: '/features/10-actions-clipboard/' },
  shell: { title: 'Shell 命令', desc: '执行 PowerShell/CMD 命令，自动化文件系统操作。', link: '/features/11-actions-shell/' },
}

const activeFeature = ref('jsx')
const featureKeys = Object.keys(featureData)
const activeFeatureIndex = computed(() => featureKeys.indexOf(activeFeature.value))
let isManualNavigation = false
let manualNavTimeout: ReturnType<typeof setTimeout> | null = null

function showFeature(feature: string) {
  activeFeature.value = feature
}

function prevFeature() {
  const idx = activeFeatureIndex.value
  const prevIdx = (idx - 1 + featureKeys.length) % featureKeys.length
  navigateToFeature(featureKeys[prevIdx])
}

function nextFeature() {
  const idx = activeFeatureIndex.value
  const nextIdx = (idx + 1) % featureKeys.length
  navigateToFeature(featureKeys[nextIdx])
}

function navigateToFeature(key: string) {
  isManualNavigation = true
  if (manualNavTimeout) clearTimeout(manualNavTimeout)
  activeFeature.value = key
  manualNavTimeout = setTimeout(() => {
    isManualNavigation = false
  }, 800)
}

// DialogMockup 等比缩放
const dialogViewportRef = ref<HTMLElement | null>(null)
const dialogScale = ref(1)
const DIALOG_NATURAL_WIDTH = 500

let resizeObserver: ResizeObserver | null = null

function updateDialogScale() {
  if (dialogViewportRef.value) {
    const containerWidth = dialogViewportRef.value.clientWidth
    dialogScale.value = Math.min(containerWidth / DIALOG_NATURAL_WIDTH, 1)
  }
}

onMounted(() => {
  updateDialogScale()
  if (dialogViewportRef.value) {
    resizeObserver = new ResizeObserver(() => updateDialogScale())
    resizeObserver.observe(dialogViewportRef.value)
  }
  
  // 手机端：拖拽时实时切换面板
  setTimeout(() => {
    const cardList = document.getElementById('feature-card-list')
    if (cardList) {
      let rafId: number
      let scrollEndTimer: ReturnType<typeof setTimeout> | null = null

      const updateActiveFromScroll = () => {
        if (isManualNavigation) return
        const containerCenter = cardList.scrollLeft + cardList.clientWidth / 2
        let minDist = Infinity
        let closestKey = activeFeature.value
        Object.keys(featureData).forEach((key) => {
          const card = document.getElementById('feature-card-' + key)
          if (card) {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2
            const dist = Math.abs(containerCenter - cardCenter)
            if (dist < minDist) {
              minDist = dist
              closestKey = key
            }
          }
        })
        if (closestKey !== activeFeature.value) {
          activeFeature.value = closestKey
        }
      }

      cardList.addEventListener('scroll', () => {
        if (isManualNavigation) return
        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(updateActiveFromScroll)

        // 滚动结束时再更新一次，确保最终位置正确
        if (scrollEndTimer) clearTimeout(scrollEndTimer)
        scrollEndTimer = setTimeout(updateActiveFromScroll, 100)
      })
    }
  }, 300)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  document.removeEventListener('keydown', onEscKey)
})

// 监听 activeFeature 变化，滚动到对应的卡片
watch(activeFeature, (newFeature) => {
  setTimeout(() => {
    const card = document.getElementById('feature-card-' + newFeature)
    if (card) {
      const isMobile = window.innerWidth < 1024
      card.scrollIntoView({ behavior: 'smooth', block: isMobile ? 'nearest' : 'center', inline: isMobile ? 'center' : 'nearest' })
    }
  }, 100)
})

const faqList = [
  { q: '什么是 Kkbar 工具？', a: 'Kkbar 工具是一个集成的 Web 应用，可无缝测试不同的大语言模型，如 GPT4、Claude、Gemini 等。' },
  { q: '什么是大语言模型？', a: 'LLM 代表"大语言模型"。它是一种人工智能模型，经过大量文本数据训练，能够理解和生成类似人类的文本。这些模型，如 GPT-4，可以通过利用训练数据中学到的模式执行各种任务。' },
  { q: '我可以在哪里测试不同的AI模型？', a: '您可以使用 Kkbar 的 AI 工具来测试不同的模型，包括 GPT4、Claude、Perplexity 等。' },
  { q: 'Kkbar 是免费使用的吗？', a: '您可以免费开始使用 Kkbar，然后升级您的计划以访问所有功能。' },
]

const articleList = [
  { img: '/assets/images/intro.png', title: '功能简介' },
  { img: '/assets/images/install.png', title: '安装指南' },
  { img: '/assets/images/cep.png', title: 'CEP 面板预览' },
  { img: '/assets/images/buttons.png', title: '自定义按钮' },
  { img: '/assets/images/actions.png', title: '九大动作类型' },
  { img: '/assets/images/jsx0.png', title: '脚本执行' },
  { img: '/assets/images/presets0.png', title: '预设管理' },
  { img: '/assets/images/eefect.png', title: '效果特效' },
  { img: '/assets/images/exp.png', title: '表达式' },
  { img: '/assets/images/scripttlet0.png', title: '脚本片段' },
  { img: '/assets/images/panel.png', title: '扩展面板' },
  { img: '/assets/images/clipboard0.png', title: '剪贴板 - 复制' },
  { img: '/assets/images/clipboard1.png', title: '剪贴板 - 粘贴' },
  { img: '/assets/images/clipboard2.png', title: '剪贴板 - 管理' },
  { img: '/assets/images/shell0.png', title: 'Shell 命令 - 配置' },
  { img: '/assets/images/shell1.png', title: 'Shell 命令 - 执行' },
  { img: '/assets/images/shell2.png', title: 'Shell 命令 - 结果' },
  { img: '/assets/images/icons0.png', title: '图标库 - 内置' },
  { img: '/assets/images/icons1.png', title: '图标库 - FontAwesome' },
  { img: '/assets/images/icons2.png', title: '图标库 - Bootstrap' },
  { img: '/assets/images/icons3.png', title: '图标库 - 自定义' },
  { img: '/assets/images/transfrom.png', title: '界面设置' },
  { img: '/assets/images/vs.png', title: '功能对比' },
]

const additionalFeatures = [
  { img: '/assets/images/piont/1.png', title: '自定义工具栏', desc: '自由排列按钮、调整图标大小和间距，打造专属的工作面板布局。' },
  { img: '/assets/images/piont/2.png', title: '脚本一键执行', desc: '管理并运行 JSX 脚本，支持撤销，快速调用常用 AE/PS 自动化流程。' },
  { img: '/assets/images/piont/3.png', title: '预设与特效', desc: '一键应用预设文件和内置效果到选中图层，支持批量操作。' },
  { img: '/assets/images/piont/4.png', title: '多动作类型', desc: '支持脚本、预设、效果、表达式、剪贴板、Shell 命令等九大动作类型。' },
  { img: '/assets/images/piont/5.png', title: '配置导入导出', desc: '导出工具栏配置为文件，在多台设备间同步，或分享给团队成员。' },
  { img: '/assets/images/piont/6.png', title: '多主题切换', desc: '内置多套主题配色，支持亮色与暗色模式，适配不同工作环境。' },
]

function toggleFaq(e: Event) {
  const el = e.currentTarget as HTMLElement
  el.classList.toggle('active')
  const content = el.nextElementSibling as HTMLElement
  const icon = el.querySelector('.bi-plus') as HTMLElement
  if (content.style.maxHeight === '240px') {
    content.style.maxHeight = '0px'
    content.style.padding = '0px 18px'
    icon.style.transform = 'rotate(0deg)'
  } else {
    content.style.maxHeight = '240px'
    content.style.padding = '20px 18px'
    icon.style.transform = 'rotate(45deg)'
  }
}

const RESPONSIVE_WIDTH = 1024
const SCROLL_THRESHOLD = 80
const mainHeader = ref<HTMLElement | null>(null)

function onScroll() {
  if (mainHeader.value) {
    mainHeader.value.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD)
  }
  // Hero区域波点动画
  const heroSection = document.querySelector('.hero-section')
  if (heroSection) {
    const rect = heroSection.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight * 0.8
    heroSection.classList.toggle('section-visible', isVisible)
  }
}

function onDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.header-dropdown')) {
    isNavDropdownOpen.value = false
  }
}

function replayLogo(e: MouseEvent) {
  const img = e.currentTarget as HTMLImageElement
  const base = img.src.split('?')[0]
  img.src = base + '?v=' + Date.now()
}

let gsapInstance: any = null
let scrollTriggerInstance: any = null

// ScrollTrigger 统一配置
const scrollTriggerConfig = {
  dashboard: { trigger: '#hero-section', start: 'top 20%', end: 'center center', scrub: true },
  workflowScale: { trigger: '#workflow-section', start: 'top 80%', end: 'center center', scrub: 1 },
  workflowCards: { trigger: '#workflow-section', start: 'top 60%', toggleActions: 'play none none reverse' },
  workflowCenter: { trigger: '#workflow-section', start: 'top 55%', toggleActions: 'play none none reverse' },
  workflowRight: { trigger: '#workflow-section', start: 'top 50%', toggleActions: 'play none none reverse' },
  workflowLines: { trigger: '#workflow-section', start: 'top 45%', toggleActions: 'play none none reverse' },
  workflowTitle: { trigger: '#workflow-section', start: 'top 70%', toggleActions: 'play none none reverse' },
  revealUp: { start: '10% 80%', end: '20% 90%' },
}

onMounted(async () => {
  // 读取主题设置
  const kkbarDark = localStorage.getItem('kkbar-dark')
  const vitepressDark = localStorage.getItem('vitepress-theme-appearance')
  
  if (vitepressDark !== null) {
    isDark.value = vitepressDark === 'dark'
  } else if (kkbarDark !== null) {
    isDark.value = kkbarDark === 'true'
  }
  
  // 应用主题
  document.documentElement.classList.toggle('tw-dark', isDark.value)
  document.documentElement.classList.toggle('dark', isDark.value)

  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocumentClick)

  await nextTick()

  // Scroll to hash section on load
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash)
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }

  // 等待图片加载完成后再初始化动画
  const images = document.querySelectorAll('img')
  await Promise.all([...images].map(img =>
    img.complete ? Promise.resolve() : new Promise<void>(resolve => {
      img.onload = () => resolve()
      img.onerror = () => resolve()
    })
  ))

    // Load GSAP dynamically
    try {
      const gsapModule = await import('gsap')
      const stModule = await import('gsap/ScrollTrigger')
      const gsap = gsapModule.default || gsapModule.gsap
      const ScrollTrigger = stModule.ScrollTrigger || stModule.default

      gsap.registerPlugin(ScrollTrigger)
      gsapInstance = gsap
      scrollTriggerInstance = ScrollTrigger

      // 检测手机模式（≤768px 对应 WorkflowDiagram.vue 的 MOBILE_BREAKPOINT）
      const isMobileMode = window.innerWidth <= 768

      gsap.to('.reveal-up', { opacity: 0, y: '100%' })

      gsap.fromTo('#dashboard', {
        transform: 'perspective(1200px) rotateX(60deg) scale(0.3)',
        opacity: 0.3,
      }, {
        transform: 'perspective(1200px) rotateX(0deg) scale(1)',
        opacity: 1,
        ease: 'none',
        scrollTrigger: scrollTriggerConfig.dashboard,
      })

      // 仅在非手机模式下执行桌面版工作流动画
      if (!isMobileMode) {
        // Workflow section parallax effect
        gsap.fromTo('#workflow-section .workflow-scale', {
          y: 50,
          opacity: 0.5,
        }, {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: scrollTriggerConfig.workflowScale,
        })

        // Workflow left cards slide in from left
        gsap.fromTo('#workflow-section .workflow-left .terminal-card', {
          x: -80,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: scrollTriggerConfig.workflowCards,
        })

      // Workflow center button scale in
      gsap.fromTo('#workflow-section .workflow-center', {
        scale: 0,
        opacity: 0,
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: scrollTriggerConfig.workflowCenter,
      })

      // Workflow right panel slide in from right
      gsap.fromTo('#workflow-section .workflow-right', {
        x: 80,
        opacity: 0,
      }, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: scrollTriggerConfig.workflowRight,
      })

        // Workflow lines draw animation
        gsap.fromTo('#workflow-section .flow-line', {
          strokeDashoffset: 100,
          opacity: 0,
        }, {
          strokeDashoffset: 0,
          opacity: 0.6,
          duration: 1.2,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: scrollTriggerConfig.workflowLines,
        })

        // Workflow title and description fade in with stagger
        gsap.fromTo('#workflow-section h2, #workflow-section p', {
          y: 30,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: scrollTriggerConfig.workflowTitle,
        })
      } // end if (!isMobileMode)

      const sections = gsap.utils.toArray('section')
      sections.forEach((sec: any) => {
        const revealElements = sec.querySelectorAll('.reveal-up')
        if (revealElements.length === 0) return
        
        const tl = gsap.timeline({
          paused: true,
          scrollTrigger: {
            trigger: sec,
            ...scrollTriggerConfig.revealUp,
          },
        })
        tl.to(revealElements, {
          opacity: 1,
          duration: 0.8,
          y: '0%',
          stagger: 0.2,
        })
      })

      // Refresh ScrollTrigger after all animations are set up
      ScrollTrigger.refresh()

// 监听 resize 事件刷新 ScrollTrigger
      window.addEventListener('resize', () => {
        ScrollTrigger.refresh()
      })
    } catch (e) {
      console.warn('GSAP not available, animations disabled:', e)
    }

    // 自动轮播
    if (carouselRef.value) {
      const el = carouselRef.value
      const speed = 1
      let paused = false

      el.addEventListener('mouseenter', () => { paused = true })
      el.addEventListener('mouseleave', () => { paused = false })

      // 鼠标滚轮切换图片
      el.addEventListener('wheel', (e) => {
        e.preventDefault()
        const direction = e.deltaY > 0 ? 1 : -1
        el.scrollBy({ left: direction * 320, behavior: 'smooth' })
      }, { passive: false })

      // 监听滚动更新当前索引
      el.addEventListener('scroll', () => {
        const children = el.children
        if (!children.length) return
        const itemW = children[0].offsetWidth + 24 // gap-6 = 24px
        carouselSlide.value = Math.round(el.scrollLeft / itemW)
      })

      carouselTimer = setInterval(() => {
        if (paused) return
        const maxScroll = el.scrollWidth - el.clientWidth
        if (el.scrollLeft >= maxScroll - 2) {
          el.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          el.scrollBy({ left: speed * 320, behavior: 'smooth' })
        }
      }, 3000)
    }
  })

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocumentClick)
  if (carouselTimer) clearInterval(carouselTimer)
  if (scrollTriggerInstance) {
    scrollTriggerInstance.getAll().forEach((t: any) => t.kill())
  }
})
</script>

<template>
  <div class="landing-page">
    <!-- Header -->
    <header id="main-header" ref="mainHeader">
      <!-- Logo -->
      <a id="header-logo" href="/">
        <img class="logo-dark" src="/assets/logo/logo_animated.svg" alt="logo" @mouseenter="replayLogo" />
        <img class="logo-light" src="/assets/logo/logo_animated-light.svg" alt="logo" @mouseenter="replayLogo" />
        <span>KKBAR</span>
      </a>

      <!-- Desktop Nav -->
      <nav id="header-nav">
        <a class="header-link" href="/guides/01-introduction/">文档</a>
        <a class="header-link" href="#dashboard-container">拟态面板</a>
        <a class="header-link" href="#why-kkbar">为什么选择</a>
        <a class="header-link" href="#workflow-section">流程图</a>
        <a class="header-link" href="#features">功能</a>
        <a class="header-link" href="#pricing">价格</a>
      </nav>

      <!-- Actions -->
      <div id="header-actions">
        <ThemeSwitch v-model="isDark" />
        <a id="header-cta" href="#download">
          <span>开始下载</span>
          <i class="bi bi-arrow-right"></i>
        </a>
      </div>

      <!-- Mobile hamburger -->
      <button id="header-hamburger" @click="isHeaderCollapsed = !isHeaderCollapsed" type="button"
        :aria-label="isHeaderCollapsed ? '打开菜单' : '关闭菜单'">
        <span class="hamburger-line" :class="{ 'hamburger-line--open': !isHeaderCollapsed }"></span>
      </button>

      <!-- Mobile drawer backdrop -->
      <Transition name="drawer-fade">
        <div v-if="!isHeaderCollapsed" id="drawer-backdrop" @click="isHeaderCollapsed = true"></div>
      </Transition>

      <!-- Mobile drawer -->
      <Transition name="drawer-slide">
        <div v-if="!isHeaderCollapsed" id="mobile-drawer">
          <nav id="drawer-nav">
            <a class="drawer-link" href="/guides/01-introduction/" @click="isHeaderCollapsed = true">
              <i class="bi bi-book"></i><span>文档</span>
            </a>
            <a class="drawer-link" href="#dashboard-container" @click="isHeaderCollapsed = true">
              <i class="bi bi-window"></i><span>拟态面板</span>
            </a>
            <a class="drawer-link" href="#why-kkbar" @click="isHeaderCollapsed = true">
              <i class="bi bi-question-circle"></i><span>为什么选择</span>
            </a>
            <a class="drawer-link" href="#workflow-section" @click="isHeaderCollapsed = true">
              <i class="bi bi-diagram-3"></i><span>流程图</span>
            </a>
            <a class="drawer-link" href="#features" @click="isHeaderCollapsed = true">
              <i class="bi bi-grid-3x3-gap"></i><span>功能</span>
            </a>
            <a class="drawer-link" href="#pricing" @click="isHeaderCollapsed = true">
              <i class="bi bi-tag"></i><span>价格</span>
            </a>
          </nav>
          <div id="drawer-footer">
            <ThemeSwitch v-model="isDark" />
            <a id="drawer-cta" href="#download" @click="isHeaderCollapsed = true">
              <span>开始下载</span>
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Hero Section -->
    <section class="hero-section tw-relative tw-mt-20 tw-flex tw-min-h-[100vh] tw-w-full tw-max-w-[100vw] tw-flex-col max-lg:tw-mt-[100px] max-md:tw-mt-0" id="hero-section">
      <!-- Video Modal -->
      <div class="tw-fixed tw-bg-[#000000af] dark:tw-bg-[#80808085] tw-top-0 tw-left-1/2 tw--translate-x-1/2 tw-z-20 tw-transition-opacity tw-duration-300 tw-p-2 tw-w-full tw-h-full tw-flex tw-place-content-center tw-place-items-center"
        :class="isVideoOpen ? 'tw-scale-100 tw-opacity-100' : 'tw-scale-0 tw-opacity-0'" @click.self="closeVideo">
        <div class="tw-max-w-[80vw] max-lg:tw-max-w-full max-lg:tw-w-full tw-scale-0 tw-transition-transform tw-duration-500 tw-p-6 tw-rounded-xl max-lg:tw-px-2 tw-w-full tw-gap-2 tw-shadow-md tw-h-[90vh] max-lg:tw-h-auto max-lg:tw-min-h-[400px] tw-bg-white dark:tw-bg-[#16171A] tw-max-h-full"
          :class="isVideoOpen ? 'tw-scale-100' : ''">
          <div class="tw-w-full tw-flex">
            <button type="button" @click="closeVideo" class="tw-ml-auto tw-text-xl" title="close">
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </div>
          <div class="tw-flex tw-w-full tw-rounded-xl tw-px-[5%] max-md:tw-px-2 tw-min-h-[300px] tw-max-h-[90%] tw-h-full">
            <div class="tw-relative tw-bg-black tw-min-w-full tw-min-h-full tw-overflow-clip tw-rounded-md">
              <iframe class="tw-absolute tw-top-[50%] tw--translate-y-[50%] tw-left-[50%] tw--translate-x-[50%] tw-w-full tw-h-full"
                src="https://www.youtube.com/embed/6j4fPVkA3EA?si=llcTrXPRM-MRXDZB&amp;controls=0&rel=0&showinfo=0&autoplay=1&loop=1&mute=1"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-bg-gradient tw-relative tw-flex tw-h-full tw-min-h-[100vh] tw-w-full tw-flex-col tw-place-content-center tw-gap-6 tw-p-[5%] max-xl:tw-place-items-center max-lg:tw-p-4">
        <div class="purple-bg-grad reveal-up tw-absolute tw-left-1/2 tw--translate-1/2 tw-top-[10%] tw-h-[120px] tw-w-[120px]"></div>
        <div class="tw-flex tw-flex-col tw-min-h-[60vh] tw-place-content-center tw-items-center">
          <h2 class="reveal-up tw-text-center tw-text-7xl tw-font-semibold tw-uppercase tw-leading-[90px] max-lg:tw-text-4xl max-md:tw-leading-snug">
            <span>集所有AI模型</span><br />
            <span class="tw-font-thin tw-font-serif">于一处</span>
          </h2>
          <div class="reveal-up tw-mt-8 tw-max-w-[450px] tw-text-lg max-lg:tw-text-base tw-p-2 tw-text-center tw-text-gray-800 dark:tw-text-white max-lg:tw-max-w-full">
            您的全能AI伴侣。在Kkbar界面中生成图像、视频、代码、文档，调试您的Web应用。
          </div>
          <div class="reveal-up tw-mt-10 max-md:tw-flex-col tw-flex tw-place-items-center tw-gap-4">
            <button @click="openVideo" class="btn !tw-w-[170px] max-lg:!tw-w-[160px] !tw-rounded-xl !tw-py-4 max-lg:!tw-py-2 tw-flex tw-gap-2 tw-group !tw-bg-transparent !tw-text-black dark:!tw-text-white tw-transition-colors tw-duration-[0.3s] tw-border-[1px] tw-border-black dark:tw-border-white">
              <div class="tw-relative tw-flex tw-place-items-center tw-place-content-center tw-w-6 tw-h-6">
                <div class="tw-absolute tw-inset-0 tw-top-0 tw-left-0 tw-scale-0 tw-duration-300 group-hover:tw-scale-100 tw-border-2 tw-border-gray-600 dark:tw-border-gray-200 tw-rounded-full tw-w-full tw-h-full"></div>
                <span class="bi bi-play-circle-fill"></span>
              </div>
              <span>观看视频</span>
            </button>
            <a class="btn tw-group max-lg:!tw-w-[160px] tw-flex tw-gap-2 tw-shadow-lg !tw-w-[170px] !tw-rounded-xl !tw-py-4 max-lg:!tw-py-2 tw-transition-transform tw-duration-[0.3s] hover:tw-scale-x-[1.03]" href="#">
              <span>立即开始</span>
              <i class="bi bi-arrow-right group-hover:tw-translate-x-1 tw-duration-300"></i>
            </a>
          </div>
        </div>

        <!-- CEP Preview Dashboard -->
        <div class="reveal-up dashboard-container tw-relative tw-mt-8 tw-flex tw-w-full tw-place-content-center tw-place-items-center" id="dashboard-container">
          <div class="purple-bg-grad reveal-up tw-absolute tw-left-1/2 tw--translate-x-1/2 tw-top-[5%] tw-h-[200px] tw-w-[200px]"></div>
          <div class="tw-relative tw-max-w-[80%] tw-bg-white dark:tw-bg-black tw-border-[1px] dark:tw-border-[#36393c] lg:tw-w-[1024px] lg:tw-h-[650px] tw-flex tw-shadow-xl max-lg:tw-h-[450px] max-lg:tw-w-full tw-overflow-hidden tw-min-w-[320px] md:tw-w-full tw-min-h-[450px] tw-rounded-xl tw-bg-transparent max-md:tw-max-w-full" id="dashboard">
            <div class="purple-bg-grad tw-max-w-[80%] reveal-up tw-absolute tw-left-1/2 tw--translate-x-1/2 tw-top-[0%] lg:tw-max-w-[1000px] tw-h-full tw-w-full"></div>
            <div class="animated-border tw-w-full tw-h-full tw-p-[2px]">
              <div class="tw-w-full tw-h-full tw-rounded-xl tw-overflow-hidden tw-flex">
                <div class="tw-flex tw-w-full tw-h-full" id="pixa-playground">
                  <CepPreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Carousel -->
    <section class="tw-relative tw-flex tw-w-full tw-max-w-[100vw] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden tw-p-8">
      <h2 class="reveal-up tw-text-3xl max-md:tw-text-xl">使用的技术栈和方案</h2>
      <div class="reveal-up carousel-container">
        <div class="carousel lg:w-place-content-center tw-mt-10 tw-flex tw-w-full">
          <template v-for="n in 2" :key="n">
            <a href="https://developer.adobe.com/photoshop/uxp/2022/" target="_blank" rel="noopener" class="carousel-img" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/adobe.svg" alt="CEP" /><span class="tw-text-xs tw-font-medium">CEP</span>
            </a>
            <a href="https://vuejs.org/" target="_blank" rel="noopener" class="carousel-img" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/vue.svg" alt="Vue 3" /><span class="tw-text-xs tw-font-medium">Vue 3</span>
            </a>
            <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener" class="carousel-img" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/pinia.svg" alt="Pinia" /><span class="tw-text-xs tw-font-medium">Pinia</span>
            </a>
            <a href="https://vitejs.dev/" target="_blank" rel="noopener" class="carousel-img" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/vite.svg" alt="Vite" /><span class="tw-text-xs tw-font-medium">Vite</span>
            </a>
            <a href="https://github.com/hyperbrew/bolt-cep" target="_blank" rel="noopener" class="carousel-img" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/bolt.svg" alt="Bolt CEP" /><span class="tw-text-xs tw-font-medium">Bolt CEP</span>
            </a>
            <a href="https://fontawesome.com" target="_blank" rel="noopener" class="carousel-img" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/fontawesome.svg" alt="FontAwesome" /><span class="tw-text-xs tw-font-medium">FontAwesome</span>
            </a>
            <a href="https://icons.getbootstrap.com" target="_blank" rel="noopener" class="carousel-img" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/bootstrap-icons.svg" alt="Bootstrap Icons" /><span class="tw-text-xs tw-font-medium">Bootstrap Icons</span>
            </a>
          </template>
        </div>
      </div>
    </section>

    <!-- 为什么选择 Kkbar -->
    <WhyKkbar :is-dark="isDark" />

    <!-- Workflow Diagram -->
    <section id="workflow-section" class="tw-relative tw-flex tw-w-full tw-max-w-[100vw] tw-flex-col tw-place-content-center tw-place-items-center tw-py-16 tw-px-4" style="overflow: visible;">
      <h2 class="reveal-up tw-text-4xl max-md:tw-text-2xl tw-text-center tw-mb-6 tw-font-semibold">工作流程示意</h2>
      <p class="reveal-up tw-text-base tw-text-center tw-text-gray-500 dark:tw-text-gray-400 tw-mb-8 tw-max-w-[600px]">
        {{ workflowDirection === 'ltr' ? '把零散的脚本、扩展面板、预设、素材库等统一使用 Kkbar 面板进行管理' : '一个面板即可触发多个功能' }}
      </p>
      <div class="reveal-up workflow-viewport">
        <div class="workflow-scale">
          <WorkflowDiagram :is-dark="isDark" @flow-change="onFlowChange" />
        </div>
      </div>
      <p class="reveal-up tw-mt-6 tw-text-center tw-text-sm tw-text-gray-400 dark:tw-text-gray-500 max-md:tw-hidden">
        点击中间按钮切换流向 · 双击复位卡片 · 点击标题栏切换面板版本
      </p>
    </section>

    <!-- Nine Button Features -->
    <section id="features" class="tw-relative tw-mt-10 tw-flex tw-min-h-[auto] tw-py-8 tw-w-full tw-max-w-[100vw] tw-flex-col tw-place-items-center lg:tw-p-6" style="overscroll-behavior: none;">
      <div class="reveal-up tw-flex tw-w-full tw-place-content-center tw-gap-2 tw-p-4 max-lg:tw-max-w-full max-lg:tw-flex-col" style="overscroll-behavior: none;">
        <div class="tw-relative tw-flex tw-max-w-[30%] max-lg:tw-max-w-full tw-flex-col tw-place-items-start tw-gap-4 tw-p-2 max-lg:tw-place-items-center max-lg:tw-place-content-center max-lg:tw-w-full max-lg:tw-flex-shrink-0">
          <div class="tw-top-40 tw-flex tw-flex-col lg:tw-sticky tw-place-items-center tw-max-h-fit tw-max-w-[850px] max-lg:tw-w-full max-lg:tw-px-4" id="feature-sticky-header">
            <h2 class="tw-text-5xl tw-font-serif tw-text-center tw-font-medium max-md:tw-text-3xl">九大按钮功能</h2>
            <div class="tw-mt-6 tw-w-full dialog-transition" ref="dialogViewportRef">
              <div class="dialog-hover-container" :style="{ width: DIALOG_NATURAL_WIDTH + 'px', zoom: dialogScale, marginLeft: 'auto', marginRight: 'auto' }">
                <DialogMockup :key="activeFeature" :type="activeFeature" @update:type="activeFeature = $event" />
              </div>
            </div>
            <p v-if="featureData[activeFeature]" class="tw-mt-4 tw-text-center tw-text-sm tw-text-gray-500 tw-max-w-[80%]">{{ featureData[activeFeature].desc }}</p>
          </div>
        </div>
        <div id="feature-card-list" class="tw-flex tw-flex-col tw-gap-10 tw-h-full tw-max-w-1/2 max-lg:tw-max-w-full tw-px-[10%] max-lg:tw-px-4 max-lg:tw-gap-3 max-lg:tw-w-full lg:tw-top-[20%] tw-place-items-center max-lg:tw-flex-row max-lg:tw-overflow-x-auto max-lg:tw-flex-shrink-0 max-lg:tw-flex-1 max-lg:tw-place-items-stretch max-lg:tw-snap-x max-lg:tw-snap-proximity">
          <div v-for="(item, key) in featureData" :key="key" :id="'feature-card-' + key" class="reveal-up tw-h-auto tw-w-[450px] max-lg:tw-w-[72vw] max-lg:tw-flex-shrink-0 max-lg:tw-snap-center">
            <div @click="navigateToFeature(key)" :class="{ 'feature-card--active': activeFeature === key }" class="tw-flex tw-w-full tw-h-full tw-gap-3 tw-rounded-lg hover:tw-shadow-lg dark:tw-shadow-[#171717] tw-duration-300 tw-transition-all tw-p-3 tw-group/card tw-cursor-pointer feature-card">
              <div class="tw-text-2xl max-md:tw-text-xl tw-flex-shrink-0 feature-card__icon-wrap">
                <i class="bi feature-card__icon" :class="{
                  'bi-file-code-fill': key === 'jsx',
                  'bi-layers-fill': key === 'preset',
                  'bi-clipboard-fill': key === 'clipboard',
                  'bi-magic': key === 'effect',
                  'bi-code-slash': key === 'expression',
                  'bi-terminal-fill': key === 'scriptlet',
                  'bi-window-stack': key === 'panel',
                  'bi-list-ul': key === 'menuItem',
                  'bi-terminal': key === 'shell',
                }"></i>
              </div>
              <div class="tw-flex tw-flex-col tw-gap-1 tw-flex-1">
                <h3 class="tw-text-base max-md:tw-text-sm">{{ item.title }}</h3>
                <p class="tw-text-gray-800 dark:tw-text-gray-100 tw-text-xs tw-line-clamp-2">{{ item.desc }}</p>
                <a :href="item.link" @click.stop class="tw-text-xs tw-text-purple-500 tw-mt-1">了解更多</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation: Dots + Arrows -->
        <div class="feature-nav-dots lg:tw-hidden tw-flex tw-items-center tw-justify-center tw-gap-4 tw-mt-4 tw-w-full">
          <button class="feature-nav-arrow" @click="prevFeature" aria-label="上一个">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div class="feature-dots tw-flex tw-items-center tw-gap-2">
            <button
              v-for="(key, index) in featureKeys"
              :key="key"
              class="feature-dot"
              :class="{ 'feature-dot--active': activeFeatureIndex === index }"
              @click="navigateToFeature(key)"
              :aria-label="featureData[key].title"
            />
          </div>
          <button class="feature-nav-arrow" @click="nextFeature" aria-label="下一个">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Additional Features -->
    <section class="tw-relative tw-flex tw-w-full tw-min-h-[auto] tw-py-8 tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden">
      <div class="tw-w-full max-lg:tw-max-w-full tw-place-content-center tw-items-center tw-flex tw-flex-col tw-max-w-[80%] tw-gap-4 tw-p-4">
        <h3 class="reveal-up tw-text-4xl tw-font-medium max-md:tw-text-2xl tw-text-center tw-leading-normal">特点</h3>
        <div class="tw-mt-6 tw-relative tw-gap-6 tw-p-4 tw-grid tw-place-items-center tw-grid-cols-3 max-lg:tw-grid max-lg:tw-grid-cols-2 max-md:tw-grid max-md:tw-grid-cols-2 max-[480px]:tw-grid-cols-1">
          <div v-for="item in additionalFeatures" :key="item.title" class="reveal-up feature-item tw-w-[280px] tw-border-[1px] tw-h-[320px] tw-rounded-md tw-place-items-center tw-p-3 tw-bg-[#f2f3f4] max-md:tw-w-[260px] dark:tw-bg-[#141414] dark:tw-border-[#1f2123] tw-flex tw-flex-col tw-gap-2">
            <div class="feature-item__img-wrap tw-w-full tw-h-[180px] tw-p-3 tw-rounded-xl tw-backdrop-blur-2xl tw-overflow-hidden tw-flex tw-place-content-center"
              @mouseenter="startHoverTimer(item.img)"
              @mouseleave="cancelHoverTimer">
              <img :src="item.img" :alt="item.title" class="feature-item__img tw-w-auto tw-h-full tw-object-contain" />
            </div>
            <h3 class="tw-text-xl">{{ item.title }}</h3>
            <p class="tw-text-gray-700 dark:tw-text-gray-300 tw-px-2 tw-text-center tw-text-[10px]">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog -->
    <section class="tw-mt-5 tw-flex tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-p-[2%] max-lg:tw-p-3">
      <h3 class="reveal-up tw-text-4xl tw-font-medium max-md:tw-text-2xl">更多</h3>
      <div class="reveal-up tw-mt-10 tw-w-full tw-max-w-[1200px] tw-overflow-hidden tw-px-4">
        <div ref="carouselRef" class="tw-flex tw-gap-6 tw-overflow-x-auto tw-scroll-smooth tw-snap-x tw-snap-mandatory tw-pb-4" style="scrollbar-width: none; -ms-overflow-style: none;">
          <div v-for="(article, idx) in articleList" :key="idx" class="tw-flex-shrink-0 tw-w-[80vw] md:tw-w-[60vw] lg:tw-w-[45vw] tw-snap-center tw-rounded-xl tw-overflow-hidden">
            <div class="tw-aspect-video tw-overflow-hidden tw-rounded-xl article-img-wrap"
              @click="fullscreenImage = article.img">
              <img :src="article.img" :alt="article.title" class="article-img tw-w-full tw-h-full tw-object-cover" />
            </div>
            <h3 class="tw-mt-3 tw-font-medium tw-text-lg tw-text-center">{{ article.title }}</h3>
          </div>
        </div>
        <!-- 圆点指示器 -->
        <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">
          <button v-for="(_, idx) in articleList" :key="idx"
            class="tw-w-2 tw-h-2 tw-rounded-full tw-transition-all tw-duration-300 tw-cursor-pointer"
            :class="carouselSlide === idx ? 'tw-bg-purple-500 tw-w-6' : 'tw-bg-gray-400 dark:tw-bg-gray-600'"
            @click="scrollToSlide(idx)"
            :aria-label="'跳转到第' + (idx + 1) + '张'" />
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="tw-mt-5 tw-flex tw-w-full tw-flex-col tw-gap-6 tw-place-items-center tw-p-[2%]" id="pricing">
      <h3 class="reveal-up tw-text-5xl tw-font-medium max-md:tw-text-2xl">选择适合您的计划</h3>
      <div class="tw-mt-10 tw-flex tw-flex-wrap tw-place-content-center tw-gap-8 max-lg:tw-flex-col max-lg:tw-place-items-center">
        <div class="reveal-up">
          <div class="pricing-card">
            <div class="pricing-card__header">
              <span class="pricing-card__tier">免费版</span>
              <div class="pricing-card__price"><span class="pricing-card__amount">¥0</span><span class="pricing-card__period">/永久</span></div>
              <p class="pricing-card__desc">适合个人探索和基础使用</p>
            </div>
            <div class="pricing-card__divider"></div>
            <ul class="pricing-card__features">
              <li class="pricing-card__feature"><i class="bi bi-check-circle-fill pricing-card__check"></i><span>所有基础 AE 脚本</span></li>
              <li class="pricing-card__feature"><i class="bi bi-check-circle-fill pricing-card__check"></i><span>自定义工具栏</span></li>
              <li class="pricing-card__feature"><i class="bi bi-check-circle-fill pricing-card__check"></i><span>导入/导出配置</span></li>
              <li class="pricing-card__feature pricing-card__feature--disabled"><i class="bi bi-x-circle pricing-card__check pricing-card__check--off"></i><span>云端同步</span></li>
              <li class="pricing-card__feature pricing-card__feature--disabled"><i class="bi bi-x-circle pricing-card__check pricing-card__check--off"></i><span>技术支持</span></li>
            </ul>
            <a href="#" class="pricing-card__cta pricing-card__cta--outline">免费使用 <i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
        <div class="reveal-up">
          <div class="pricing-card pricing-card--featured">
            <div class="pricing-card__badge">推荐</div>
            <div class="pricing-card__header">
              <span class="pricing-card__tier">专业版</span>
              <div class="pricing-card__price"><span class="pricing-card__amount">¥8.8</span><span class="pricing-card__period">/永久</span></div>
              <p class="pricing-card__desc">一次付费，终身使用，持续更新</p>
            </div>
            <div class="pricing-card__divider"></div>
            <ul class="pricing-card__features">
              <li class="pricing-card__feature"><i class="bi bi-check-circle-fill pricing-card__check"></i><span>免费版全部功能</span></li>
              <li class="pricing-card__feature"><i class="bi bi-check-circle-fill pricing-card__check"></i><span>高级脚本库</span></li>
              <li class="pricing-card__feature"><i class="bi bi-check-circle-fill pricing-card__check"></i><span>云端同步</span></li>
              <li class="pricing-card__feature"><i class="bi bi-check-circle-fill pricing-card__check"></i><span>优先技术支持</span></li>
              <li class="pricing-card__feature"><i class="bi bi-check-circle-fill pricing-card__check"></i><span>新功能抢先体验</span></li>
            </ul>
            <a href="/guides/04-free-vs-pro.html#第二步-选择支持方式" class="pricing-card__cta pricing-card__cta--primary">立即支持 <i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </section>

    <!-- Download -->
    <DownloadPage id="download" />

    <!-- FAQ -->
    <section class="tw-relative tw-flex tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-gap-[10%] tw-p-[5%] tw-px-[10%]">
      <h3 class="tw-text-4xl tw-font-medium max-md:tw-text-2xl">常见问题</h3>
      <div class="tw-mt-5 tw-flex tw-min-h-[300px] tw-w-full tw-max-w-[850px] tw-flex-col tw-gap-4">
        <div v-for="(faq, idx) in faqList" :key="idx" class="faq tw-w-full">
          <h4 class="faq-accordion tw-flex tw-w-full tw-select-none tw-text-xl max-md:tw-text-lg" @click="toggleFaq">
            <span>{{ faq.q }}</span>
            <i class="bi bi-plus tw-text-xl tw-origin-center tw-duration-300 tw-transition-transform tw-ml-auto tw-font-semibold"></i>
          </h4>
          <div class="content max-lg:tw-text-sm">{{ faq.a }}</div>
          <hr v-if="idx < faqList.length - 1" />
        </div>
      </div>
      <div class="purple-bg-grad max-md:tw-hidden reveal-up tw-absolute tw-bottom-14 tw-right-[20%] tw-h-[150px] tw-w-[150px] tw-rounded-full"></div>
    </section>

    <!-- Footer -->
    <footer class="tw-mt-auto tw-flex tw-flex-col tw-w-full tw-gap-4 tw-text-sm tw-pt-[5%] tw-pb-10 tw-px-[10%] tw-text-black dark:tw-text-white max-md:tw-flex-col">
      <div class="tw-flex max-md:tw-flex-col max-md:tw-gap-6 tw-gap-3 tw-w-full tw-place-content-around">
        <div class="tw-flex tw-h-full tw-w-[250px] tw-flex-col tw-place-items-center tw-gap-4 max-md:tw-w-full">
          <a href="javascript:void(0)" class="tw-w-full tw-place-items-center tw-flex tw-flex-col tw-gap-2">
            <span class="tw-text-4xl tw-font-bold tw-tracking-tight">KKBAR</span>
            <span class="tw-text-xs tw-opacity-70">CEP toolbar for After Effects</span>
          </a>
          <div class="tw-flex tw-gap-4 tw-text-lg tw-mt-2">
            <a href="https://github.com/yancongya" aria-label="Github" class="tw-w-6 tw-h-6"><img src="./assets/github.svg" class="tw-w-full tw-h-full" alt="Github" /></a>
            <a href="https://space.bilibili.com/100881808/" aria-label="Bilibili" class="tw-w-6 tw-h-6"><img src="./assets/bilibili.svg" class="tw-w-full tw-h-full" alt="Bilibili" /></a>
            <a href="https://xhslink.com/m/9v4RK5HQzsc" aria-label="小红书" class="tw-w-6 tw-h-6"><img src="./assets/xiaohongshu.svg" class="tw-w-full tw-h-full" alt="小红书" /></a>
            <a href="javascript:void(0)" aria-label="Email" @click="copyEmail"><i class="bi bi-envelope"></i></a>
          </div>
        </div>
        <div class="tw-flex max-md:tw-grid max-md:tw-grid-cols-2 tw-flex-wrap tw-gap-6 tw-h-full tw-w-full tw-justify-around">
          <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4">
            <h2 class="tw-text-xl">项目</h2>
            <div class="tw-flex tw-flex-col tw-gap-3">
              <a href="https://rualive.itycon.cn/" class="footer-link" target="_blank" rel="noreferrer">rualive</a>
              <a href="https://kbar.itycon.cn/" class="footer-link" target="_blank" rel="noreferrer">KBar 中文站</a>
              <a href="https://yancongya.github.io/auto_tinify/" class="footer-link" target="_blank" rel="noreferrer">AE 压缩图片</a>
              <a href="https://yancongya.github.io/PSD-Batch-Processor/" class="footer-link" target="_blank" rel="noreferrer">PSD 批量处理</a>
            </div>
          </div>
          <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4">
            <h2 class="tw-text-xl">资源</h2>
            <div class="tw-flex tw-flex-col tw-gap-3">
              <a href="https://aemarketplace.vercel.app/" class="footer-link" target="_blank" rel="noreferrer">AE Marketplace</a>
              <a href="https://www.lookae.com/" class="footer-link" target="_blank" rel="noreferrer">Lookae</a>
              <a href="https://c4dsky.com/" class="footer-link" target="_blank" rel="noreferrer">C4DSky</a>
              <a href="https://www.gfxcamp.com/" class="footer-link" target="_blank" rel="noreferrer">GFXCamp</a>
              <a href="https://www.yuelili.com/" class="footer-link" target="_blank" rel="noreferrer">月离</a>
            </div>
          </div>
          <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4">
            <h2 class="tw-text-xl">支持</h2>
            <div class="tw-flex tw-flex-col tw-gap-3">
              <a href="https://ifdian.net/item/996fc7123f2c11f1982e5254001e7c00" class="footer-link" target="_blank" rel="noreferrer">爱发电</a>
              <a href="javascript:void(0)" class="footer-link" @click="showSupportQr = true">支付宝/微信</a>
            </div>
          </div>
          
        </div>
      </div>
      <hr class="tw-mt-8" />
      <div class="tw-mt-2 tw-flex tw-gap-2 tw-flex-col tw-text-gray-700 dark:tw-text-gray-300 tw-place-items-center tw-text-[12px] tw-w-full tw-text-center tw-place-content-around">
        <span>Copyright &#169; 2023-2026 Kkbar. All rights reserved.</span>
        <span>烟囱鸭 - 一个做动画的</span>
      </div>
    </footer>
      <!-- 支付宝/微信二维码弹窗 -->
      <Teleport to="body">
        <div v-if="showSupportQr" class="support-qr-mask" @click.self="showSupportQr = false">
          <div class="support-qr-card">
            <div class="support-qr-header">
              <span>扫码支持</span>
              <button class="support-qr-close" @click="showSupportQr = false">&times;</button>
            </div>
            <div class="support-qr-body">
              <div class="support-qr-item">
                <img src="./assets/alipay.jpg" alt="支付宝" />
                <span>支付宝</span>
              </div>
              <div class="support-qr-item">
                <img src="./assets/wechat.jpg" alt="微信" />
                <span>微信</span>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
      <!-- 邮箱复制 Toast -->
      <Teleport to="body">
        <div v-if="showEmailToast" class="email-toast">邮箱已复制到剪贴板</div>
      </Teleport>
      <!-- 图片全屏显示 -->
      <div v-if="fullscreenImage" class="fullscreen-mask" @click.self="closeFullscreen">
        <div class="fullscreen-content">
          <img :src="fullscreenImage" alt="全屏图片" class="fullscreen-img" @click.stop />
        </div>
      </div>
  </div>
</template>

<style scoped>
/* 后续页面无波点 */
.landing-page {
  background-color: #f8fafc;
}

html.dark .landing-page,
html.tw-dark .landing-page {
  background-color: #000;
}

.feature-card {
  border: 1px solid transparent;
}

.feature-card--active {
  border-color: #667eea;
  box-shadow: 0 0 0 1px #667eea;
}

.feature-card__icon-wrap {
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-card__icon-wrap {
  transform: scale(1.15) rotate(-5deg);
}

.feature-card__icon {
  transition: color 0.3s ease;
}

.feature-card:hover .feature-card__icon {
  color: #667eea !important;
}

.feature-nav-dots {
  display: none;
}

.dialog-hover-container {
  transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
  transform-origin: center;
  border-radius: 12px;
  overflow: hidden;
}

.dialog-hover-container:hover {
  transform: scale(1.02) translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
  filter: brightness(1.05);
}

@media (prefers-color-scheme: dark) {
  .dialog-hover-container:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2);
  }
}

@media (max-width: 1023px) {
  .feature-nav-dots {
    display: flex;
  }
}

div::-webkit-scrollbar {
  display: none;
}

.support-qr-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.support-qr-card {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
}

.support-qr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.support-qr-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.7;
}

.support-qr-close:hover {
  opacity: 1;
}

.support-qr-body {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.support-qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.support-qr-item img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 8px;
  background: #fff;
}

.support-qr-item span {
  color: #fff;
  font-size: 14px;
}

.email-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 9999;
  animation: toast-fade 2s ease;
}

@keyframes toast-fade {
  0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
  15% { opacity: 1; transform: translateX(-50%) translateY(0); }
  85% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}

/* 特点项hover效果 */
.feature-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.dark .feature-item:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.feature-item__img-wrap {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.feature-item__img {
  transition: transform 0.5s ease, filter 0.3s ease;
}

/* 亮色模式下图片反相，增加对比度避免偏灰 */
html:not(.dark) .feature-item__img {
  filter: invert(1) brightness(0.85) contrast(1.3);
}

/* hover时稍微提亮 */
html:not(.dark) .feature-item__img-wrap:hover .feature-item__img {
  filter: invert(1) brightness(0.9) contrast(1.2);
}

.feature-item__img-wrap:hover .feature-item__img {
  transform: scale(1.1);
}

/* 更多页面图片hover效果 */
.article-img-wrap {
  cursor: pointer;
}

.article-img {
  transition: transform 0.7s ease;
}

.article-img-wrap:hover .article-img {
  transform: scale(1.05);
}

/* 全屏图片显示 */
.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: opacity 0.3s ease;
}

.fullscreen-enter-from,
.fullscreen-leave-to {
  opacity: 0;
}

.fullscreen-mask {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.fullscreen-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: pointer;
}

.fullscreen-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

html:not(.dark) .fullscreen-img {
  filter: invert(1) brightness(0.85) contrast(1.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
