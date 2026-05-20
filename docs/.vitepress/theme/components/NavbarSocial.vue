<template>
  <div class="navbar-social">
    <a v-for="link in links" :key="link.label" 
       :href="link.href" 
       :aria-label="link.label"
       class="navbar-social__link"
       target="_blank" 
       rel="noopener noreferrer"
       @click="link.action ? link.action($event) : null">
      <img v-if="link.icon" :src="link.icon" class="navbar-social__icon" :alt="link.label" />
      <i v-else class="bi" :class="link.biIcon"></i>
    </a>
    
    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="navbar-social__toast">
        邮箱已复制到剪贴板
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showToast = ref(false)

const copyEmail = async (e) => {
  e.preventDefault()
  try {
    await navigator.clipboard.writeText('2655283737@qq.com')
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 2000)
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = '2655283737@qq.com'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 2000)
  }
}

const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/yancongya',
    icon: '/assets/icons/github.svg'
  },
  {
    label: 'Bilibili',
    href: 'https://space.bilibili.com/100881808/',
    icon: '/assets/icons/bilibili.svg'
  },
  {
    label: '小红书',
    href: 'https://xhslink.com/m/9v4RK5HQzsc',
    icon: '/assets/icons/xiaohongshu.svg'
  },
  {
    label: '邮箱',
    href: '#',
    biIcon: 'bi-envelope',
    action: copyEmail
  }
]
</script>

<style scoped>
.navbar-social {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

.navbar-social__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  transition: all 0.25s ease;
  text-decoration: none;
}

.navbar-social__link:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.navbar-social__icon {
  width: 20px;
  height: 20px;
  /* 亮色模式：SVG原本是白色，需要反相为深色 */
  filter: invert(1);
}

/* Toast */
.navbar-social__toast {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Dark mode - SVG是白色，不需要反相 */
:root.dark .navbar-social__icon {
  filter: none;
}
</style>
