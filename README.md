# Manager-UI
Manager-UI 基于 Vue3 + Element-Plus 二次开发UI框架，用于快速页面搭建与开发。🤪🤪🤪
[文档与展示地址点这里](http://manager.frontend-m.online/)

# 开始

<code>ManagerUI 库</code> 基于 [`Element-Plus`](https://element-plus.org/zh-CN/guide/installation.html) 二次开发，请先确认你已安装，更好的提供开发体验与效率，使用 `Typescript` 作为开发基础语言，严格的校验能够更有效减少错误的产生。

## 安装（由于NPM服务器问题，暂无提交最新版本）

我们建议您使用包管理器 (NPM, [Yarn](https://classic.yarnpkg.com/lang/en/), [pnpm](https://pnpm.io/) 安装 <code>ManagerUI</code>)
```sh
# 选择一个你喜欢的包管理器

# NPM
$ npm install manager-ui --save

# Yarn
$ yarn add manager-ui

# pnpm
$ pnpm install manager-ui
```

## 如何使用

下载本项目，执行 `npm run build` 将编译后的 `ManagerUI` 包放入项目中即可。

## 引入

现有项目已完整引入，可以直接使用库中组件，无需额外引入。

```typescript
// main.ts
import { createApp } from 'vue'

import ManagerUI from 'manager-ui'
import 'manager-ui/es/style.css'

import App from './App.vue'

const app = createApp(App)

app.use(ManagerUI)
app.mount('#app')
```

## Typescript 支持

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "paths": {
      ...
      "ManagerUI": ["./packages/ManagerUI/es"],
      "ManagerUI/*": ["./packages/ManagerUI/es/*"],
      "MTools": ["./packages/ManagerUI/es/tools"],
      "MTools/*": ["./packages/ManagerUI/es/tools/*"]
    },
  },
  ...
}
```

```typescript
// vite.config.ts
export default defineConfig(() => {
  return {
    ...
    resolve: {
      alias: {
        MTools: resolve(__dirname, "./packages/ManagerUI/es/tools"),
        ManagerUI: resolve(__dirname, "./packages/ManagerUI/es"),
      }
    }
  };
});
```
