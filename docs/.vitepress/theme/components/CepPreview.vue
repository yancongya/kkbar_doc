<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../i18n'

interface ButtonState { icon: string; color: string; label: string }
interface ButtonDef { label: string; icons: Record<string, ButtonState> }
interface Category { name: string; color: string; icon: string; buttons: ButtonDef[] }
interface GuideConfig { icon: string; iconColor: string; title: string; desc: string; hint: string; tags: string[]; preview: string }

const { t, tA } = useI18n()

const hotkeyOrder = ['click', 'ctrl', 'shift', 'alt', 'ctrl+shift', 'ctrl+alt', 'shift+alt', 'ctrl+shift+alt'] as const
const btnKeys = ['common', 'script', 'effect', 'preset'] as const
const catMeta = [
  { color: '#f97316', icon: 'bi-info-circle', key: 'common' as const },
  { color: '#4a9eff', icon: 'bi-file-earmark-code', key: 'script' as const },
  { color: '#22c55e', icon: 'bi-stars', key: 'effect' as const },
  { color: '#a78bfa', icon: 'bi-camera-video', key: 'preset' as const },
]
const btnIconData: Record<string, Record<string, { icon: string; color: string }[]>> = {
  common: [
    [{ icon: 'bi-info-circle', color: '#4a9eff' }, { icon: 'bi-arrow-return-left', color: '#4a9eff' }, { icon: 'bi-arrow-up-circle', color: '#22c55e' }, { icon: 'bi-bullseye', color: '#f97316' }, { icon: 'bi-arrow-up-square', color: '#a78bfa' }, { icon: 'bi-arrow-left-circle', color: '#eab308' }, { icon: 'bi-arrow-right-circle', color: '#ef4444' }, { icon: 'bi-stars', color: '#f97316' }],
    [{ icon: 'bi-funnel', color: '#f97316' }, { icon: 'bi-funnel-fill', color: '#22c55e' }, { icon: 'bi-arrow-down-circle', color: '#ef4444' }, { icon: 'bi-rulers', color: '#94a3b8' }, { icon: 'bi-filter-circle', color: '#4a9eff' }, { icon: 'bi-filter-square', color: '#a78bfa' }, { icon: 'bi-sliders', color: '#eab308' }, { icon: 'bi-sliders2', color: '#f97316' }],
    [{ icon: 'bi-play-fill', color: '#22c55e' }, { icon: 'bi-clipboard', color: '#f97316' }, { icon: 'bi-skip-backward-fill', color: '#4a9eff' }, { icon: 'bi-link-45deg', color: '#4a9eff' }, { icon: 'bi-play-circle-fill', color: '#22c55e' }, { icon: 'bi-pause-fill', color: '#eab308' }, { icon: 'bi-stop-fill', color: '#ef4444' }, { icon: 'bi-record-fill', color: '#ef4444' }],
    [{ icon: 'bi-scissors', color: '#ef4444' }, { icon: 'bi-trash', color: '#ef4444' }, { icon: 'bi-skip-forward-fill', color: '#4a9eff' }, { icon: 'bi-puzzle', color: '#a78bfa' }, { icon: 'bi-scissors2', color: '#f97316' }, { icon: 'bi-trash3-fill', color: '#ef4444' }, { icon: 'bi-x-circle-fill', color: '#94a3b8' }, { icon: 'bi-eraser-fill', color: '#a78bfa' }],
    [{ icon: 'bi-star-fill', color: '#eab308' }, { icon: 'bi-search', color: '#eab308' }, { icon: 'bi-shuffle', color: '#a78bfa' }, { icon: 'bi-lightbulb', color: '#eab308' }, { icon: 'bi-bookmark-fill', color: '#4a9eff' }, { icon: 'bi-heart-fill', color: '#ef4444' }, { icon: 'bi-pin-fill', color: '#f97316' }, { icon: 'bi-trophy-fill', color: '#eab308' }],
    [{ icon: 'bi-gear', color: '#94a3b8' }, { icon: 'bi-lightbulb-fill', color: '#a78bfa' }, { icon: 'bi-pin-angle', color: '#f97316' }, { icon: 'bi-key', color: '#94a3b8' }, { icon: 'bi-gear-fill', color: '#4a9eff' }, { icon: 'bi-toggles', color: '#22c55e' }, { icon: 'bi-wrench-adjustable', color: '#eab308' }, { icon: 'bi-cpu-fill', color: '#a78bfa' }],
  ],
  script: [
    [{ icon: 'bi-file-earmark-code', color: '#4a9eff' }, { icon: 'bi-play-circle', color: '#4a9eff' }, { icon: 'bi-bug', color: '#f97316' }, { icon: 'bi-lightning', color: '#eab308' }, { icon: 'bi-play-circle-fill', color: '#22c55e' }, { icon: 'bi-lightning-fill', color: '#eab308' }, { icon: 'bi-bug-fill', color: '#ef4444' }, { icon: 'bi-rocket-fill', color: '#a78bfa' }],
    [{ icon: 'bi-arrow-repeat', color: '#22c55e' }, { icon: 'bi-stop-fill', color: '#ef4444' }, { icon: 'bi-pencil-square', color: '#4a9eff' }, { icon: 'bi-wrench', color: '#94a3b8' }, { icon: 'bi-arrow-clockwise', color: '#22c55e' }, { icon: 'bi-arrow-counterclockwise', color: '#f97316' }, { icon: 'bi-infinity', color: '#a78bfa' }, { icon: 'bi-recycle', color: '#22c55e' }],
    [{ icon: 'bi-folder2-open', color: '#eab308' }, { icon: 'bi-upload', color: '#22c55e' }, { icon: 'bi-download', color: '#eab308' }, { icon: 'bi-archive', color: '#eab308' }, { icon: 'bi-folder-plus', color: '#4a9eff' }, { icon: 'bi-cloud-upload', color: '#22c55e' }, { icon: 'bi-cloud-download', color: '#4a9eff' }, { icon: 'bi-database-fill-up', color: '#a78bfa' }],
    [{ icon: 'bi-save', color: '#94a3b8' }, { icon: 'bi-lock', color: '#94a3b8' }, { icon: 'bi-clipboard-check', color: '#f97316' }, { icon: 'bi-cloud-upload', color: '#4a9eff' }, { icon: 'bi-save2', color: '#22c55e' }, { icon: 'bi-lock-fill', color: '#ef4444' }, { icon: 'bi-floppy2-fill', color: '#eab308' }, { icon: 'bi-safe-fill', color: '#a78bfa' }],
  ],
  effect: [
    [{ icon: 'bi-stars', color: '#eab308' }, { icon: 'bi-brightness-high', color: '#eab308' }, { icon: 'bi-star', color: '#4a9eff' }, { icon: 'bi-mask', color: '#a78bfa' }, { icon: 'bi-brightness-high-fill', color: '#f97316' }, { icon: 'bi-sun', color: '#eab308' }, { icon: 'bi-moon-stars', color: '#4a9eff' }, { icon: 'bi-magic', color: '#a78bfa' }],
    [{ icon: 'bi-circle', color: '#4a9eff' }, { icon: 'bi-rainbow', color: '#f97316' }, { icon: 'bi-water', color: '#22c55e' }, { icon: 'bi-eye', color: '#f97316' }, { icon: 'bi-circle-half', color: '#94a3b8' }, { icon: 'bi-eye-slash', color: '#94a3b8' }, { icon: 'bi-droplet-half', color: '#4a9eff' }, { icon: 'bi-cloud-fog2', color: '#a78bfa' }],
    [{ icon: 'bi-palette', color: '#f97316' }, { icon: 'bi-square', color: '#94a3b8' }, { icon: 'bi-brush', color: '#f97316' }, { icon: 'bi-film', color: '#4a9eff' }, { icon: 'bi-palette2', color: '#a78bfa' }, { icon: 'bi-paint-bucket', color: '#eab308' }, { icon: 'bi-brush-fill', color: '#22c55e' }, { icon: 'bi-eyedropper', color: '#ef4444' }],
    [{ icon: 'bi-square-fill', color: '#94a3b8' }, { icon: 'bi-app', color: '#94a3b8' }, { icon: 'bi-diamond', color: '#4a9eff' }, { icon: 'bi-hexagon', color: '#eab308' }, { icon: 'bi-square-half', color: '#a78bfa' }, { icon: 'bi-pentagon', color: '#22c55e' }, { icon: 'bi-octagon', color: '#f97316' }, { icon: 'bi-intersect', color: '#ef4444' }],
    [{ icon: 'bi-triangle', color: '#22c55e' }, { icon: 'bi-rulers', color: '#94a3b8' }, { icon: 'bi-arrow-clockwise', color: '#22c55e' }, { icon: 'bi-arrows-expand', color: '#4a9eff' }, { icon: 'bi-arrows-angle-expand', color: '#f97316' }, { icon: 'bi-arrows-fullscreen', color: '#a78bfa' }, { icon: 'bi-bounding-box', color: '#eab308' }, { icon: 'bi-bounding-box-circles', color: '#22c55e' }],
  ],
  preset: [
    [{ icon: 'bi-camera-video', color: '#a78bfa' }, { icon: 'bi-box-seam', color: '#a78bfa' }, { icon: 'bi-film', color: '#4a9eff' }, { icon: 'bi-folder', color: '#eab308' }, { icon: 'bi-camera-video-fill', color: '#ef4444' }, { icon: 'bi-collection-play', color: '#22c55e' }, { icon: 'bi-camera-reels', color: '#f97316' }, { icon: 'bi-camera-reels-fill', color: '#a78bfa' }],
    [{ icon: 'bi-fonts', color: '#4a9eff' }, { icon: 'bi-arrow-repeat', color: '#94a3b8' }, { icon: 'bi-pencil', color: '#4a9eff' }, { icon: 'bi-plus-circle', color: '#22c55e' }, { icon: 'bi-type-bold', color: '#eab308' }, { icon: 'bi-type-italic', color: '#f97316' }, { icon: 'bi-type-underline', color: '#a78bfa' }, { icon: 'bi-type-h1', color: '#4a9eff' }],
    [{ icon: 'bi-water', color: '#22c55e' }, { icon: 'bi-fast-forward', color: '#22c55e' }, { icon: 'bi-shuffle', color: '#a78bfa' }, { icon: 'bi-music-note', color: '#f97316' }, { icon: 'bi-fast-forward-fill', color: '#4a9eff' }, { icon: 'bi-rewind-fill', color: '#eab308' }, { icon: 'bi-music-note-beamed', color: '#a78bfa' }, { icon: 'bi-soundwave', color: '#22c55e' }],
  ],
}

