// _Import
import http from "@/package/api/index";
import { useBaseStore as globalState } from "../store/index";
import { Obj } from "../global";

// _Function 获取字典（地址）
export async function GetSystemAddressMap() {
  const useGlobalState = globalState();
  const KEY = "SystemDictionary-AddressMap";
  const data: Obj = useGlobalState.getDictionary(KEY);

  const timeOut = new Date().getTime();
  const oldTime = useGlobalState.getDictionaryTimeout;
  const MAX_TIME_OUT = useGlobalState.getDictionaryMaxTime;

  if (data && data.length && timeOut - oldTime < MAX_TIME_OUT) {
    return data;
  } else {
    const url = useGlobalState.getFormConfig?.addressApi?.url;
    const type = useGlobalState.getFormConfig?.addressApi?.type;
    if (url) {
      const { Data, Code } = await http[type || "get"](url);
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
