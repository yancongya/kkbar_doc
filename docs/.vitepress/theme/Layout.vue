<script setup lang="ts">
import { computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LandingPage from './LandingPage.vue'

const route = useRoute()
const { isDark } = useData()
const isHome = computed(() => route.path === '/' || route.path === '/index.html')

function replayLogo(e: MouseEvent) {
  const img = e.currentTarget as HTMLImageElement
  const base = img.src.split('?')[0]
  img.src = base + '?v=' + Date.now()
}

// 同步 LandingPage 的主题状态到 VitePress
onMounted(() => {
  // 从 localStorage 读取主题设置
  const kkbarDark = localStorage.getItem('kkbar-dark')
  if (kkbarDark !== null) {
    const dark = kkbarDark === 'true'
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  }
})

// 监听 VitePress 主题变化，同步到 localStorage
watch(isDark, (dark) => {
  localStorage.setItem('kkbar-dark', String(dark))
  localStorage.setItem('vitepress-theme-appearance', dark ? 'dark' : 'light')
})
</script>

<template>
  <LandingPage v-if="isHome" />
  <DefaultTheme.Layout v-else>
    <template #nav-bar-title-before>
      <img
        class="logo-svg logo-dark"
        src="/assets/logo/logo_animated.svg"
        alt="logo"
        @mouseenter="replayLogo"
      />
      <img
        class="logo-svg logo-light"
        src="/assets/logo/logo_animated-light.svg"
        alt="logo"
        @mouseenter="replayLogo"
      />
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
.logo-svg {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
</style>