const categories = computed<Category[]>(() => {
  const catNames = tA('cepPreview.cat')
  return catMeta.map((meta, ci) => {
    const btnLabels = tA(`cepPreview.btn.${meta.key}`)
    const icons = btnIconData[meta.key]
    return {
      name: catNames[ci],
      color: meta.color,
      icon: meta.icon,
      buttons: btnLabels.map((btnRow: any, ri: number) => {
        const rowLabels: string[] = Array.isArray(btnRow) ? btnRow : [String(btnRow)]
        const iconRow = icons ? icons[ri] : []
        const iconsRecord: Record<string, ButtonState> = {}
        hotkeyOrder.forEach((hk, hi) => {
          const label = rowLabels[hi + 1] ?? rowLabels[0]
          const iconData = iconRow ? iconRow[hi] || iconRow[0] : { icon: 'bi-circle', color: '#888' }
          iconsRecord[hk] = { icon: iconData.icon, color: iconData.color, label }
        })
        return {
          label: rowLabels[0] || '',
          icons: iconsRecord,
        }
      }),
    }
  })
})

const guideConfig = computed<Record<string, GuideConfig>>(() => ({
  panel: {
    icon: 'bi-grid-3x3-gap', iconColor: '#a78bfa', title: t('cepPreview.guide.panel.title'),
    desc: t('cepPreview.guide.panel.desc'), hint: t('cepPreview.guide.panel.hint'), tags: tA('cepPreview.guide.panel.tags'),
    preview: `<div class="cep-guide__preview-btns"><span class="cep-guide__preview-btn" style="background:#2d2d2d;border-color:#a78bfa"><i class="bi bi-play-fill" style="color:#22c55e"></i></span><span class="cep-guide__preview-btn"><i class="bi bi-scissors" style="color:#ef4444"></i></span><span class="cep-guide__preview-btn"><i class="bi bi-star-fill" style="color:#eab308"></i></span><span class="cep-guide__preview-btn"><i class="bi bi-gear" style="color:#94a3b8"></i></span></div>`,
  },
  hotkey: {
    icon: 'bi-keyboard', iconColor: '#4a9eff', title: t('cepPreview.guide.hotkey.title'),
    desc: t('cepPreview.guide.hotkey.desc'), hint: t('cepPreview.guide.hotkey.hint'), tags: tA('cepPreview.guide.hotkey.tags'),
    preview: `<div class="cep-guide__hotkey-demo"><div class="cep-guide__hotkey-row"><span class="cep-guide__hk-key">${t('cepPreview.hotkeyLabels.click')}</span><span class="cep-guide__hk-arrow">→</span><span class="cep-guide__preview-btn"><i class="bi bi-play-fill" style="color:#22c55e"></i></span></div><div class="cep-guide__hotkey-row"><span class="cep-guide__hk-key cep-guide__hk-key--active">Ctrl</span><span class="cep-guide__hk-arrow">→</span><span class="cep-guide__preview-btn"><i class="bi bi-clipboard" style="color:#f97316"></i></span></div><div class="cep-guide__hotkey-row"><span class="cep-guide__hk-key cep-guide__hk-key--shift">Shift</span><span class="cep-guide__hk-arrow">→</span><span class="cep-guide__preview-btn"><i class="bi bi-skip-backward-fill" style="color:#4a9eff"></i></span></div></div>`,
  },
  longpress: {
    icon: 'bi-hand-index-thumb', iconColor: '#f97316', title: t('cepPreview.guide.longpress.title'),
    desc: t('cepPreview.guide.longpress.desc'), hint: t('cepPreview.guide.longpress.hint'), tags: tA('cepPreview.guide.longpress.tags'),
    preview: `<div class="cep-guide__longpress-demo"><div class="cep-guide__lp-modes"><div class="cep-guide__lp-mode cep-guide__lp-mode--active"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg><span>${t('cepPreview.longpress.popup')}</span></div><div class="cep-guide__lp-mode"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg><span>${t('cepPreview.longpress.ring')}</span></div></div></div>`,
  },
  uisettings: {
    icon: 'bi-sliders', iconColor: '#22c55e', title: t('cepPreview.guide.uisettings.title'),
    desc: t('cepPreview.guide.uisettings.desc'), hint: t('cepPreview.guide.uisettings.hint'), tags: tA('cepPreview.guide.uisettings.tags'),
    preview: `<div class="cep-guide__ui-demo"><div class="cep-guide__ui-row"><span class="cep-guide__ui-label">${t('cepPreview.ui.size')}</span><div class="cep-guide__ui-track"><div class="cep-guide__ui-fill" style="width:60%"></div></div><span class="cep-guide__ui-val">52</span></div><div class="cep-guide__ui-row"><span class="cep-guide__ui-label">${t('cepPreview.ui.spacing')}</span><div class="cep-guide__ui-track"><div class="cep-guide__ui-fill" style="width:30%"></div></div><span class="cep-guide__ui-val">6</span></div><div class="cep-guide__ui-row"><span class="cep-guide__ui-label">${t('cepPreview.ui.viewMode')}</span><div class="cep-guide__ui-btns"><span class="cep-guide__ui-btn cep-guide__ui-btn--active"><i class="bi bi-grid-3x3-gap"></i></span><span class="cep-guide__ui-btn"><i class="bi bi-view-list"></i></span></div></div></div>`,
  },
}))

