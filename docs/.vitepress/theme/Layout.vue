<script setup lang="ts">
import { computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LandingPage from './LandingPage.vue'

const route = useRoute()
const isHome = computed(() => route.path === '/' || route.path === '/index.html')

function replayLogo(e: MouseEvent) {
  const img = e.currentTarget as HTMLImageElement
  const base = img.src.split('?')[0]
  img.src = base + '?v=' + Date.now()
}
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
