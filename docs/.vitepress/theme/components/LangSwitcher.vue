<template>
  <button class="lang-switcher" @click="toggleLocale" :title="locale === 'zh' ? 'Switch to English' : '切换到中文'">
    {{ locale === 'zh' ? 'EN' : '中' }}
  </button>
</template>

<script setup>
import { useI18n } from '../i18n'

const { locale, toggleLocale } = useI18n()
</script>

<style scoped>
.lang-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
}

.lang-switcher:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
  border-color: var(--vp-c-brand-1);
}
</style>