const activeCatIdx = ref(0)
const activeHotkeys = reactive(new Set<string>())
const isDropdownOpen = ref(false)
const currentCat = computed(() => categories.value[activeCatIdx.value] ?? { icon: '', color: '', name: '', buttons: [] } as Category)

const sidebarState = ref<'expanded' | 'icon-only' | 'collapsed'>('expanded')
const mode = ref<'panel' | 'hotkey' | 'longpress' | 'uisettings'>('panel')
const longpressType = ref<'popup' | 'ring'>('popup')
const showAbout = ref(false)
const popupVisible = ref(false)
const ringVisible = ref(false)

const uiSettings = reactive({ iconSize: 52, iconSpacing: 6, showToolbar: true, viewMode: 'grid' as 'grid' | 'list' })

const guideDismissed = reactive(new Set<string>())
const activeGuide = ref<string | null>(null)

const hotkeyKey = computed(() => {
  if (activeHotkeys.size === 0) return 'click'
  return [...activeHotkeys].sort().join('+')
})

const hotkeyLabel = computed(() => {
  const map: Record<string, { text: string; color: string }> = {
    click: { text: t('cepPreview.hotkeyLabels.click'), color: '#888' },
    ctrl: { text: t('cepPreview.hotkeyLabels.ctrl'), color: '#4a9eff' },
    shift: { text: t('cepPreview.hotkeyLabels.shift'), color: '#22c55e' },
    alt: { text: t('cepPreview.hotkeyLabels.alt'), color: '#f97316' },
    'ctrl+shift': { text: t('cepPreview.hotkeyLabels.ctrlShift'), color: '#a78bfa' },
    'ctrl+alt': { text: t('cepPreview.hotkeyLabels.ctrlAlt'), color: '#eab308' },
    'shift+alt': { text: t('cepPreview.hotkeyLabels.shiftAlt'), color: '#ef4444' },
    'ctrl+shift+alt': { text: t('cepPreview.hotkeyLabels.ctrlShiftAlt'), color: '#f97316' },
  }
  return map[hotkeyKey.value] || { text: hotkeyKey.value, color: '#888' }
})

