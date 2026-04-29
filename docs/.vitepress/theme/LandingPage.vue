<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import CepPreview from './components/CepPreview.vue'

const isDark = ref(true)
const isHeaderCollapsed = ref(true)
const isNavDropdownOpen = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('tw-dark', isDark.value)
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('kkbar-dark', String(isDark.value))
}

const isVideoOpen = ref(false)

function openVideo() {
  isVideoOpen.value = true
}

function closeVideo() {
  isVideoOpen.value = false
}

const featureData: Record<string, { title: string; desc: string }> = {
  jsx: { title: 'JSX 脚本', desc: '执行本地 .jsx/.jsxbin 脚本文件，调用 AE/PS 完整 API，支持 Undo 撤销。' },
  preset: { title: '预设应用', desc: '应用 .prfpset 预设文件到选中图层，支持批量应用和撤销。' },
  clipboard: { title: '剪贴板', desc: '一键复制预设文本到剪贴板，支持代码片段、文件路径、AE 属性引用等。' },
  effect: { title: '效果特效', desc: '快速应用 AE/PS 内置效果到图层，支持效果参数预设。' },
  expression: { title: '表达式', desc: '为属性添加动画表达式，支持代码编辑器和常用表达式模板。' },
  scriptlet: { title: '脚本片段', desc: '直接在配置面板输入代码片段，点击按钮立即执行。' },
  panel: { title: '扩展面板', desc: '打开其他 CEP 扩展面板，快速切换工作区。' },
  menuItem: { title: '菜单命令', desc: '调用 AE/PS 菜单命令，快速执行常用操作。' },
  shell: { title: 'Shell 命令', desc: '执行 PowerShell/CMD 命令，自动化文件系统操作。' },
}

const activeFeature = ref('jsx')

function showFeature(feature: string) {
  activeFeature.value = feature
}

const faqList = [
  { q: '什么是 Kkbar 工具？', a: 'Kkbar 工具是一个集成的 Web 应用，可无缝测试不同的大语言模型，如 GPT4、Claude、Gemini 等。' },
  { q: '什么是大语言模型？', a: 'LLM 代表"大语言模型"。它是一种人工智能模型，经过大量文本数据训练，能够理解和生成类似人类的文本。这些模型，如 GPT-4，可以通过利用训练数据中学到的模式执行各种任务。' },
  { q: '我可以在哪里测试不同的AI模型？', a: '您可以使用 Kkbar 的 AI 工具来测试不同的模型，包括 GPT4、Claude、Perplexity 等。' },
  { q: 'Kkbar 是免费使用的吗？', a: '您可以免费开始使用 Kkbar，然后升级您的计划以访问所有功能。' },
]

