import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './styles/index.css'
import './styles/tailwind.css'

export default {
  extends: DefaultTheme,
  Layout,
}