function getButtonState(btn: ButtonDef) {
  const hk = hotkeyKey.value
  return btn.icons[hk]
    || (activeHotkeys.size > 0 ? btn.icons[[...activeHotkeys].sort()[0]] : null)
    || btn.icons.click
}

function getButtonLabel(btn: ButtonDef) {
  return getButtonState(btn).label || btn.label
}

function selectCategory(idx: number) {
  activeCatIdx.value = idx
  isDropdownOpen.value = false
}

function toggleHotkey(key: string) {
  if (activeHotkeys.has(key)) activeHotkeys.delete(key)
  else activeHotkeys.add(key)
}

// Sidebar
function cycleSidebar() {
  const states: typeof sidebarState.value[] = ['expanded', 'icon-only', 'collapsed']
  const idx = states.indexOf(sidebarState.value)
  sidebarState.value = states[(idx + 1) % states.length]
}

// Mode
function setMode(m: typeof mode.value) {
  mode.value = m
  activeHotkeys.clear()
  if (!guideDismissed.has(m)) {
    activeGuide.value = m
  }
}

function ringItemStyle(i: number) {
  const cx = ringRect.width / 2
  const cy = ringRect.height / 2
  const angle = (2 * Math.PI * i) / ringActions.value.length - Math.PI / 2
  return {
    left: (cx + RING_RADIUS * Math.cos(angle)) + 'px',
    top: (cy + RING_RADIUS * Math.sin(angle)) + 'px',
  }
}

function closePopup() { popupVisible.value = false }
function closeRing() { ringVisible.value = false }
function dismissGuide() {
  if (activeGuide.value) guideDismissed.add(activeGuide.value)
  activeGuide.value = null
}

// Keyboard
function onKeyDown(e: KeyboardEvent) {
  if (mode.value !== 'hotkey') return
  const map: Record<string, string> = { Control: 'ctrl', Shift: 'shift', Alt: 'alt' }
  const key = map[e.key]
  if (key && !activeHotkeys.has(key)) activeHotkeys.add(key)
}
function onKeyUp(e: KeyboardEvent) {
  if (mode.value !== 'hotkey') return
  const map: Record<string, string> = { Control: 'ctrl', Shift: 'shift', Alt: 'alt' }
  const key = map[e.key]
  if (key) activeHotkeys.delete(key)
}

