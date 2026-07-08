import { reactive, computed } from 'vue'
import zh from './zh'
import en from './en'

type Lang = 'zh' | 'en'

interface LangPack {
  [key: string]: any
}

function getInitialLocale(): Lang {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('kkbar-locale') as Lang | null
    if (stored === 'zh' || stored === 'en') return stored
  }
  return 'zh'
}

const state = reactive<{ locale: Lang }>({
  locale: getInitialLocale(),
})

const packs: Record<Lang, LangPack> = { zh, en }

export function useI18n() {
  const locale = computed(() => state.locale)

  function resolve(key: string): any {
    const keys = key.split('.')
    let val: any = packs[state.locale]
    for (const k of keys) {
      if (val == null || typeof val !== 'object') return undefined
      val = val[k]
    }
    return val
  }

  function t(key: string): string {
    const val = resolve(key)
    return typeof val === 'string' ? val : key
  }

  function tA(key: string): string[] {
    const val = resolve(key)
    return Array.isArray(val) ? val : [key]
  }

  function tN(key: string, def: string): string {
    const v = resolve(key)
    return typeof v === 'string' ? v : def
  }

  function setLocale(lang: Lang) {
    state.locale = lang
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kkbar-locale', lang)
    }
  }

  function toggleLocale() {
    setLocale(state.locale === 'zh' ? 'en' : 'zh')
  }

  return { locale, t, tA, tN, setLocale, toggleLocale }
}
