import { defineConfig, PluginOption } from "vite";
import { resolve } from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

// 展示构建时长、chunk 数量及大小
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  // _Message resolve
  resolve: {
    alias: {
      "@": resolve(__dirname, "../"),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
    }
  },
  // _Message build
  build: {
    target: "modules",
    // 压缩
    minify: true,
    copyPublicDir: false,
    rollupOptions: {
      // 忽略打包vue文件
      external: ["vue", "element-plus", "lodash", "pinia", "clipboard", "axios"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          preserveModules: true,
          // 配置打包根目录
          dir: "ManagerUI/es",
          preserveModulesRoot: "src/package"
        }
        // {
        //   format: "cjs",
        //   entryFileNames: "[name].js",
        //   preserveModules: true,
        //   dir: "ManagerUI/lib",
        //   preserveModulesRoot: "src/package"
        // }
      ]
    },
    lib: {
      entry: "./src/package/index.ts",
      formats: ["es", "cjs"]
    }
  },
  // _Message plugins
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: "./src/package/",
      outDir: "ManagerUI/es",
      // include: ["**/*.ts"],
      exclude: ["node_modules", "dist", "**/*.js"]
    }),
    visualizer({ filename: "stats.html", gzipSize: true, brotliSize: true }) as PluginOption
  ]
});
