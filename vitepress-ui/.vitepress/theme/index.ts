/**
 * @ Author: Cai
 * @ Create Time: 2024-02-28 09:51:47
 * @ Modified by: Cai
 * @ Modified time: 2024-09-03 15:38:01
 * @ Description: page name: theme-index
 */

import { h, watch } from "vue";
import DefaultTheme from "vitepress/theme"; //引入默认主题
import { useData, EnhanceAppContext } from "vitepress";
import { createMediumZoomProvider } from "../../../src/components/box-nav/composable/useMediumZoom";

// >-------------> 组件 <------------<
import demo from "../../../src/demoblock/demo.vue";
import CodeView from "../../../src/components/box-code-view/index.vue";

import MNavVisitor from "../../../src/components/box-nav/MNavVisitor.vue";
import MDocFooter from "../../../src/components/box-nav/MDocFooter.vue";
// import MAsideSponsors from "../../src/components/box-nav/MAsideSponsors.vue";
import NavLinks from "../../../src/components/box-nav/NavLinks.vue";

import directives from "../../../src/directives/index";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// import { mIcon, mButton, mTable, mForm } from "../../src/package/index";
import ManagerUI from "../../../src/package/index";
// import ManagerUi from "../../ManagerUI/es/index";
// import "../../ManagerUI/es/style.css";

// scss
import "../../../src/styles/custom.scss";
import "../../../src/styles/theme.scss";
import "../../../src/styles/flex.scss";
import "../../../src/styles/mp.scss";

// 导出vitepress配置
export default {
  ...DefaultTheme,
  NotFound: () => "custom 404",
  Layout: () => {
    const props: Record<string, any> = {};
    // 获取 frontmatter
    const { frontmatter } = useData();

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass;
    }

    return h(DefaultTheme.Layout, props, {
      /**
       * 相关插槽
       * https://vitepress.dev/guide/extending-default-theme#layout-slots
       * https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/Layout.vue
       */
      "nav-bar-title-after": () => h(MNavVisitor)
      // "doc-after": () => h(MDocFooter),
      // "aside-bottom": () => h(MAsideSponsors)
    });
  },
  enhanceApp({ app, router }: EnhanceAppContext) {
    createMediumZoomProvider(app, router);
    app.mixin({
      async beforeMount() {
        import("vue-json-viewer").then(module => {
          if (!app._context.components[module.default.name]) app.use(module.default);
        });
      }
    });
    app.use(ElementPlus);
    app.use(directives);
    app.use(ManagerUI, {
      requestHeader: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU0MTIwODIsImV4cCI6MTg2MzA5MjA4MiwiSWRlbnRpZmllciI6ImUxYTdiZGFmLTFmOWUtNDcwMS04NGEzLTAwNDY2ODc3NDMyYyIsIkFwcElkIjoiMjAyMDg3OTkiLCJEZWFsZXJDb2RlIjoiMjAyMDg3OTkiLCJEZWFsZXJJZCI6IjMiLCJVc2VySWQiOiI1NTI0IiwiU3lzdGVtSWQiOiIxIiwiSXNBZG1pbiI6IjAiLCJVc2VyTmFtZSI6IuWMl-S6rOS6rOacl-i0uOaYk-aciemZkOWFrOWPuCIsImlzcyI6IkJicmF1bkRNU0JhY2tFbmQiLCJhdWQiOiJCYnJhdW5ETVNGcm9udEVuZCJ9.fbx-wh-S0c2vw9fjrjuoHDT6Ns8wOGihShDc2ZjqZx8",
        Version: 202408272000
      },
      tableConfig: {
        advancedQueryApi: {
          url: "https://dms-qas.bbraun.cn/newapi/SystemDictionary/GetConditionals",
          type: "get"
        },
        groupAdvancedQueryApi: {
          url: "https://dms-qas.bbraun.cn/newapi/SystemDictionary/GetDictionariesByKeys",
          type: "get"
        }
      },
      toolsConfig: {
        tableDictionary: {
          url: "https://dms-qas.bbraun.cn/newapi/TableDictionary/GetTableDictionaryByCondition",
          type: "post"
        },
        systemDictionary: {
          url: "https://dms-qas.bbraun.cn/newapi/SystemDictionary/GetDictionariesByKeys",
          type: "get"
        }
      },
      formConfig: {
        addressApi: {
          url: "https://dms-qas.bbraun.cn/newapi/Common/GetAllProvinceCityInfo",
          type: "get"
        },
        fileApi: {
          url: "https://dms-qas.bbraun.cn/newapi/UploadFile/UploadFiles",
          type: "post",
          fileApi: "https://dms-qas.bbraun.cn/newapi/",
          downloadApi: "https://dms-qas.bbraun.cn/newapi/UploadFile/getfile?filepath="
        }
      },
      themeColor: "#00a47e"
    });

    // app.use(mIcon);
    // app.use(mButton);
    // app.use(mTable);
    // app.use(mForm, { token: "token" });

    app.component("CodeView", CodeView);
    app.component("demo", demo);
    app.component("NavLinks", NavLinks);

    app.provide("DEV", process.env.NODE_ENV === "development");
    const _window: any = typeof window == "undefined" ? global : window;
    _window.app = app;
    if (typeof window !== "undefined") {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === "/"),
        { immediate: true }
      );
    }
  }
};

let homePageStyle: HTMLStyleElement | undefined;
// Speed up the rainbow animation on home page
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return;

    homePageStyle = document.createElement("style");
    homePageStyle.innerHTML = `
      :root {
        animation: rainbow 12s linear infinite;
      }`;
    document.body.appendChild(homePageStyle);
  } else {
    if (!homePageStyle) return;

    homePageStyle.remove();
    homePageStyle = undefined;
  }
}
