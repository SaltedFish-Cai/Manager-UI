// _Import
import { defineAsyncComponent } from "vue";

// _Message Develope Install
const Component = {
  install: async app => {
    const components: any = import.meta.glob("@/package/m-*/*.vue");
    for (const path in components) {
      const name = path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
      window.log.msg("使用本地 ManagerUI:", name);
      app.component(name, defineAsyncComponent(components[path]));
    }
    // 下方异步注入
    // const components = import.meta.glob("@/package/m-*/index.ts");
    // for (const path in components) {
    //   const name = path.split("/")[path.split("/").length - 2];
    //   const _components: any = await components[path]();
    //   const componentName = _components.default.name;
    //   delete app._context.components[componentName];
    //   app.use(_components.default);
    // }
  }
};

export default Component;
