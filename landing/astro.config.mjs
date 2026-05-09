import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import vue from "@astrojs/vue";

export default defineConfig({
  integrations: [
    vue(), // 添加 Vue 支持
    starlight({
      title: "Kkbar",
      description: "Adobe After Effects 快捷工具栏扩展",
      logo: {
        light: "../docs/public/assets/logo/logo-shared.svg",
        dark: "../docs/public/assets/logo/logo-shared.svg",
        replacesTitle: false,
      },
      social: {
        github: "https://github.com/your-org/kkbar",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "开始使用",
          items: [
            { label: "简介", link: "/guides/introduction/" },
            { label: "安装", link: "/guides/installation/" },
            { label: "快速上手", link: "/guides/quickstart/" },
          ],
        },
        {
          label: "功能说明",
          items: [
            { label: "按钮与分类", link: "/features/buttons/" },
            { label: "动作类型", link: "/features/actions/" },
            { label: "图标系统", link: "/features/icons/" },
            { label: "主题与外观", link: "/features/themes/" },
          ],
        },
        {
          label: "参考",
          items: [
            { label: "API 参考", link: "/reference/api/" },
          ],
        },
      ],
    }),
  ],
});