const testimonialList = [
  { name: 'Mante', role: 'Glu, cto', img: '/assets/images/people/man2.jpg', text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae, vero. Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam dolore deleniti iusto Numquam!' },
  { name: 'Trich B', role: 'AMI, ceo', img: '/assets/images/people/women.jpg', text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae, vero. Lorem ipsum dolor sit amet.' },
  { name: 'John B', role: 'Benz, ceo', img: '/assets/images/people/man.jpg', text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, expedita nihil repellendus accusamus itaque facere labore.' },
  { name: 'Ben Alfert B', role: 'XZ tech, cto', img: '/assets/images/people/man2.jpg', text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae, vero.' },
  { name: 'Rachel', role: 'Gem, cto', img: '/assets/images/people/women.jpg', text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae, vero. Lorem, ipsum dolor.' },
  { name: 'Jamie', role: 'SnapFist.ai, ceo', img: '/assets/images/people/man.jpg', text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est, nihil vitae fuga ab reiciendis optio et corporis dolorem alias deserunt.' },
]

const articleList = [
  { img: '/assets/images/home/article1.png', cat: '机器学习', date: '2024年7月17日', title: '最新AI工具' },
  { img: '/assets/images/home/article2.jpg', cat: '公告', date: '2024年6月22日', title: 'Kkbar 发布新技术' },
  { img: '/assets/images/home/article3.png', cat: '公告', date: '2024年4月27日', title: '推出 Kkbar 工具' },
]

const additionalFeatures = [
  { img: '/assets/images/home/prompts2.png', title: '提示词库', desc: '无需编写自己的提示词，使用提示词模板，提升工作效率。' },
  { img: '/assets/images/home/search.png', title: '实时网络搜索', desc: '我们的实时网络搜索AI机器人直接在AI聊天 playground 中提供即时、实时的搜索结果。' },
  { img: '/assets/images/home/image.png', title: '图像生成', desc: '立即从多个模型生成图像，从文本描述或模板创建视觉内容。' },
  { img: '/assets/images/home/history.png', title: '历史记录', desc: '所有模型都能记住之前的主题，您可以随时继续对话。' },
  { img: '/assets/images/home/import.png', title: '导入内容', desc: '轻松导入PDF、图像和文档。使用AI提问、提取信息和总结文档。' },
  { img: '/assets/images/home/multilingual.png', title: '多语言支持', desc: 'ChatGPT 和 Gemini 能理解和用超过100种语言回应。' },
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

let gsapInstance: any = null
let scrollTriggerInstance: any = null

onMounted(async () => {
  const savedDark = localStorage.getItem('kkbar-dark')
  if (savedDark === 'false') {
    isDark.value = false
    document.documentElement.classList.remove('tw-dark', 'dark')
  } else {
    document.documentElement.classList.add('tw-dark', 'dark')
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocumentClick)

  await nextTick()

  // Load GSAP dynamically
  try {
    const gsapModule = await import('gsap')
    const stModule = await import('gsap/ScrollTrigger')
    const gsap = gsapModule.default || gsapModule.gsap
    const ScrollTrigger = stModule.ScrollTrigger || stModule.default

    gsap.registerPlugin(ScrollTrigger)
    gsapInstance = gsap
    scrollTriggerInstance = ScrollTrigger

    gsap.to('.reveal-up', { opacity: 0, y: '100%' })

    gsap.fromTo('#dashboard', {
      transform: 'perspective(1200px) rotateX(60deg) scale(0.3)',
      opacity: 0.3,
    }, {
      transform: 'perspective(1200px) rotateX(0deg) scale(1)',
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top 20%',
        end: 'center center',
        scrub: true,
      },
    })

    const sections = gsap.utils.toArray('section')
    sections.forEach((sec: any) => {
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: sec,
          start: '10% 80%',
          end: '20% 90%',
        },
      })
      tl.to(sec.querySelectorAll('.reveal-up'), {
        opacity: 1,
        duration: 0.8,
        y: '0%',
        stagger: 0.2,
      })
    })
  } catch (e) {
    console.warn('GSAP not available, animations disabled:', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocumentClick)
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
        <img src="/assets/logo/logo.png" alt="Kkbar" />
        <span>KKBAR</span>
      </a>

      <!-- Desktop Nav -->
      <nav id="header-nav">
        <a class="header-link" href="/guides/introduction/">文档</a>
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
            <a class="drawer-link" href="/guides/introduction/" @click="isHeaderCollapsed = true">
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
    <section class="hero-section tw-relative tw-mt-20 tw-flex tw-min-h-[100vh] tw-w-full tw-max-w-[100vw] tw-flex-col tw-overflow-hidden max-lg:tw-mt-[100px]" id="hero-section">
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
            <a href="https://developer.adobe.com/photoshop/uxp/2022/" target="_blank" rel="noopener" class="carousel-img tw-h-[30px] tw-w-[100px] tw-no-underline tw-grayscale tw-transition-colors hover:tw-grayscale-0" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/adobe.svg" alt="CEP" class="tw-h-full tw-w-auto tw-object-contain" /><span class="tw-text-xs tw-font-medium">CEP</span>
            </a>
            <a href="https://vuejs.org/" target="_blank" rel="noopener" class="carousel-img tw-h-[30px] tw-w-[100px] tw-no-underline tw-grayscale tw-transition-colors hover:tw-grayscale-0" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/vue.svg" alt="Vue 3" class="tw-h-full tw-w-auto tw-object-contain" /><span class="tw-text-xs tw-font-medium">Vue 3</span>
            </a>
            <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener" class="carousel-img tw-h-[30px] tw-w-[100px] tw-no-underline tw-grayscale tw-transition-colors hover:tw-grayscale-0" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/pinia.svg" alt="Pinia" class="tw-h-full tw-w-auto tw-object-contain" /><span class="tw-text-xs tw-font-medium">Pinia</span>
            </a>
            <a href="https://vitejs.dev/" target="_blank" rel="noopener" class="carousel-img tw-h-[30px] tw-w-[100px] tw-no-underline tw-grayscale tw-transition-colors hover:tw-grayscale-0" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/vite.svg" alt="Vite" class="tw-h-full tw-w-auto tw-object-contain" /><span class="tw-text-xs tw-font-medium">Vite</span>
            </a>
            <a href="https://github.com/hyperbrew/bolt-cep" target="_blank" rel="noopener" class="carousel-img tw-h-[30px] tw-w-[120px] tw-no-underline tw-grayscale tw-transition-colors hover:tw-grayscale-0" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/bolt.svg" alt="Bolt CEP" class="tw-h-full tw-w-auto tw-object-contain" /><span class="tw-text-xs tw-font-medium">Bolt CEP</span>
            </a>
            <a href="https://fontawesome.com" target="_blank" rel="noopener" class="carousel-img tw-h-[30px] tw-w-[130px] tw-no-underline tw-grayscale tw-transition-colors hover:tw-grayscale-0" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/fontawesome.svg" alt="FontAwesome" class="tw-h-full tw-w-auto tw-object-contain" /><span class="tw-text-xs tw-font-medium">FontAwesome</span>
            </a>
            <a href="https://icons.getbootstrap.com" target="_blank" rel="noopener" class="carousel-img tw-h-[30px] tw-w-[130px] tw-no-underline tw-grayscale tw-transition-colors hover:tw-grayscale-0" style="display:inline-flex!important;align-items:center;gap:4px">
              <img src="/assets/images/brand-logos/bootstrap-icons.svg" alt="Bootstrap Icons" class="tw-h-full tw-w-auto tw-object-contain" /><span class="tw-text-xs tw-font-medium">Bootstrap Icons</span>
            </a>
          </template>
        </div>
      </div>
    </section>

    <!-- API Section -->
    <section class="tw-relative tw-flex tw-w-full tw-min-h-[100vh] max-lg:tw-min-h-[80vh] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden">
      <div class="tw-w-full tw-place-content-center tw-items-center tw-flex tw-flex-col tw-max-w-[900px] tw-gap-4 tw-p-4">
        <div class="purple-bg-grad reveal-up tw-absolute tw-right-[20%] tw-top-[20%] tw-h-[200px] tw-w-[200px]"></div>
        <h2 class="reveal-up tw-text-6xl max-lg:tw-text-4xl tw-text-center tw-leading-normal tw-uppercase">
          <span class="tw-font-semibold">基于Kkbar API</span><br />
          <span class="tw-font-serif">构建您自己的AI应用</span>
        </h2>
        <p class="reveal-up tw-mt-8 tw-max-w-[650px] tw-text-gray-900 dark:tw-text-gray-200 tw-text-center max-md:tw-text-sm">
          Kkbar Playground 由 Kkbar 尖端的大语言模型 API 驱动。强大的模型简化任务自动化，提供先进的摘要、文本生成和问答处理能力。
        </p>
        <div class="reveal-up tw-flex tw-mt-8">
          <a href="javascript:void(0)" target="_blank" rel="noopener" class="tw-shadow-md hover:tw-shadow-xl dark:tw-shadow-gray-800 tw-transition-all tw-duration-300 tw-border-[1px] tw-p-3 tw-px-4 tw-border-black dark:tw-border-white tw-rounded-md">查看 Kkbar API</a>
        </div>
      </div>
    </section>

    <!-- Core Features -->
    <section class="tw-relative tw-flex tw-max-w-[100vw] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden">
      <div class="tw-mt-8 tw-flex tw-flex-col tw-w-full tw-h-full tw-place-items-center tw-gap-5">
        <div class="reveal-up tw-mt-5 tw-flex tw-flex-col tw-gap-3 tw-text-center">
          <h2 class="tw-text-6xl tw-font-medium max-md:tw-text-3xl tw-p-2">体验AI的无限可能</h2>
        </div>
        <div class="tw-mt-6 tw-flex tw-flex-col tw-max-w-[1150px] max-lg:tw-max-w-full tw-h-full tw-p-4 max-lg:tw-place-content-center tw-gap-8">
          <div class="max-xl:tw-flex max-xl:tw-flex-col tw-place-items-center tw-grid tw-grid-cols-3 tw-gap-8 tw-place-content-center tw-auto-rows-auto">
            <div class="reveal-up tw-w-[350px] tw-h-[540px] tw-flex max-md:tw-w-full">
              <a href="javascript:void(0)" class="tw-relative tw-p-10 tw-transition-all tw-duration-300 tw-group/card tw-gap-5 tw-flex tw-flex-col tw-w-full tw-h-full tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-rounded-3xl hover:tw-scale-[1.02]">
                <div class="tw-overflow-hidden tw-w-full tw-min-h-[180px] tw-h-[180px]">
                  <img src="/assets/images/home/api.png" class="tw-w-full tw-object-contain tw-h-auto" alt="unified interface" />
                </div>
                <h2 class="tw-text-3xl max-md:tw-text-2xl tw-font-medium">统一接口</h2>
                <p class="tw-text-base tw-leading-normal tw-text-gray-800 dark:tw-text-gray-200">我们是唯一的统一AI接口工具，将您喜爱的所有聊天模型汇集到一个无缝平台。不再需要在不同AI系统之间切换——轻松从一个界面管理和交互多个聊天机器人。</p>
                <div class="tw-flex tw-items-center tw-gap-2 tw-mt-auto"><span>了解更多</span><i class="bi bi-arrow-right tw-transform tw-transition-transform tw-duration-300 group-hover/card:tw-translate-x-2"></i></div>
              </a>
            </div>
            <div class="reveal-up tw-w-[350px] tw-h-[540px] tw-flex max-md:tw-w-full">
              <a href="javascript:void(0)" class="tw-relative tw-p-10 tw-transition-all tw-duration-300 tw-group/card tw-gap-5 tw-flex tw-flex-col tw-w-full tw-h-full tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-rounded-3xl hover:tw-scale-[1.02]">
                <div class="tw-w-full tw-min-h-[180px] tw-h-[180px] tw-overflow-hidden">
                  <img src="/assets/images/home/api.png" alt="API" class="tw-w-full tw-h-auto tw-object-contain" />
                </div>
                <h2 class="tw-text-3xl max-md:tw-text-2xl tw-font-medium">API访问</h2>
                <p class="tw-leading-normal tw-text-gray-800 dark:tw-text-gray-200">Kkbar 的大语言模型API提供先进的摘要、文本生成和问答功能。轻松集成，支持JSON、HTML、Markdown和纯文本，为您的应用增添强大的语言工具。</p>
                <div class="tw-flex tw-items-center tw-gap-2 tw-mt-auto"><span>了解更多</span><i class="bi bi-arrow-right tw-transform tw-transition-transform tw-duration-300 group-hover/card:tw-translate-x-2"></i></div>
              </a>
            </div>
            <div class="reveal-up tw-w-[350px] tw-h-[540px] tw-flex max-md:tw-w-full">
              <a href="javascript:void(0)" class="tw-relative tw-p-10 tw-transition-all tw-duration-300 tw-group/card tw-gap-5 tw-flex tw-flex-col tw-w-full tw-h-full tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-rounded-3xl hover:tw-scale-[1.02]">
                <div class="tw-w-full tw-flex tw-place-contet-center tw-min-h-[180px] tw-h-[180px] tw-rounded-xl tw-overflow-hidden">
                  <img src="/assets/images/home/integrations1.png" class="tw-w-full tw-h-auto tw-object-contain" alt="Prebuilt integrations" />
                </div>
                <h2 class="tw-text-3xl max-md:tw-text-2xl tw-font-medium">预构建工具</h2>
                <p class="tw-leading-normal tw-text-gray-800 dark:tw-text-gray-200">Kkbar 为各种创意任务提供预构建的AI集成，包括图像、视频、音乐和PDF生成，简化高级功能集成到您的应用中。</p>
                <div class="tw-flex tw-items-center tw-gap-2 tw-mt-auto"><span>了解更多</span><i class="bi bi-arrow-right tw-transform tw-transition-transform tw-duration-300 group-hover/card:tw-translate-x-2"></i></div>
              </a>
            </div>
          </div>
          <div class="reveal-up tw-w-full md:tw-h-[350px] max-md:tw-min-h-[350px] tw-flex">
            <a href="javascript:void(0)" class="tw-relative tw-p-10 tw-transition-all tw-duration-300 tw-group/card tw-gap-5 tw-flex max-md:tw-flex-col tw-w-full tw-h-full tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-rounded-3xl hover:tw-scale-[1.02]">
              <div class="tw-text-6xl tw-overflow-hidden tw-rounded-xl tw-w-full tw-h-full max-md:tw-h-[180px]">
                <img src="/assets/images/home/ai-models.png" class="tw-w-full tw-object-contain tw-h-full" alt="AI models" />
              </div>
              <div class="tw-flex tw-flex-col tw-gap-4">
                <h2 class="tw-text-3xl max-md:tw-text-2xl tw-font-medium">多种AI模型</h2>
                <p class="tw-leading-normal tw-text-gray-800 dark:tw-text-gray-200">Kkbar 支持多种AI模型，包括ChatGPT、Gemini、Claude、Mistral等，为各种语言和创意任务提供先进的处理能力。</p>
                <div class="tw-flex tw-items-center tw-gap-2 tw-mt-auto"><span>了解更多</span><i class="bi bi-arrow-right tw-transform tw-transition-transform tw-duration-300 group-hover/card:tw-translate-x-2"></i></div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Nine Button Features -->
    <section class="tw-relative tw-mt-10 tw-flex tw-min-h-[100vh] tw-w-full tw-max-w-[100vw] tw-flex-col tw-place-items-center lg:tw-p-6">
      <div class="reveal-up tw-mt-[5%] tw-flex tw-h-full tw-w-full tw-place-content-center tw-gap-2 tw-p-4 max-lg:tw-max-w-full max-lg:tw-flex-col">
        <div class="tw-relative tw-flex tw-max-w-[30%] max-lg:tw-max-w-full tw-flex-col tw-place-items-start tw-gap-4 tw-p-2 max-lg:tw-place-items-center max-lg:tw-place-content-center max-lg:tw-w-full">
          <div class="tw-top-40 tw-flex tw-flex-col lg:tw-sticky tw-place-items-center tw-max-h-fit tw-max-w-[850px] max-lg:tw-max-h-fit max-lg:tw-max-w-[320px]" id="feature-sticky-header">
            <h2 class="tw-text-5xl tw-font-serif tw-text-center tw-font-medium max-md:tw-text-3xl">九大按钮功能</h2>
            <img :src="'/assets/images/features/' + activeFeature + '.svg'" :alt="activeFeature"
              class="tw-w-full tw-h-[180px] tw-mt-6 tw-object-contain tw-transition-opacity tw-duration-300" />
            <p v-if="featureData[activeFeature]" class="tw-mt-4 tw-text-center tw-text-sm tw-text-gray-500 tw-max-w-[80%]">{{ featureData[activeFeature].desc }}</p>
          </div>
        </div>
        <div id="feature-card-list" class="tw-flex tw-flex-col tw-gap-10 tw-h-full tw-max-w-1/2 max-lg:tw-max-w-full tw-px-[10%] max-lg:tw-px-4 max-lg:tw-gap-3 max-lg:tw-w-full lg:tw-top-[20%] tw-place-items-center">
          <div v-for="(item, key) in featureData" :key="key" class="reveal-up tw-h-[200px] tw-w-[450px] max-md:tw-h-auto max-md:tw-w-full">
            <a href="javascript:void(0)" @click="showFeature(key)" class="tw-flex tw-w-full tw-h-full tw-gap-8 tw-rounded-xl hover:tw-shadow-lg dark:tw-shadow-[#171717] tw-duration-300 tw-transition-all tw-p-8 tw-group/card">
              <div class="tw-text-4xl max-md:tw-text-2xl">
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
              <div class="tw-flex tw-flex-col tw-gap-4">
                <h3 class="tw-text-2xl max-md:tw-text-xl">{{ item.title }}</h3>
                <p class="tw-text-gray-800 dark:tw-text-gray-100 max-md:tw-text-sm">{{ item.desc }}</p>
                <div class="tw-mt-auto tw-flex tw-gap-2 tw-underline tw-underline-offset-4">
                  <span>了解更多</span>
                  <i class="bi bi-arrow-up-right group-hover/card:tw--translate-y-1 group-hover/card:tw-translate-x-1 tw-duration-300 tw-transition-transform"></i>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Additional Features -->
    <section class="tw-relative tw-flex tw-w-full tw-min-h-[auto] tw-py-8 tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden">
      <div class="tw-w-full max-lg:tw-max-w-full tw-place-content-center tw-items-center tw-flex tw-flex-col tw-max-w-[80%] tw-gap-4 tw-p-4">
        <h3 class="reveal-up tw-text-4xl tw-font-medium max-md:tw-text-2xl tw-text-center tw-leading-normal">附加功能</h3>
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

    <!-- Subscription Comparison -->
    <section class="tw-relative tw-flex tw-w-full tw-min-h-[100vh] max-md:tw-min-h-[80vh] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden">
      <div class="tw-w-full max-lg:tw-max-w-full tw-place-content-center tw-place-items-center tw-flex tw-flex-col tw-max-w-[80%] tw-gap-4 tw-p-4">
        <h3 class="reveal-up tw-text-5xl tw-font-medium max-md:tw-text-3xl tw-text-center tw-leading-normal">一个订阅，尽享所有</h3>
        <p class="reveal-up tw-mt-3 tw-max-w-[600px] tw-text-center">为什么为一个订阅支付多个昂贵订阅的费用？访问多种AI模型，每年节省数千美元。</p>
        <div class="tw-mt-8 tw-relative tw-flex max-lg:tw-flex-col tw-gap-5">
          <div class="reveal-up tw-flex tw-w-full tw-max-w-[650px] max-md:tw-max-w-full tw-flex-col tw-place-items-center tw-gap-2 tw-rounded-lg tw-border-[1px] tw-border-outlineColor tw-bg-white dark:tw-bg-[#080808] dark:tw-border-[#1f2123] tw-p-2 tw-shadow-xl max-lg:tw-w-[320px]">
            <img src="/assets/images/home/multi-sub.png" alt="Multi sub" />
          </div>
          <div class="reveal-up tw-flex tw-w-full tw-max-w-[650px] tw-flex-col tw-place-items-center tw-gap-2 tw-rounded-lg tw-border-[1px] tw-border-outlineColor tw-bg-white dark:tw-bg-[#080808] dark:tw-border-[#1f2123] tw-p-2 tw-shadow-xl max-lg:tw-w-[320px]">
            <img src="/assets/images/home/single-sub.jpg" alt="Single sub" />
          </div>
        </div>
        <a href="javascript:void(0)" class="reveal-up tw-group tw-shadow-xl btn tw-flex tw-gap-2 tw-mt-10">
          <span>开始聊天</span><i class="bi bi-arrow-right tw-duration-300 group-hover:tw-translate-x-1"></i>
        </a>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="tw-flex tw-min-h-[100vh] tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-p-[2%]">
      <h3 class="reveal-up tw-text-4xl tw-font-medium tw-text-center max-md:tw-text-2xl">加入使用 Kkbar 的专业人士</h3>
      <div class="tw-mt-20 tw-gap-10 tw-space-y-8 max-md:tw-columns-1 lg:tw-columns-2 xl:tw-columns-3">
        <div v-for="t in testimonialList" :key="t.name" class="reveal-up tw-flex tw-h-fit tw-w-[350px] tw-break-inside-avoid tw-flex-col tw-gap-4 tw-rounded-lg tw-border-[1px] tw-bg-[#f6f7fb] dark:tw-bg-[#080808] dark:tw-border-[#1f2123] tw-p-4 max-lg:tw-w-[320px]">
          <div class="tw-flex tw-place-items-center tw-gap-3">
            <div class="tw-h-[50px] tw-w-[50px] tw-overflow-hidden tw-rounded-full">
              <img :src="t.img" class="tw-h-full tw-w-full tw-object-cover" :alt="t.name" />
            </div>
            <div class="tw-flex tw-flex-col tw-gap-1">
              <div class="tw-font-semibold">{{ t.name }}</div>
              <div class="tw-text-gray-700 dark:tw-text-gray-300">{{ t.role }}</div>
            </div>
          </div>
          <p class="tw-mt-4 tw-text-gray-800 dark:tw-text-gray-200">{{ t.text }}</p>
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

    <!-- Blog -->
    <section class="tw-mt-5 tw-flex tw-min-h-[80vh] tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-p-[2%] max-lg:tw-p-3">
      <h3 class="reveal-up tw-text-4xl tw-font-medium max-md:tw-text-2xl">阅读专家资源</h3>
      <div class="reveal-up tw-mt-10 tw-flex tw-flex-wrap tw-place-content-center tw-gap-10 max-lg:tw-flex-col">
        <a v-for="article in articleList" :key="article.title" href="#" class="tw-flex tw-h-[500px] tw-w-[400px] tw-flex-col tw-gap-2 tw-overflow-clip tw-rounded-lg tw-p-4 max-lg:tw-w-[350px]">
          <div class="tw-h-[350px] tw-min-h-[350px] tw-w-full tw-overflow-hidden tw-rounded-2xl">
            <img :src="article.img" alt="article image" class="tw-h-full tw-w-full tw-object-cover tw-transition-transform tw-duration-700 hover:tw-scale-[1.3]" />
          </div>
          <div class="tw-text-gray-600 dark:tw-text-gray-300 tw-justify-between tw-flex tw-gap-2">
            <div class="tw-text-gray-800 dark:tw-text-gray-200">{{ article.cat }}</div>
            <div class="tw-text-gray-600 dark:tw-text-gray-400">{{ article.date }}</div>
          </div>
          <h3 class="tw-mt-1 tw-font-medium tw-text-xl max-md:tw-text-xl">{{ article.title }}</h3>
        </a>
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

    <!-- CTA -->
    <section class="tw-relative tw-flex tw-p-2 tw-w-full tw-min-h-[60vh] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden">
      <div class="reveal-up tw-w-full tw-h-full tw-min-h-[450px] max-lg:tw-max-w-full tw-rounded-md lg:tw-py-[5%] tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-place-content-center tw-items-center tw-flex tw-flex-col tw-max-w-[80%] tw-gap-4 tw-p-4">
        <h3 class="reveal-up tw-text-5xl tw-font-medium max-md:tw-text-3xl tw-text-center tw-leading-normal">访问和比较多种AI模型</h3>
        <div class="tw-mt-8 tw-relative tw-flex max-lg:tw-flex-col tw-gap-5">
          <a href="javascript:void(0)" class="btn reveal-up !tw-rounded-full !tw-p-4 tw-font-medium">启动工具</a>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="tw-flex tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-gap-[10%] tw-p-[5%] tw-px-[10%] max-md:tw-px-2">
      <div class="tw-flex tw-w-full tw-max-w-[80%] tw-place-content-center tw-place-items-center tw-justify-between tw-gap-3 tw-rounded-lg tw-bg-[#F6F7FB] dark:tw-bg-[#171717] tw-p-6 max-md:tw-max-w-full max-md:tw-flex-col">
        <div class="tw-flex tw-flex-col max-lg:tw-text-center tw-gap-1">
          <h2 class="tw-text-2xl tw-text-gray-800 dark:tw-text-gray-200 max-md:tw-text-xl">加入我们的通讯</h2>
          <div class="tw-text-gray-700 dark:tw-text-gray-300">获取产品见解和更新。</div>
        </div>
        <div class="tw-flex tw-h-[60px] tw-place-items-center tw-gap-2 tw-overflow-hidden tw-p-2">
          <input type="email" class="input tw-h-full tw-w-full !tw-border-gray-600 tw-p-2 tw-outline-none" placeholder="邮箱" />
          <a class="btn !tw-rounded-full !tw-border-[1px] !tw-text-black !tw-border-solid !tw-border-black dark:!tw-text-white dark:!tw-border-gray-300 !tw-bg-transparent tw-transition-colors tw-duration-[0.3s]" href="">注册</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="tw-mt-auto tw-flex tw-flex-col tw-w-full tw-gap-4 tw-text-sm tw-pt-[5%] tw-pb-10 tw-px-[10%] tw-text-black dark:tw-text-white max-md:tw-flex-col">
      <div class="tw-flex max-md:tw-flex-col max-md:tw-gap-6 tw-gap-3 tw-w-full tw-place-content-around">
        <div class="tw-flex tw-h-full tw-w-[250px] tw-flex-col tw-place-items-center tw-gap-6 max-md:tw-w-full">
          <a href="javascript:void(0)" class="tw-w-full tw-place-items-center tw-flex tw-flex-col tw-gap-6">
            <img src="/assets/logo/logo.png" alt="logo" class="tw-max-w-[120px] dark:tw-invert" />
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
                        <a href="/guides/introduction/" class="footer-link">入门指南</a>
                        <a href="/reference/api/" class="footer-link">API 文档</a>
                        <a href="/guides/installation/" class="footer-link">安装指南</a>
                        <a href="/guides/quickstart/" class="footer-link">快速上手</a>
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
