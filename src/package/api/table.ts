// _Import
import http from "@/package/api/index";
import { useBaseStore as globalState } from "../store/index";
import { Obj } from "../global";

// _Function 获取字典(链接关系)
export async function GetConditionals(useType: "group" | "link", params?: Obj) {
  const useGlobalState = globalState();
  let KEY = "SystemDictionary-GetConditionals";
  if (useType == "group") KEY = "SystemDictionary-GetGroupConditionals";

  const data: Obj = useGlobalState.getDictionary(KEY);
  const timeOut = new Date().getTime();
  const oldTime = useGlobalState.getDictionaryTimeout;
  const MAX_TIME_OUT = useGlobalState.getDictionaryMaxTime;

  if (data && timeOut - oldTime < MAX_TIME_OUT) {
    return data;
  } else {
    let url = useGlobalState.getTableConfig?.advancedQueryApi?.url;
    let type = useGlobalState.getTableConfig?.advancedQueryApi?.type;

    if (useType == "group") {
      url = useGlobalState.getTableConfig?.groupAdvancedQueryApi?.url;
      type = useGlobalState.getTableConfig?.groupAdvancedQueryApi?.type;
    }

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
