<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import CepPreview from './components/CepPreview.vue'

import DialogMockup from './components/DialogMockup.vue';
import WorkflowDiagram from './components/WorkflowDiagram.vue';

const isDark = ref(true)
const isHeaderCollapsed = ref(true)
const isNavDropdownOpen = ref(false)
const workflowDirection = ref('ltr')

function onFlowChange(direction) {
  workflowDirection.value = direction
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('tw-dark', isDark.value)
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('kkbar-dark', String(isDark.value))
  localStorage.setItem('vitepress-theme-appearance', isDark.value ? 'dark' : 'light')
}

const isVideoOpen = ref(false)
const carouselRef = ref<HTMLElement | null>(null)
let carouselTimer: ReturnType<typeof setInterval> | null = null

function openVideo() {
  isVideoOpen.value = true
}

function closeVideo() {
  isVideoOpen.value = false
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
  { img: '/assets/images/actions.png', title: '九大动作类型' },
  { img: '/assets/images/buttons.png', title: '自定义按钮' },
  { img: '/assets/images/cep.png', title: 'CEP 面板预览' },
  { img: '/assets/images/icons0.png', title: '图标系统' },
  { img: '/assets/images/presets0.png', title: '预设管理' },
  { img: '/assets/images/jsx0.png', title: '脚本执行' },
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
  // 优先从 VitePress 读取，其次读取 kkbar-dark
  const vitepressDark = localStorage.getItem('vitepress-theme-appearance')
  const kkbarDark = localStorage.getItem('kkbar-dark')
  if (vitepressDark !== null) {
    isDark.value = vitepressDark === 'dark'
  } else if (kkbarDark !== null) {
    isDark.value = kkbarDark === 'true'
  }
  if (isDark.value) {
    document.documentElement.classList.add('tw-dark', 'dark')
  } else {
    document.documentElement.classList.remove('tw-dark', 'dark')
  }

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
        <div class="header-dropdown" :class="{ 'header-dropdown--open': isNavDropdownOpen }">
          <button class="header-link header-dropdown__toggle" @click="isNavDropdownOpen = !isNavDropdownOpen" type="button">
            <span>功能</span>
            <i class="bi bi-chevron-down"></i>
          </button>
          <div class="header-dropdown__panel" @click.stop>
            <div class="header-dropdown__grid">
              <a class="header-dropdown__item" href="#"><i class="bi bi-list-columns-reverse"></i><div><strong>提示词库</strong><p>内置预制提示词模板</p></div></a>
              <a class="header-dropdown__item" href="#"><i class="bi bi-grid-1x2-fill"></i><div><strong>统一接口</strong><p>在一个界面中测试多种AI模型</p></div></a>
              <a class="header-dropdown__item" href="#"><i class="bi bi-globe"></i><div><strong>实时网络搜索</strong><p>实时搜索互联网</p></div></a>
              <a class="header-dropdown__item" href="#"><i class="bi bi-image-fill"></i><div><strong>图像生成</strong><p>从提示词生成图像</p></div></a>
              <a class="header-dropdown__item" href="#"><i class="bi bi-calendar-range"></i><div><strong>历史记录</strong><p>从中断处继续对话</p></div></a>
              <a class="header-dropdown__item" href="#"><i class="bi bi-translate"></i><div><strong>多语言支持</strong><p>支持多语言对话</p></div></a>
            </div>
          </div>
        </div>
        <a class="header-link" href="#pricing">价格</a>
        <a class="header-link" href="#">博客</a>
      </nav>

      <!-- Actions -->
      <div id="header-actions">
        <button id="theme-toggle" @click="toggleTheme" type="button" :title="isDark ? '切换到浅色' : '切换到深色'">
          <i class="bi" :class="isDark ? 'bi-sun-fill' : 'bi-moon-fill'"></i>
        </button>
        <a id="header-cta" href="#hero-section">
          <span>试用工具</span>
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
            <button class="drawer-link" @click="isNavDropdownOpen = !isNavDropdownOpen" type="button">
              <i class="bi bi-grid-3x3-gap"></i><span>功能</span>
              <i class="bi bi-chevron-down drawer-link__arrow" :class="{ 'drawer-link__arrow--open': isNavDropdownOpen }"></i>
            </button>
            <Transition name="drawer-expand">
              <div v-if="isNavDropdownOpen" class="drawer-submenu">
                <a class="drawer-sublink" href="#"><i class="bi bi-list-columns-reverse"></i>提示词库</a>
                <a class="drawer-sublink" href="#"><i class="bi bi-grid-1x2-fill"></i>统一接口</a>
                <a class="drawer-sublink" href="#"><i class="bi bi-globe"></i>实时网络搜索</a>
                <a class="drawer-sublink" href="#"><i class="bi bi-image-fill"></i>图像生成</a>
                <a class="drawer-sublink" href="#"><i class="bi bi-calendar-range"></i>历史记录</a>
                <a class="drawer-sublink" href="#"><i class="bi bi-translate"></i>多语言支持</a>
              </div>
            </Transition>
            <a class="drawer-link" href="#pricing" @click="isHeaderCollapsed = true">
              <i class="bi bi-tag"></i><span>价格</span>
            </a>
            <a class="drawer-link" href="#" @click="isHeaderCollapsed = true">
              <i class="bi bi-pencil-square"></i><span>博客</span>
            </a>
          </nav>
          <div id="drawer-footer">
            <button id="drawer-theme" @click="toggleTheme" type="button">
              <i class="bi" :class="isDark ? 'bi-sun-fill' : 'bi-moon-fill'"></i>
              <span>{{ isDark ? '浅色模式' : '深色模式' }}</span>
            </button>
            <a id="drawer-cta" href="#hero-section" @click="isHeaderCollapsed = true">
              <span>试用工具</span>
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Hero Section -->
    <section class="hero-section tw-relative tw-mt-20 tw-flex tw-min-h-[100vh] tw-w-full tw-max-w-[100vw] tw-flex-col tw-overflow-hidden max-lg:tw-mt-[100px] max-md:tw-mt-0" id="hero-section">
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
        <div class="reveal-up tw-relative tw-mt-8 tw-flex tw-w-full tw-place-content-center tw-place-items-center" id="dashboard-container">
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
    <section class="tw-relative tw-mt-10 tw-flex tw-min-h-[auto] tw-py-8 tw-w-full tw-max-w-[100vw] tw-flex-col tw-place-items-center lg:tw-p-6" style="overscroll-behavior: none;">
      <div class="reveal-up tw-flex tw-w-full tw-place-content-center tw-gap-2 tw-p-4 max-lg:tw-max-w-full max-lg:tw-flex-col" style="overscroll-behavior: none;">
        <div class="tw-relative tw-flex tw-max-w-[30%] max-lg:tw-max-w-full tw-flex-col tw-place-items-start tw-gap-4 tw-p-2 max-lg:tw-place-items-center max-lg:tw-place-content-center max-lg:tw-w-full max-lg:tw-flex-shrink-0">
          <div class="tw-top-40 tw-flex tw-flex-col lg:tw-sticky tw-place-items-center tw-max-h-fit tw-max-w-[850px] max-lg:tw-w-full max-lg:tw-px-4" id="feature-sticky-header">
            <h2 class="tw-text-5xl tw-font-serif tw-text-center tw-font-medium max-md:tw-text-3xl">九大按钮功能</h2>
            <div class="tw-mt-6 tw-w-full dialog-transition" ref="dialogViewportRef">
              <div :style="{ width: DIALOG_NATURAL_WIDTH + 'px', zoom: dialogScale, marginLeft: 'auto', marginRight: 'auto' }">
                <DialogMockup :key="activeFeature" :type="activeFeature" @update:type="activeFeature = $event" />
              </div>
            </div>
            <p v-if="featureData[activeFeature]" class="tw-mt-4 tw-text-center tw-text-sm tw-text-gray-500 tw-max-w-[80%]">{{ featureData[activeFeature].desc }}</p>
          </div>
        </div>
        <div id="feature-card-list" class="tw-flex tw-flex-col tw-gap-10 tw-h-full tw-max-w-1/2 max-lg:tw-max-w-full tw-px-[10%] max-lg:tw-px-4 max-lg:tw-gap-3 max-lg:tw-w-full lg:tw-top-[20%] tw-place-items-center max-lg:tw-flex-row max-lg:tw-overflow-x-auto max-lg:tw-flex-shrink-0 max-lg:tw-flex-1 max-lg:tw-place-items-stretch max-lg:tw-snap-x max-lg:tw-snap-proximity">
          <div v-for="(item, key) in featureData" :key="key" :id="'feature-card-' + key" class="reveal-up tw-h-auto tw-w-[450px] max-lg:tw-w-[72vw] max-lg:tw-flex-shrink-0 max-lg:tw-snap-center">
            <div @click="navigateToFeature(key)" class="tw-flex tw-w-full tw-h-full tw-gap-3 tw-rounded-lg hover:tw-shadow-lg dark:tw-shadow-[#171717] tw-duration-300 tw-transition-all tw-p-3 tw-group/card tw-cursor-pointer">
              <div class="tw-text-2xl max-md:tw-text-xl tw-flex-shrink-0">
                <i class="bi" :class="{
                  'bi-file-code-fill': key === 'jsx',
                  'bi-layers-fill': key === 'preset',
                  'bi-clipboard-fill': key === 'clipboard',
                  'bi-magic': key === 'effect',
                  'bi-code-slash': key === 'expression',
                  'bi-terminal-fill': key === 'scriptlet',
                  'bi-window-fill': key === 'panel',
                  'bi-list-ul': key === 'menuItem',
                  'bi-shell': key === 'shell',
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
          <div v-for="item in additionalFeatures" :key="item.title" class="reveal-up tw-w-[280px] tw-border-[1px] tw-h-[320px] tw-rounded-md tw-place-items-center tw-p-3 tw-bg-[#f2f3f4] max-md:tw-w-[260px] dark:tw-bg-[#141414] dark:tw-border-[#1f2123] tw-flex tw-flex-col tw-gap-2">
            <div class="tw-w-full tw-h-[180px] tw-p-3 tw-rounded-xl tw-backdrop-blur-2xl tw-overflow-hidden tw-flex tw-place-content-center">
              <img :src="item.img" :alt="item.title" class="tw-w-auto tw-h-full tw-object-contain" />
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
            <div class="tw-aspect-video tw-overflow-hidden tw-rounded-xl">
              <img :src="article.img" :alt="article.title" class="tw-w-full tw-h-full tw-object-cover tw-transition-transform tw-duration-700 hover:tw-scale-105" />
            </div>
            <h3 class="tw-mt-3 tw-font-medium tw-text-lg tw-text-center">{{ article.title }}</h3>
          </div>
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
            <a href="#" class="pricing-card__cta pricing-card__cta--primary">立即支持 <i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </section>

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
        <div class="tw-flex tw-h-full tw-w-[250px] tw-flex-col tw-place-items-center tw-gap-6 max-md:tw-w-full">
          <a href="javascript:void(0)" class="tw-w-full tw-place-items-center tw-flex tw-flex-col tw-gap-6">
            <svg class="logo-svg tw-max-w-[120px]" viewBox="0 0 444.44 441.44" xmlns="http://www.w3.org/2000/svg">
              <path class="logo-path" d="m444.43,219.87c0,53.01.03,106.02-.02,159.03-.01,14.61-3.15,28.25-11.33,39.82-10.18,14.42-23.64,22.29-39.85,22.5-31.92.41-63.85.11-95.78.16-2.09,0-3.5-.74-4.83-2.64-9.71-13.95-19.53-27.81-29.29-41.72-.15-.21-.26-.45-.36-.71-.26-.65.05-1.41.64-1.65.36-.14.71-.25,1.07-.25,14.29-.04,28.58-.04,42.87-.04,14.75,0,29.5.02,44.24-.04.76,0,1.51-.26,2.27-.53.62-.22.93-1,.67-1.67-.32-.83-.65-1.65-1.16-2.28-8.3-10.33-16.69-20.58-25.02-30.89-9.04-11.18-18.03-22.41-27.05-33.61-6.24-7.74-12.47-15.48-18.73-23.2-10.61-13.08-21.23-26.15-31.85-39.22-6.57-8.1-13.15-16.2-19.72-24.29-3.55-4.38-7.08-8.78-10.67-13.12-1.39-1.67-.93-2.99.27-4.42,3.92-4.7,7.81-9.43,11.71-14.16,11.79-14.27,23.58-28.55,35.38-42.81,10.99-13.29,22.01-26.54,33-39.83,12.2-14.75,24.39-29.52,36.55-44.32,1.26-1.53,2.62-2.27,4.47-2.27,17.5.04,35.01.02,52.51.06.41,0,.81.14,1.22.31.59.25.87,1.01.61,1.66-.18.45-.38.89-.66,1.23-8.44,10.29-16.93,20.54-25.4,30.79-15.65,18.94-31.29,37.88-46.95,56.8-9.29,11.22-18.62,22.4-27.94,33.59-5,6-10.03,11.97-15,18-2.56,3.11-2.49,3.35.11,6.54,15.35,18.85,30.67,37.72,46.02,56.57,11.88,14.59,23.78,29.15,35.66,43.74,12.1,14.86,24.18,29.75,36.29,44.59.24.29.54.51.86.7.56.34,1.25.06,1.5-.59.22-.57.42-1.15.42-1.72.05-18.02.04-36.04.04-54.05,0-80.63,0-161.27,0-241.9,0-8.53-2.37-15.85-8.64-20.97-4.52-3.69-9.78-4.9-15.27-4.9-35.53-.01-71.06,0-106.59-.01-13.24,0-26.49.2-39.73-.06-12.44-.24-22.26,5.58-30.52,15.65-6.38,7.79-12.87,15.47-19.28,23.23-10.8,13.08-21.56,26.2-32.36,39.29-6.67,8.09-13.38,16.15-20.06,24.23-11.71,14.16-23.41,28.32-35.12,42.48-6.73,8.13-13.48,16.24-20.21,24.38-11.98,14.48-23.94,28.97-35.92,43.46-11.52,13.94-23.05,27.88-34.57,41.82-.36.43-.72.88-1.12,1.25-1.03.97-1.67.72-1.78-.84-.05-.67-.04-1.34-.04-2.01,0-98.5,0-197,0-295.51C.03.26.17.04,4.87.04c12.98,0,25.96.07,38.93.13,2.25,0,2.93.96,2.9,4.16-.04,5.65-.21,11.3-.2,16.95.04,18,.2,36,.21,54.01,0,9.97-.24,19.94-.26,29.91-.05,22.7-.04,45.39,0,68.09,0,.67.25,1.34.51,2.01.25.62.9.89,1.44.61s1.04-.57,1.41-1.01c8.25-9.98,16.44-20.03,24.67-30.04,6.44-7.83,12.91-15.62,19.37-23.43,13.4-16.23,26.79-32.47,40.19-48.69,6.55-7.93,13.08-15.86,19.67-23.74,8.21-9.83,16.22-19.88,24.75-29.33C189.33,7.62,202.53.85,217.8.44c14.67-.39,29.35-.11,44.03-.16,22.48-.07,44.97-.19,67.45-.24,20.06-.04,40.12-.05,60.18,0,10.37.03,20.39,1.98,29.49,8.01,15.48,10.25,24.46,25.53,25.01,45.89.69,25.96.4,51.95.45,77.93.05,29.33.01,58.67.02,88ZM234.21,76.74c-3.17-.09-5.42,1.03-7.54,3.66-8.8,10.92-17.74,21.71-26.63,32.54-5.94,7.24-11.9,14.47-17.82,21.73-12.56,15.39-25.09,30.8-37.65,46.19-6.99,8.57-13.99,17.12-21.02,25.65-1.41,1.71-1.43,4.36-.05,6.11,2.31,2.94,4.56,5.94,6.85,8.9,9.86,12.74,19.73,25.48,29.59,38.22,9.08,11.74,18.15,23.49,27.25,35.2,9.53,12.28,19.11,24.51,28.65,36.79,8.54,10.99,17.05,22.01,25.54,33.05,1.31,1.7,2.8,2.42,4.81,2.4,8.85-.08,17.7-.02,26.55-.02,8.19,0,16.39,0,24.58-.04.17,0,.35-.04.52-.09.71-.22,1.04-1.15.64-1.85-.06-.11-.13-.22-.21-.32-2.15-2.81-4.35-5.57-6.51-8.36-16.78-21.58-33.56-43.17-50.34-64.76-15.65-20.14-31.3-40.28-46.95-60.42-4.77-6.14-9.51-12.29-14.31-18.4-1.27-1.62-1.41-3.05.01-4.65,1.21-1.36,2.29-2.87,3.46-4.27,11.92-14.34,23.87-28.63,35.75-43.01,10.09-12.21,20.07-24.53,30.14-36.76,12.22-14.84,24.49-29.62,36.71-44.45.22-.27.4-.58.57-.91.34-.67.06-1.52-.59-1.78-.36-.14-.72-.25-1.08-.26-8.85-.05-17.7-.03-26.55-.03-8.13,0-16.26.16-24.38-.07ZM.01,394.43c0,14.44,0,28.88,0,43.33,0,3.18.33,3.59,2.98,3.59,13.63.01,27.27-.02,40.9.02,2.09,0,2.93-.88,2.93-3.29.04-25,.14-50,.22-75,.03-7.89.04-15.78.13-23.67,0-.44.14-.89.31-1.33.26-.67.98-.92,1.53-.56.35.23.68.48.94.8,2.03,2.52,3.98,5.14,5.96,7.72,11.55,15.12,23.1,30.24,34.63,45.38,12.04,15.81,24.08,31.64,36.05,47.52,1.33,1.77,2.76,2.44,4.75,2.43,13.63-.06,27.27-.04,40.9-.04.52,0,1.06.06,1.57-.05.1-.02.19-.05.29-.09.68-.26.96-1.24.51-1.88,0,0,0,0,0-.01-1.21-1.66-2.47-3.28-3.7-4.92-8.5-11.33-16.98-22.68-25.51-33.98-11.13-14.74-22.32-29.43-33.46-44.17-6.95-9.2-13.82-18.49-20.77-27.69-5.84-7.74-11.76-15.4-17.61-23.13-5.6-7.39-11.19-14.79-16.72-22.23-1.39-1.87-2.44-1.92-3.92-.06-5.56,7.02-11.21,13.97-16.85,20.91-11.38,13.99-22.77,27.98-34.21,41.9C.5,347.61,0,349.34,0,351.55c.05,14.29.02,28.59.02,42.88h-.01Zm239.69,46.9c8.19,0,16.38.02,24.58-.03.33,0,.66-.08.99-.18.65-.21.97-1.02.69-1.72-.16-.4-.34-.78-.58-1.11-1.83-2.53-3.74-4.98-5.61-7.46-12.15-16.1-24.29-32.21-36.46-48.29-11.23-14.84-22.52-29.62-33.74-44.46-7.9-10.44-15.71-20.96-23.61-31.4-11.19-14.78-22.44-29.51-33.64-44.27-8.97-11.82-17.91-23.67-26.87-35.5-1.51-2-4.04-2.05-5.62-.12-8.05,9.87-16.07,19.77-24.16,29.6-1.42,1.73-1.14,2.93.11,4.56,8.89,11.53,17.74,23.1,26.54,34.72,11.23,14.83,22.36,29.77,33.61,44.59,14.54,19.17,29.15,38.26,43.72,57.39,10.54,13.84,21.03,27.74,31.67,41.49.93,1.21,2.78,2.07,4.22,2.11,8.06.2,16.12.1,24.18.1v-.02Z"/>
            </svg>
            <div class="tw-max-w-[120px] tw-text-center tw-text-3xl tw-h-fit">KKBAR</div>
          </a>
          <div class="tw-flex tw-gap-4 tw-text-lg">
            <a href="https://github.com/" aria-label="Github"><i class="bi bi-github"></i></a>
            <a href="https://twitter.com/" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
            <a href="https://www.linkedin.com/" aria-label="Linkedin"><i class="bi bi-linkedin"></i></a>
          </div>
        </div>
        <div class="tw-flex max-md:tw-grid max-md:tw-grid-cols-2 tw-flex-wrap tw-gap-6 tw-h-full tw-w-full tw-justify-around">
          <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4">
            <h2 class="tw-text-xl">资源</h2>
                    <div class="tw-flex tw-flex-col tw-gap-3">
                        <a href="/guides/01-introduction/" class="footer-link">入门指南</a>
                        <a href="/reference/api/" class="footer-link">API 文档</a>
                        <a href="/guides/02-installation/" class="footer-link">安装指南</a>
                        <a href="/guides/03-quickstart/" class="footer-link">快速上手</a>
                        <a href="#pricing" class="footer-link">价格</a>
                    </div>
          </div>
          <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4">
            <h2 class="tw-text-xl">公司</h2>
            <div class="tw-flex tw-flex-col tw-gap-3">
              <a href="javascript:void(0)" class="footer-link">支持渠道</a>
              <a href="javascript:void(0)" class="footer-link">系统</a>
              <a href="javascript:void(0)" class="footer-link">博客</a>
              <a href="https://twitter.com/" class="footer-link">Twitter</a>
              <a href="https://github.com/" class="footer-link">Github</a>
            </div>
          </div>
          <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4">
            <h2 class="tw-text-xl">法律</h2>
            <div class="tw-flex tw-flex-col tw-gap-3">
              <a href="javascript:void(0)" class="footer-link">服务条款</a>
              <a href="javascript:void(0)" class="footer-link">隐私政策</a>
              <a href="javascript:void(0)" class="footer-link">DCMA - 内容下架</a>
            </div>
          </div>
        </div>
      </div>
      <hr class="tw-mt-8" />
      <div class="tw-mt-2 tw-flex tw-gap-2 tw-flex-col tw-text-gray-700 dark:tw-text-gray-300 tw-place-items-center tw-text-[12px] tw-w-full tw-text-center tw-place-content-around">
        <span>Copyright &#169; 2023-2025</span>
        <span>All trademarks and copyrights belong to their respective owners.</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.feature-nav-dots {
  display: none;
}

@media (max-width: 1023px) {
  .feature-nav-dots {
    display: flex;
  }
}

div::-webkit-scrollbar {
  display: none;
}
</style>