// Resizer drag
const isDragging = ref(false)
const sidebarEl = ref<HTMLElement | null>(null)
const mainEl = ref<HTMLElement | null>(null)

function onResizerMouseDown(e: MouseEvent) {
  isDragging.value = true
  e.preventDefault()
}
function onMouseMove(e: MouseEvent) {
  if (!isDragging.value || !sidebarEl.value) return
  const newWidth = e.clientX - sidebarEl.value.getBoundingClientRect().left
  if (newWidth < 60) sidebarState.value = 'collapsed'
  else if (newWidth < 120) { sidebarState.value = 'icon-only'; sidebarEl.value.style.width = '50px' }
  else { sidebarState.value = 'expanded'; sidebarEl.value.style.width = Math.min(Math.max(newWidth, 180), 300) + 'px' }
}
function onMouseUp() { isDragging.value = false }

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  activeGuide.value = 'panel'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <div class="cep-preview" :class="{ 'cep-preview--sidebar-icon-only': sidebarState === 'icon-only', 'cep-preview--sidebar-collapsed': sidebarState === 'collapsed' }">
    <!-- Sidebar -->
    <div class="cep-preview__sidebar" ref="sidebarEl">
      <div class="cep-preview__sidebar-title">
        <i class="bi bi-layers"></i>
        <span>{{ t('cepPreview.sidebar.title') }}</span>
      </div>
      <ul class="cep-preview__panel-list">
        <li v-for="m in (['panel','hotkey','longpress','uisettings'] as const)" :key="m"
          class="cep-preview__panel-item" :class="{ 'cep-sidebar-item--active': mode === m }"
          @click="setMode(m)">
          <i class="bi" :class="{ 'bi-grid-3x3-gap': m==='panel', 'bi-keyboard': m==='hotkey', 'bi-hand-index-thumb': m==='longpress', 'bi-sliders': m==='uisettings' }"></i>
          <div class="cep-preview__panel-item-info">
            <span class="cep-preview__panel-item-name">{{ { panel: t('cepPreview.sidebar.panel'), hotkey: t('cepPreview.sidebar.hotkey'), longpress: t('cepPreview.sidebar.longpress'), uisettings: t('cepPreview.sidebar.uisettings') }[m] }}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Resizer -->
    <div class="cep-preview__resizer" @mousedown="onResizerMouseDown"></div>

    <!-- Main -->
    <div class="cep-preview__main" ref="mainEl">
      <div class="cep-preview__window-bar">
        <button class="cep-preview__collapse-btn" @click="cycleSidebar" :title="sidebarState === 'collapsed' ? t('cepPreview.window.collapseExpand') : t('cepPreview.window.collapseCollapse')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path :d="sidebarState === 'collapsed' ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'" />
          </svg>
        </button>
        <span class="cep-preview__window-title">{{ t('cepPreview.window.title') }}</span>
        <div class="cep-preview__window-controls">
          <span class="cep-preview__wc cep-preview__wc--min"></span>
          <span class="cep-preview__wc cep-preview__wc--max"></span>
          <span class="cep-preview__wc cep-preview__wc--close"></span>
        </div>
      </div>

      <div class="cep-preview__panel-wrap">
        <div class="cep-main-panel" v-if="categories.length">
          <!-- Toolbar -->
          <div class="cep-main-panel__toolbar" v-show="uiSettings.showToolbar">
            <div class="cep-cat-wrap">
              <button class="cep-main-panel__cat-select" @click="isDropdownOpen = !isDropdownOpen" type="button">
                <i class="bi" :class="currentCat.icon" :style="{ color: currentCat.color, fontSize: '14px' }"></i>
                <span class="cep-main-panel__cat-label">{{ currentCat.name }}</span>
                <svg class="cep-main-panel__cat-arrow" :style="{ transform: isDropdownOpen ? 'rotate(180deg)' : '' }" width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M8 11L3 6h10z"/></svg>
              </button>
              <ul class="cep-cat-dropdown" :class="{ 'cep-cat-dropdown--open': isDropdownOpen }">
                <li v-for="(cat, i) in categories" :key="cat.name" class="cep-cat-dropdown__item" :class="{ 'cep-cat-dropdown__item--active': i === activeCatIdx }" @click="selectCategory(i)">
                  <i class="bi" :class="cat.icon" :style="{ color: cat.color, fontSize: '12px' }"></i>
                  <span>{{ cat.name }}</span>
                </li>
              </ul>
            </div>
            <div class="cep-main-panel__toolbar-icons">
              <button class="cep-main-panel__icon-btn" :title="t('cepPreview.toolbar.log')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </button>
              <button class="cep-main-panel__icon-btn" :class="{ 'cep-main-panel__icon-btn--active': uiSettings.viewMode === 'list' }" @click="uiSettings.viewMode = uiSettings.viewMode === 'grid' ? 'list' : 'grid'" :title="uiSettings.viewMode === 'grid' ? t('cepPreview.toolbar.switchList') : t('cepPreview.toolbar.switchGrid')">
                <svg v-if="uiSettings.viewMode === 'grid'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button class="cep-main-panel__icon-btn" @click="showAbout = !showAbout" :title="t('cepPreview.toolbar.about')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </button>
              <button class="cep-main-panel__icon-btn" :title="t('cepPreview.toolbar.settings')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
            </div>
          </div>

          <!-- Button Grid -->
          <div class="cep-main-panel__grid" :class="{ 'cep-main-panel__grid--list': uiSettings.viewMode === 'list' }" :style="{ gap: uiSettings.iconSpacing + 'px' }">
            <!-- Category button (first) -->
            <div class="cep-main-panel__btn cep-main-panel__btn--category" :title="t('cepPreview.catSwitch')"
              :style="{ width: uiSettings.iconSize + 'px', height: uiSettings.iconSize + 'px' }"
              @mousedown="startLongpress($el as HTMLElement, true)"
              @mouseup="cancelLongpress(); ($el as HTMLElement).style.background = ''"
              @mouseleave="cancelLongpress()"
              @touchstart.passive="startLongpress($el as HTMLElement, true)"
              @touchend.passive="cancelLongpress(); ($el as HTMLElement).style.background = ''"
              @touchcancel.passive="cancelLongpress()"
              @click="selectCategory((activeCatIdx + 1) % categories.length)">
              <div class="cep-main-panel__btn-icon">
                <i class="bi" :class="currentCat.icon" :style="{ color: currentCat.color, fontSize: '20px' }"></i>
                <span class="cep-category-indicator" :style="{ background: currentCat.color }"></span>
              </div>
              <span class="cep-main-panel__btn-label">{{ currentCat.name }}</span>
            </div>
            <!-- Normal buttons -->
            <div v-for="(btn, idx) in currentCat.buttons" :key="btn.label" class="cep-main-panel__btn" :title="getButtonLabel(btn)"
              :style="{ width: uiSettings.iconSize + 'px', height: uiSettings.iconSize + 'px' }"
              @mousedown="($el as HTMLElement).style.background = '#3b3b6e'; ($el as HTMLElement).style.borderColor = '#4b4b7e'; startLongpress($el as HTMLElement, false, idx)"
              @mouseup="($el as HTMLElement).style.background = ''; ($el as HTMLElement).style.borderColor = ''; cancelLongpress()"
              @mouseleave="($el as HTMLElement).style.background = ''; ($el as HTMLElement).style.borderColor = ''; cancelLongpress()"
              @touchstart.passive="($el as HTMLElement).style.background = '#3b3b6e'; ($el as HTMLElement).style.borderColor = '#4b4b7e'; startLongpress($el as HTMLElement, false, idx)"
              @touchend.passive="($el as HTMLElement).style.background = ''; ($el as HTMLElement).style.borderColor = ''; cancelLongpress()"
              @touchcancel.passive="($el as HTMLElement).style.background = ''; ($el as HTMLElement).style.borderColor = ''; cancelLongpress()">
              <div class="cep-main-panel__btn-icon">
                <i class="bi" :class="getButtonState(btn).icon" :style="{ color: getButtonState(btn).color, fontSize: '20px' }"></i>
              </div>
              <span class="cep-main-panel__btn-label">{{ getButtonLabel(btn) }}</span>
            </div>
          </div>

          <!-- Hotkey Bar -->
          <div class="cep-hotkey-bar" :class="{ 'cep-hotkey-bar--visible': mode === 'hotkey' }">
            <div class="cep-hotkey-bar__keys">
              <button v-for="key in ['ctrl', 'shift', 'alt']" :key="key" class="cep-hotkey-key" :class="{ 'cep-hotkey-key--active': activeHotkeys.has(key) }" @click="toggleHotkey(key)" type="button">
                {{ key.toUpperCase() }}
              </button>
            </div>
            <div class="cep-hotkey-bar__combo">
              <span class="cep-hotkey-combo__label" :style="{ color: hotkeyLabel.color }">{{ hotkeyLabel.text }}</span>
            </div>
          </div>

          <!-- Longpress Bar -->
          <div class="cep-longpress-bar" :class="{ 'cep-longpress-bar--visible': mode === 'longpress' }">
            <button class="cep-longpress-mode" :class="{ 'cep-longpress-mode--active': longpressType === 'popup' }" @click="longpressType = 'popup'" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              <span>{{ t('cepPreview.longpress.popup') }}</span>
            </button>
            <button class="cep-longpress-mode" :class="{ 'cep-longpress-mode--active': longpressType === 'ring' }" @click="longpressType = 'ring'" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>
              <span>{{ t('cepPreview.longpress.ring') }}</span>
            </button>
          </div>

          <!-- UI Settings Bar -->
          <div class="cep-ui-settings-bar" :class="{ 'cep-ui-settings-bar--visible': mode === 'uisettings' }">
            <div class="cep-ui-setting">
              <span class="cep-ui-setting__label">{{ t('cepPreview.ui.size') }}</span>
              <input type="range" class="cep-ui-setting__slider" v-model.number="uiSettings.iconSize" min="30" max="70" step="2" />
              <span class="cep-ui-setting__value">{{ uiSettings.iconSize }}</span>
            </div>
            <div class="cep-ui-setting">
              <span class="cep-ui-setting__label">{{ t('cepPreview.ui.spacing') }}</span>
              <input type="range" class="cep-ui-setting__slider" v-model.number="uiSettings.iconSpacing" min="0" max="20" step="1" />
              <span class="cep-ui-setting__value">{{ uiSettings.iconSpacing }}</span>
            </div>
            <div class="cep-ui-toolbar-toggle">
              <span class="cep-ui-setting__label">{{ t('cepPreview.ui.toolbar') }}</span>
              <div class="cep-ui-toolbar-group">
                <button class="cep-ui-toolbar-btn" :class="{ 'cep-ui-toolbar-btn--active': uiSettings.showToolbar }" @click="uiSettings.showToolbar = true" type="button">{{ t('cepPreview.ui.show') }}</button>
                <button class="cep-ui-toolbar-btn" :class="{ 'cep-ui-toolbar-btn--active': !uiSettings.showToolbar }" @click="uiSettings.showToolbar = false" type="button">{{ t('cepPreview.ui.hide') }}</button>
              </div>
            </div>
            <div class="cep-ui-toolbar-toggle">
              <span class="cep-ui-setting__label">{{ t('cepPreview.ui.viewMode') }}</span>
              <div class="cep-ui-toolbar-group">
                <button class="cep-ui-toolbar-btn" :class="{ 'cep-ui-toolbar-btn--active': uiSettings.viewMode === 'grid' }" @click="uiSettings.viewMode = 'grid'" type="button"><i class="bi bi-grid-3x3-gap"></i> {{ t('cepPreview.ui.grid') }}</button>
                <button class="cep-ui-toolbar-btn" :class="{ 'cep-ui-toolbar-btn--active': uiSettings.viewMode === 'list' }" @click="uiSettings.viewMode = 'list'" type="button"><i class="bi bi-view-list"></i> {{ t('cepPreview.ui.list') }}</button>
              </div>
            </div>
