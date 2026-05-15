<template>
  <div class="theme-ring" :class="{ 'theme-ring--open': isOpen }">
    <!-- Trigger Button -->
    <button class="theme-ring__trigger" @click="toggleRing" :title="currentTheme.label">
      <i class="bi" :class="currentTheme.icon"></i>
    </button>

    <!-- Ring Menu -->
    <Transition name="ring">
      <div v-if="isOpen" class="theme-ring__menu">
        <div class="theme-ring__bg"></div>
        <button v-for="(theme, i) in themes" :key="theme.id"
          class="theme-ring__item"
          :class="{ 'theme-ring__item--active': currentTheme.id === theme.id }"
          :style="getRingItemStyle(i)"
          @click="selectTheme(theme.id)">
          <i class="bi" :class="theme.icon"></i>
          <span class="theme-ring__label">{{ theme.label }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const themes = [
  { id: 'dark', label: '深色', icon: 'bi-moon-fill' },
  { id: 'light', label: '浅色', icon: 'bi-sun-fill' },
  { id: 'auto', label: '跟随系统', icon: 'bi-circle-half' },
]

const currentTheme = computed(() => {
  return themes.find(t => t.id === props.modelValue) || themes[0]
})

const toggleRing = () => {
  isOpen.value = !isOpen.value
}

const selectTheme = (id) => {
  emit('update:modelValue', id)
  isOpen.value = false
}

const getRingItemStyle = (index) => {
  const total = themes.length
  const angle = (index * 360) / total - 90
  const radius = 70
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius
  return {
    transform: `translate(${x}px, ${y}px)`,
    animationDelay: `${index * 0.05}s`
  }
}

// 点击外部关闭
const handleClickOutside = (e) => {
  if (!e.target.closest('.theme-ring')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.theme-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-ring__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
}

.theme-ring__trigger:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.theme-ring--open .theme-ring__trigger {
  background: rgba(99, 102, 241, 0.3);
  color: #a78bfa;
}

.theme-ring__menu {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  z-index: 9;
}

.theme-ring__bg {
  position: absolute;
  top: -80px;
  left: -80px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(20, 20, 30, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  animation: ringBgIn 0.3s ease;
}

@keyframes ringBgIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.theme-ring__item {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ringItemIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.theme-ring__item:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translate(var(--x), var(--y)) scale(1.15) !important;
}

.theme-ring__item--active {
  background: rgba(99, 102, 241, 0.4);
  color: #a78bfa;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
}

.theme-ring__label {
  font-size: 8px;
  white-space: nowrap;
  pointer-events: none;
}

@keyframes ringItemIn {
  from {
    opacity: 0;
    transform: translate(0, 0) scale(0);
  }
  to {
    opacity: 1;
  }
}

/* Transitions */
.ring-enter-active {
  transition: opacity 0.3s ease;
}

.ring-leave-active {
  transition: opacity 0.2s ease;
}

.ring-enter-from,
.ring-leave-to {
  opacity: 0;
}

/* Light mode */
html:not(.dark) .theme-ring__trigger {
  background: rgba(0, 0, 0, 0.08);
  color: #555;
}

html:not(.dark) .theme-ring__trigger:hover {
  background: rgba(0, 0, 0, 0.12);
}

html:not(.dark) .theme-ring--open .theme-ring__trigger {
  background: rgba(99, 102, 241, 0.15);
  color: #6366f1;
}

html:not(.dark) .theme-ring__bg {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

html:not(.dark) .theme-ring__item {
  background: rgba(0, 0, 0, 0.06);
  color: #555;
}

html:not(.dark) .theme-ring__item:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

html:not(.dark) .theme-ring__item--active {
  background: rgba(99, 102, 241, 0.15);
  color: #6366f1;
}
</style>
