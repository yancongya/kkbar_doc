import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kkbar',
  description: 'Adobe After Effects 快捷工具栏',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/assets/logo/logo-animated.svg' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css',
      integrity: 'sha512-dPXYcDub/aeb08c63jRq/k6GaKccl256JQy/AnOq7CAnEZ9FzSL9wSbcZkMp4R26vBsMLFYH4kQ67/bbV8XaCQ==',
      crossorigin: 'anonymous',
      referrerpolicy: 'no-referrer'
    }],
  ],

  themeConfig: {
    logo: '/assets/logo/logo-animated.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guides/01-introduction/' },
      { text: '功能', link: '/features/01-buttons/' },
      { text: '图标库', link: '/icons/01-icons/' },
      { text: '设置', link: '/settings/01-ui-settings/' },
      { text: '故障排除', link: '/troubleshooting/01-faq/' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '简介', link: '/guides/01-introduction/' },
          { text: '安装', link: '/guides/02-installation/' },
          { text: '快速上手', link: '/guides/03-quickstart/' },
        ],
      },
      {
        text: '功能',
        items: [
          { text: '按钮与分类', link: '/features/01-buttons/' },
          { text: '动作类型', link: '/features/02-actions/' },
          { text: '脚本文件 (.jsx)', link: '/features/03-actions-jsx/' },
          { text: '预设 (.ffx)', link: '/features/04-actions-preset/' },
          { text: '效果 (Effects)', link: '/features/05-actions-effect/' },
          { text: '表达式', link: '/features/06-actions-expression/' },
          { text: '代码片段', link: '/features/07-actions-scriptlet/' },
          { text: '面板', link: '/features/08-actions-panel/' },
          { text: '菜单命令', link: '/features/09-actions-menuitem/' },
          { text: '剪贴板', link: '/features/10-actions-clipboard/' },
          { text: 'Shell 命令', link: '/features/11-actions-shell/' },
        ],
      },
      {
        text: '图标库',
        items: [
          { text: '图标系统', link: '/icons/01-icons/' },
          { text: '内置图标', link: '/icons/02-icons-builtin/' },
          { text: 'FontAwesome 图标', link: '/icons/03-icons-fontawesome/' },
          { text: '导入图标', link: '/icons/04-icons-import/' },
          { text: '图标颜色', link: '/icons/05-icons-color/' },
        ],
      },
      {
        text: '设置',
        items: [
          { text: '界面设置', link: '/settings/01-ui-settings/' },
          { text: '主题与外观', link: '/settings/02-themes/' },
          { text: '数据库设置', link: '/settings/03-db-settings/' },
          { text: '云备份', link: '/settings/04-cloud-backup/' },
        ],
      },
      {
        text: '故障排除',
        items: [
          { text: '常见问题', link: '/troubleshooting/01-faq/' },
          { text: '调试模式', link: '/troubleshooting/02-debug-mode/' },
          { text: '错误代码', link: '/troubleshooting/03-error-codes/' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-2025 Kkbar',
    },
  },
})