</div>
          </div>
        </div>

        <!-- Guide Overlay -->
      <Transition name="guide-fade">
        <div v-if="activeGuide && guideConfig[activeGuide]" class="cep-guide-overlay cep-guide-overlay--visible" @click="dismissGuide">
          <div class="cep-guide-card" @click.stop>
            <div class="cep-guide-card__header">
              <div class="cep-guide-card__icon-wrap">
                <i class="bi" :class="guideConfig[activeGuide].icon" :style="{ color: guideConfig[activeGuide].iconColor }"></i>
              </div>
              <div class="cep-guide-card__title-group">
                <h3 class="cep-guide-card__title">{{ guideConfig[activeGuide].title }}</h3>
                <div class="cep-guide-card__tags">
                  <span v-for="tag in guideConfig[activeGuide].tags" :key="tag" class="cep-guide-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
            <p class="cep-guide-card__desc">{{ guideConfig[activeGuide].desc }}</p>
            <div class="cep-guide-card__preview" v-html="guideConfig[activeGuide].preview"></div>
            <button class="cep-guide-card__cta" type="button" @click="dismissGuide">
              <i class="bi bi-cursor-fill"></i>
              <span>{{ guideConfig[activeGuide].hint }}</span>
            </button>
          </div>
          <div class="cep-guide-pulse" :style="{ borderColor: guideConfig[activeGuide].iconColor }"></div>
        </div>
      </Transition>

      <!-- Popup Overlay -->
      <Teleport to="body">
        <Transition name="guide-fade">
          <div v-if="popupVisible" class="cep-popup-overlay cep-popup-overlay--visible" @mouseup="closePopup" @touchend.passive="closePopup">
            <div class="cep-popup-panel" @mouseup.stop @touchend.stop.passive>
              <button v-for="(a, i) in popupActions" :key="a.id" class="cep-popup-item" :class="{ 'cep-popup-item--active': popupHoveredIdx === i }" @mouseenter="popupHoveredIdx = i" @mouseup="closePopup" @touchend.passive="closePopup">
                <span class="cep-popup-item__icon"><i class="bi" :class="a.icon" :style="{ color: a.color }"></i></span>
                <span class="cep-popup-item__content">
                  <span class="cep-popup-item__label">{{ a.label }}</span>
                  <span class="cep-popup-item__hotkey">{{ a.hotkey }}</span>
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Ring Overlay -->
      <Teleport to="body">
        <Transition name="guide-fade">
          <div v-if="ringVisible" class="cep-ring-overlay cep-ring-overlay--visible"
            :style="{ left: ringRect.left + 'px', top: ringRect.top + 'px', width: ringRect.width + 'px', height: ringRect.height + 'px' }"
            @mouseup="closeRing" @mousemove="onRingMouseMove">
            <div class="cep-ring-bg" :style="{ left: ringRect.width / 2 + 'px', top: ringRect.height / 2 + 'px' }"></div>
            <div class="cep-ring-hint" :style="{ left: ringRect.width / 2 + 'px', top: ringRect.height / 2 + 'px' }">
              <span v-if="ringHintHotkey" class="cep-ring-hint__hk">{{ ringHintHotkey }}</span>
              <span class="cep-ring-hint__label">{{ ringHintLabel }}</span>
            </div>
            <div v-for="(a, i) in ringActions" :key="a.id" class="cep-ring-item"
              :class="{ 'cep-ring-item--hover': ringHoveredIdx === i }"
              :style="ringItemStyle(i)">
              <i class="bi" :class="a.icon" :style="{ color: a.color, fontSize: '18px' }"></i>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- About Dialog -->
      <Teleport to="body">
        <Transition name="guide-fade">
          <div v-if="showAbout" class="cep-about-overlay" @click="showAbout = false">
            <div class="cep-about-dialog" @click.stop>
              <div class="cep-about-header">
                <div class="cep-about-logo">
                  <span class="cep-about-logo__text">K</span>
                </div>
                <div class="cep-about-title">
                  <h2>KKBAR</h2>
                  <span class="cep-about-subtitle">CEP toolbar for After Effects</span>
                </div>
              </div>
              <div class="cep-about-body">
                <div class="cep-about-info">
                  <div class="cep-about-row">
                    <span class="cep-about-label">{{ t('cepPreview.about.version') }}</span>
                    <span class="cep-about-value">1.0.0</span>
                  </div>
                  <div class="cep-about-row">
                    <span class="cep-about-label">{{ t('cepPreview.about.author') }}</span>
                    <span class="cep-about-value">烟囱鸭</span>
                  </div>
                  <div class="cep-about-row">
                    <span class="cep-about-label">{{ t('cepPreview.about.stack') }}</span>
                    <span class="cep-about-value">CEP + Vue 3 + Pinia + Vite</span>
                  </div>
                </div>
                <div class="cep-about-desc">
                  <p>{{ t('cepPreview.about.desc') }}</p>
                </div>
                <div class="cep-about-links">
                  <a href="https://github.com/yancongya" target="_blank" rel="noreferrer" class="cep-about-link">
                    <i class="bi bi-github"></i> GitHub
                  </a>
                  <a href="https://space.bilibili.com/100881808/" target="_blank" rel="noreferrer" class="cep-about-link">
                    <i class="bi bi-play-btn"></i> Bilibili
                  </a>
                  <a href="https://xhslink.com/m/9v4RK5HQzsc" target="_blank" rel="noreferrer" class="cep-about-link">
                    <i class="bi bi-chat-heart"></i> 小红书
                  </a>
                </div>
              </div>
              <button class="cep-about-close" @click="showAbout = false" type="button">
                <span>{{ t('cepPreview.about.close') }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
.guide-fade-enter-active,
.guide-fade-leave-active {
  transition: opacity 0.25s ease;
}
.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
}

