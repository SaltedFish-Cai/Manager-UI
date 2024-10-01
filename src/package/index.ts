// _Import
import { defineAsyncComponent } from "vue";
import pinia from "./store/pinia";
import inBrowser from "@/package/tools/inBrowser";
import { useBaseStore as globalState } from "./store/index";
import packageFile from "../../version.json";
import dictionaries from "./tools/dictionaries";
import Log from "./tools/log";
import { setThemeColor } from "./tools/color";

// _Message icon
import mIcon from "./m-icon/index";

// _Message title
import mTitle from "./m-title/index";

// _Message button
import mButton from "./m-button/index";

// _Message dialog
import mDialog from "./m-dialog/index";

// _Message form
import mForm from "./m-form/index";

// _Message table
import mTable from "./m-table/index";
import { useBaseStore as tableBaseStore } from "./m-table/hooks/store";

// _Message tabs
import mTabs from "./m-tabs/index";

// _Message editor
import mEditor from "./m-editor/index";

// _Message number
import mNumber from "./m-number/index";

// _Message scrollbar
import mScrollBar from "./m-scrollbar/index";

// _Message line-map
import mLineMap from "./m-line-map/index";
import { GlobalState } from "./store/type";

// _Message input

// _Function install
const install = function (app, options: GlobalState) {
  const {
    themeColor = "#00aa90",
    isDark = false,
    requestHeader,
    tableConfig = {},
    formConfig = {},
    toolsConfig = {},
    size = "default"
  } = options;
  const { info, error, warning, success, msg } = Log();

  if (inBrowser) {
    window.log = { info, error, warning, success, msg };
    window.log.msg("ManagerUI Version", packageFile.version);

    const observer = window.ResizeObserver
      ? new window.ResizeObserver(callback)
      : {
          observe: () => {
            console.info(callback);
          }
        };

    // _Function 监听屏幕尺寸变化
    function callback() {
      const baseSize = 15;
      const devicePixelRatio = window.devicePixelRatio;
      const size = devicePixelRatio > 1 ? baseSize / devicePixelRatio : baseSize;
      const _size = size < 8 ? 8 : size;
      window.document.documentElement?.style?.setProperty("--el-scrollbar-width", _size + "px");
    }
    observer?.observe(window.document?.body);
  }

  if (!app._context.components["ManagerUI"]) {
    app.use(pinia);
    app.use(dictionaries);

    const components: any = import.meta.glob("./m-*/m-*.vue");
    for (const path in components) {
      const name = path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
      app.component(name, defineAsyncComponent(components[path]));
    }

    // if (!app.GlobalState) app.GlobalState = {};
    // if (!app.MTools) app.MTools = {};
    // if (!app.GlobalState.MGlobalState) app.GlobalState.MGlobalState = globalState;
    // if (!app.GlobalState.MTableState) app.GlobalState.MTableState = tableBaseStore;

    if (inBrowser) {
      if (!window.setManagerTheme) window.setManagerTheme = setThemeColor;
      const setManagerThemeDark = val => setThemeColor(themeColor, val);
      if (!window.setManagerThemeDark) window.setManagerThemeDark = setManagerThemeDark;
      setThemeColor(themeColor, isDark);

      window.document.documentElement?.style?.setProperty("--el-scrollbar-width", 12 + "px");
      window.document.documentElement?.style?.setProperty("--el-component-size-large", 32 + "px");
      window.document.documentElement?.style?.setProperty("--el-component-size", 28 + "px");
      window.document.documentElement?.style?.setProperty("--el-component-size-small", 24 + "px");
      window.document.documentElement?.style?.setProperty(
        "--el-component-base-size-default",
        28 + (size == "small" ? -4 : size == "large" ? 4 : 0) + "px"
      );
      window.document.documentElement?.style?.setProperty(
        "--el-font-base-size-default",
        13 + (size == "small" ? -1 : size == "large" ? 2 : 0) + "px"
      );

      if (!window.MGlobalState) window.MGlobalState = globalState;
      if (!window.MTableState) window.MTableState = tableBaseStore;

      const useGlobalState = globalState();
      const data = { themeColor, isDark, requestHeader, tableConfig, formConfig, toolsConfig, size };
      useGlobalState.setGlobalConfig(data);
    }
  }
};

export default {
  name: "ManagerUI",
  install
};

export { mIcon, mTitle, mButton, mDialog, mForm, mTable, mTabs, mEditor, mNumber, mLineMap, mScrollBar };

export { dictionaries };
