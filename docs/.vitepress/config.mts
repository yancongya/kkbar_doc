import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kkbar',
  description: 'Adobe After Effects 快捷工具栏扩展',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/assets/logo/logo.png' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css',
      integrity: 'sha512-dPXYcDub/aeb08c63jRq/k6GaKccl256JQy/AnOq7CAnEZ9FzSL9wSbcZkMp4R26vBsMLFYH4kQ67/bbV8XaCQ==',
      crossorigin: 'anonymous',
      referrerpolicy: 'no-referrer'
    }],
  ],

  themeConfig: {
    logo: '/assets/logo/logo.png',

    nav: [
      { text: '指南', link: '/guides/introduction/' },
      { text: '功能', link: '/features/buttons/' },
      { text: 'API', link: '/reference/api/' },
    ],

    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '简介', link: '/guides/introduction/' },
          { text: '安装', link: '/guides/installation/' },
          { text: '快速上手', link: '/guides/quickstart/' },
        ],
      },
      {
        text: '功能说明',
        items: [
          { text: '按钮与分类', link: '/features/buttons/' },
          { text: '动作类型', link: '/features/actions/' },
          { text: '图标系统', link: '/features/icons/' },
          { text: '主题与外观', link: '/features/themes/' },
        ],
      },
      {
        text: '参考',
        items: [
          { text: 'API 参考', link: '/reference/api/' },
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
