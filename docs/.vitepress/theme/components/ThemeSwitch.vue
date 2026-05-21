<template>
  <div class="theme-switch" @click="switchTheme">
    <button class="theme-switch__btn" :title="isDark ? '切换到浅色' : '切换到深色'">
      <Transition name="icon" mode="out-in">
        <i v-if="isDark" key="sun" class="bi bi-sun-fill"></i>
        <i v-else key="moon" class="bi bi-moon-fill"></i>
      </Transition>
    </button>
    
    <!-- 过渡蒙版 -->
    <Transition name="mask">
      <div v-if="animating" class="theme-switch__mask" :style="maskStyle"></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isDark = computed(() => props.modelValue)
const animating = ref(false)
const maskStyle = ref({})

const switchTheme = (e) => {
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  
  // 计算最大半径（覆盖整个屏幕）
  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )
  
  // 设置蒙版样式
  maskStyle.value = {
    left: x + 'px',
    top: y + 'px',
    width: maxRadius * 2 + 'px',
    height: maxRadius * 2 + 'px',
    marginLeft: -maxRadius + 'px',
    marginTop: -maxRadius + 'px',
    background: isDark.value ? '#f8fafc' : '#000'
  }
  
  // 开始动画
  animating.value = true
  
  // 动画结束后切换主题
  setTimeout(() => {
    emit('update:modelValue', !isDark.value)
    
    setTimeout(() => {
      animating.value = false
    }, 400)
  }, 400)
}
</script>

<style scoped>
.theme-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-switch__btn {
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
  z-index: 1;
}

.theme-switch__btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.theme-switch__btn:active {
  transform: scale(0.95);
}

/* 蒙版 */
.theme-switch__mask {
  position: fixed;
  border-radius: 50%;
  z-index: 100;
  pointer-events: none;
  animation: maskExpand 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes maskExpand {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* 图标切换动画 */
.icon-enter-active,
.icon-leave-active {
  transition: all 0.3s ease;
}

.icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

/* 蒙版动画 */
.mask-enter-active {
  transition: opacity 0.4s ease 0.4s;
}

.mask-leave-active {
  transition: none;
}

.mask-enter-from,
.mask-leave-to {
  opacity: 0;
}

/* 亮色模式 */
html:not(.dark) .theme-switch__btn {
  background: rgba(0, 0, 0, 0.08);
  color: #555;
}

html:not(.dark) .theme-switch__btn:hover {
  background: rgba(0, 0, 0, 0.12);
}
</style>
