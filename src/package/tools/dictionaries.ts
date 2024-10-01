// _Import
import { GetDictionariesByKeys, GetTableDictionaryByCondition } from "../api/modules";
import { mSelectOptionType } from "../global";
import { systemParamsType, tableParamsType } from "./type";

// _Function 字典方法入口
async function dictionaries(type: "system" | "table", key: string[], params?: systemParamsType | tableParamsType[]) {
  const options: mSelectOptionType[] = [];

  if (type == "system") {
    const data = await GetSystemDictionaries(key, params as systemParamsType);
    if (!data || data?.length == 0) {
      return options;
    }
    for (let index = 0; index < data[key[0]].length; index++) {
      const item = data[key[0]][index];
      options.push({ label: item.Description || item.DictionaryKey, value: item.Value, base: item });
    }
  } else {
    const data = await GetTableDictionaries(key, params as tableParamsType[]);
    if (!data || data?.length == 0) {
      return options;
    }
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      options.push({ label: item.Key, value: Number(item.Value), base: item });
    }
  }
  return options;
}

// _Function 表格字典
async function GetTableDictionaries(key: string[], params?: tableParamsType[]) {
  let filter: tableParamsType[] = [];
  if (!key) return [];
  if (params) {
    filter = params;
  } else {
    filter = [
      {
        fieldName: "TableName",
        fieldValue: key[0],
        conditionalType: "Equal"
      }
    ];
    if (key[1]) {
      filter.push({
        fieldName: "ColumnName",
        fieldValue: key[1],
        conditionalType: "Equal"
      });
    }
  }

  const List = await GetTableDictionaryByCondition({ filter });
  return List;
}

// _Function 系统字典
async function GetSystemDictionaries(key: string[], params?: systemParamsType) {
  let _params = { keys: key[0] };
  if (params) {
    _params = params;
  }
  const List = await GetDictionariesByKeys(_params);
  return List;
}

export default dictionaries;
