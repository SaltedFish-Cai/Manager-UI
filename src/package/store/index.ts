// _Import
import { defineStore } from "pinia";
import { GlobalState, toolsState } from "./type";
import piniaPersistConfig from "./piniaPersist";
import { Obj } from "../global";

// _Message useBaseStore
export const useBaseStore = defineStore({
  id: "manager-ui-global-configs",
  state: (): GlobalState & toolsState => ({
    themeColor: "#00aa90",
    isDark: false,
    requestHeader: {},
    tableConfig: {},
    formConfig: {},
    toolsConfig: {},
    size: "default",

    dictionaryData: {},
    dictionaryTimeout: 0,
    dictionaryMaxTime: 1000 * 60 * 30
  }),
  getters: {
    getRequestHeader: (state: GlobalState) => {
      return state.requestHeader;
    },
    getSize: (state: GlobalState) => {
      return state.size;
    },
    getTableConfig: (state: GlobalState) => {
      return state.tableConfig;
    },
    getFormConfig: (state: GlobalState) => {
      return state.formConfig;
    },
    getToolsConfig: (state: GlobalState) => {
      return state.toolsConfig;
    },

    getDictionaryTimeout: (state: toolsState): number => state.dictionaryTimeout,

    getDictionaryMaxTime: (state: toolsState): number => state.dictionaryMaxTime,

    getDictionary: (state: toolsState) => {
      return (key: string): Obj => {
        return state.dictionaryData[key];
      };
      // const _globalState = globalState();
      // const user: any = _globalState.getToken;
    }
  },
  actions: {
    setGlobalConfig(config: GlobalState) {
      const _config = { ...this, ...config };
      this.themeColor = _config.themeColor;
      this.isDark = _config.isDark;
      this.requestHeader = _config.requestHeader;
      this.tableConfig = _config.tableConfig;
      this.formConfig = _config.formConfig;
      this.toolsConfig = _config.toolsConfig;
      this.size = _config.size;
      this.dictionaryMaxTime = _config.dictionaryMaxTime;

      window.document.documentElement?.style?.setProperty(
        "--el-component-base-size-default",
        28 + (this.size == "small" ? -4 : this.size == "large" ? 4 : 0) + "px"
      );
      window.document.documentElement?.style?.setProperty(
        "--el-font-base-size-default",
        13 + (this.size == "small" ? -1 : this.size == "large" ? 2 : 0) + "px"
      );
    },
    // 字典超时时间
    setDictionaryTimeout(time: number) {
      this.dictionaryTimeout = time;
    },

    // 字典
    setDictionary(key: string, data: Obj[]) {
      this.dictionaryData[key] = data;

      // const _globalState = globalState();
      // const user: any = _globalState.getToken;
      // this.dictionaryData[key + user.Identifier] = data;
    },

    // 字典
    cleanDictionary() {
      this.dictionaryData = {};
    }
  },
  persist: piniaPersistConfig("manager-ui-global-configs")
});
