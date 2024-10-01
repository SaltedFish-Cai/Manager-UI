import demoBlock from "../../src/demoblock";
import { packageSidebar } from "./package-sidebar";
import { packageCode } from "./package-code";
import { study } from "./study";

import { resolve } from "path";

import vueJsx from "@vitejs/plugin-vue-jsx";
export default {
  srcDir: "../",
  outDir: "../docs",
  base: "/",
  lang: "zh-CN",
  // lang: 'en-US',
  title: "Salted-Fish", // 标题
  description: "老咸鱼的站点", // 描述
  env: "manager",
  lastUpdated: true, // 上次更新时间
  markdown: {
    headers: {
      level: [0, 0]
    },
    config: md => {
      md.use(demoBlock);
    }
  },

  themeConfig: {
    logo: "/logo-ui.svg",
    outline: {
      level: [2, 6],
      label: "目录大纲"
    },
    // 顶部导航
    nav: [
      // { text: "指南", link: "/document/guide/quickstart", activeMatch: "/guide/" },
      { text: "💡 Manager-UI 框架", link: "/document/component/quick-start", activeMatch: "/component/" },
      { text: "📘 学习文档", link: "/document/study/vue/doc1", activeMatch: "/study/" },
      { text: "🔨 工具站", link: "/document/tools/tools" },
      {
        text: "🧲 相关链接",
        items: [
          {
            text: "vitepress",
            link: "https://vitepress.dev/zh/"
          },
          {
            text: "vue",
            link: "https://cn.vuejs.org/"
          },
          {
            text: "vite",
            link: "https://cn.vitejs.dev/"
          }
        ]
      }
    ],
    sidebar: {
      "/document/md": packageSidebar,
      "/document/component": packageSidebar,
      "/document/tools": packageSidebar,
      "/document/solution": packageSidebar,
      "/document/study": study
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档"
          },
          modal: {
            searchBox: {
              resetButtonTitle: "清除查询条件",
              resetButtonAriaLabel: "清除查询条件",
              cancelButtonText: "取消",
              cancelButtonAriaLabel: "取消"
            },
            startScreen: {
              recentSearchesTitle: "搜索历史",
              noRecentSearchesText: "没有搜索历史",
              saveRecentSearchButtonTitle: "保存至搜索历史",
              removeRecentSearchButtonTitle: "从搜索历史中移除",
              favoriteSearchesTitle: "收藏",
              removeFavoriteSearchButtonTitle: "从收藏中移除"
            },
            errorScreen: {
              titleText: "无法获取结果",
              helpText: "你可能需要检查你的网络连接"
            },
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
              searchByText: "搜索提供者"
            },
            noResultsScreen: {
              noResultsText: "无法找到相关结果",
              suggestedQueryText: "你可以尝试查询",
              reportMissingResultsText: "你认为该查询应该有结果？",
              reportMissingResultsLinkText: "点击反馈"
            }
          }
        }
      }
    },
    // 社交信息栏
    socialLinks: [{ icon: "github", link: "https://github.com/SaltedFish-Cai/Manager-UI" }],
    // 底部信息栏
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present <a href='http://beian.miit.gov.cn' target='_blank'>沪ICP备2022024976号</a>"
    },
    lastUpdated: {
      text: "更新于",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium"
      }
    }
    // 广告栏
    // carbonAds: {
    //     code: '',
    //     placement: ''
    // }
  },
  vite: {
    // Vite 配置选项
    plugins: [vueJsx()],
    server: {
      host: "0.0.0.0",
      port: 6606,
      open: true,
      cors: true
      // Load proxy configuration from .env.development
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "../../src"),
        MTools: resolve(__dirname, "../../src/package/tools/"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    }
  },
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["link", { rel: "icon", href: `/logo-ui.svg` }]
    // ["script", { src: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js` }]
  ]
};
