# ManagerUI

<code>ManagerUI 库</code> 基于 `Element-Plus` 二次开发，更好的提供开发体验与效率，使用 `Typescript` 作为开发基础语言，严格的校验能够更有效减少错误的产生。

## 完整引入

现有项目已完整引入，可以直接使用库中组件，无需额外引入。

```typescript
// main.ts
import { createApp } from 'vue'
import ManagerUi from "../ManagerUI/es/index";
import "../ManagerUI/es/style.css";

import App from './App.vue'

const app = createApp(App)

app.use(ManagerUI)
app.mount('#app')
```
