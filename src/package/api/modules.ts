// _Import
import http from "@/package/api/index";
import { useBaseStore as globalState } from "../store/index";
import { Obj } from "../global";
import { ReqDictionaryParams } from "./type";

// _Function 设置环境Url链接
// function setLinkUrl(path: string) {
//   const _globalState = globalState();
//   const SYSTEM = _globalState.getEnv;
//   let api;ResPage
//   switch (SYSTEM) {
//     case "bbraun":
//       api = `/newapi/${path}`;
//       break;
//     case "dealer":
//       api = `/newapi/${path}`;
//       break;
//     case "cms":
//       api = `/api/${path}`;
//       break;
//     default:
//       break;
//   }
//   return api;
// }

// _Function 获取表字典方法
export async function GetTableDictionaryByCondition(params: ReqDictionaryParams, options?: { noStore: boolean }) {
  const useGlobalState = globalState();
  const FILTER = params.filter;
  let KEY = "";
  for (let index = 0; index < FILTER.length; index++) {
    const element = FILTER[index];
    KEY += `${element.fieldName}-${element.fieldValue}-`;
  }
  const data: Obj = useGlobalState.getDictionary(KEY);
  const _params = {
    page: {},
    params: {},
    sort: [],
    ...params
  };

  const timeOut = new Date().getTime();
  const oldTime = useGlobalState.getDictionaryTimeout;
  const MAX_TIME_OUT = useGlobalState.getDictionaryMaxTime;

  if (data && data.length && timeOut - oldTime < MAX_TIME_OUT && !options?.noStore) {
    return data;
  } else {
    const url = useGlobalState.getToolsConfig?.tableDictionary?.url;
    const type = useGlobalState.getToolsConfig?.tableDictionary?.type;
    if (url) {
      const { Data, Code } = await http[type || "get"](url, _params);
      if (Code == 200) {
        useGlobalState.setDictionary(KEY, Data.List);
        useGlobalState.setDictionaryTimeout(timeOut);
        return Data.List;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
}

// _Function 系统字典方法
export async function GetDictionariesByKeys(params: Obj, options?: { noStore: boolean }) {
  const useGlobalState = globalState();
  const KEY = params.keys;
  const data: Obj = useGlobalState.getDictionary(KEY);
  const timeOut = new Date().getTime();
  const oldTime = useGlobalState.getDictionaryTimeout;
  const MAX_TIME_OUT = useGlobalState.getDictionaryMaxTime;

  if (data && data.length && timeOut - oldTime < MAX_TIME_OUT && !options?.noStore) {
    return data;
  } else {
    const url = useGlobalState.getToolsConfig?.systemDictionary?.url;
    const type = useGlobalState.getToolsConfig?.systemDictionary?.type;
    if (url) {
      const { Data, Code } = await http[type || "get"](url, params);
      if (Code == 200) {
        useGlobalState.setDictionary(KEY, Data);
        useGlobalState.setDictionaryTimeout(timeOut);
        return Data;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
}
