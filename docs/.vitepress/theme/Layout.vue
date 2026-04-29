<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LandingPage from './LandingPage.vue'

const route = useRoute()
const isHome = computed(() => route.path === '/' || route.path === '/index.html')
</script>

<template>
  <LandingPage v-if="isHome" />
  <DefaultTheme.Layout v-else />
</template>