/* Window action buttons */
.cep-preview__window-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  margin-right: 8px;
}

.cep-preview__action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
}

.cep-preview__action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
}

.cep-preview__action-btn--active {
  background: rgba(167, 139, 250, 0.2);
  color: #a78bfa;
}

.cep-preview__action-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 4px;
}

/* About dialog */
.cep-about-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.cep-about-dialog {
  background: #1e1e2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 360px;
  max-width: 90vw;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.cep-about-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cep-about-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cep-about-logo__text {
  color: #fff;
  font-size: 24px;
  font-weight: 800;
}

.cep-about-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
}

.cep-about-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.cep-about-body {
  padding: 20px 24px;
}

.cep-about-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.cep-about-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cep-about-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.cep-about-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.cep-about-desc {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 16px;
}

.cep-about-desc p {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.cep-about-links {
  display: flex;
  gap: 12px;
}

.cep-about-link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.cep-about-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.cep-about-close {
  display: block;
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cep-about-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Light mode */
html:not(.dark) .cep-preview__action-btn {
  color: #777;
}

html:not(.dark) .cep-preview__action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

html:not(.dark) .cep-preview__action-btn--active {
  background: rgba(99, 102, 241, 0.15);
  color: #6366f1;
}

html:not(.dark) .cep-preview__action-divider {
  background: rgba(0, 0, 0, 0.15);
}

html:not(.dark) .cep-about-overlay {
  background: rgba(255, 255, 255, 0.7);
}

html:not(.dark) .cep-about-dialog {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

html:not(.dark) .cep-about-header {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

html:not(.dark) .cep-about-title h2 {
  color: #1a1a2e;
}

html:not(.dark) .cep-about-subtitle {
  color: rgba(0, 0, 0, 0.5);
}

html:not(.dark) .cep-about-label {
  color: rgba(0, 0, 0, 0.5);
}

html:not(.dark) .cep-about-value {
  color: rgba(0, 0, 0, 0.85);
}

html:not(.dark) .cep-about-desc {
  background: rgba(0, 0, 0, 0.03);
}

html:not(.dark) .cep-about-desc p {
  color: rgba(0, 0, 0, 0.7);
}

html:not(.dark) .cep-about-link {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.6);
}

html:not(.dark) .cep-about-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.85);
}

html:not(.dark) .cep-about-close {
  background: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.6);
}

html:not(.dark) .cep-about-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.85);
}
</style>
