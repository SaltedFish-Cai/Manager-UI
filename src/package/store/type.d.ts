import { Obj } from "../global";

export interface toolsState {
  dictionaryData: Obj;
  dictionaryTimeout: number;
  dictionaryMaxTime: number;
}

export interface apiType {
  url: string;
  type: "get" | "post";
}

export interface GlobalState {
  themeColor?: string;
  isDark?: boolean;
  requestHeader?: Obj;
  requestHost?: string;
  size?: "default" | "large" | "small";

  tableConfig?: {
    advancedQueryApi?: apiType;
    groupAdvancedQueryApi?: apiType;
  };
  formConfig?: {
    addressApi?: apiType;
    fileApi?: apiType & { fileApi: string; downloadApi: string };
  };
  toolsConfig?: {
    tableDictionary?: apiType;
    systemDictionary?: apiType;
  };
}
