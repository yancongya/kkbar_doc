<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LandingPage from './LandingPage.vue'

const { frontmatter } = useData()
const isHome = frontmatter.value.layout === 'home'
</script>

<template>
  <LandingPage v-if="isHome" />
  <DefaultTheme.Layout v-else />
</template>
