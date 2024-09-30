// _Import
import { isArray } from "./is";
import { FieldNamesProps } from "../type";
import ClipboardJS from "clipboard";
import { ElMessage } from "element-plus";
import { Obj } from "@/package/global";

// _Function 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: "tag") {
  const value = fieldNames?.value ?? "value";
  const label = fieldNames?.label ?? "label";
  const children = fieldNames?.children ?? "children";
  let filterData: { [key: string]: any } = {};
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) {
    if (Array.isArray(callValue)) {
      const _filterData = [] as Obj[];
      for (let index = 0; index < callValue.length; index++) {
        const element = callValue[index];
        filterData = findItemNested(enumData, element, value, children);
        _filterData.push(filterData);
      }
      filterData = _filterData;
    } else {
      filterData = findItemNested(enumData, callValue, value, children);
    }
  }
  // 判断是否输出的结果为 tag 类型
  if (type == "tag") {
    return filterData?.tagType ? filterData.tagType : "";
  }
  if (Array.isArray(callValue)) {
    let text = "";
    for (let index = 0; index < filterData.length; index++) {
      const element = filterData[index];
      text += element.label + (index >= filterData.length - 1 ? "" : ", ");
    }
    return text;
  } else {
    return filterData ? filterData[label] : "--";
  }
}

// _Function 处理值无数据情况
export function formatValue(callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
}

// _Function 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
export function handleProp(prop: string) {
  if (prop) {
    const propArr = prop.split(".");
    if (propArr.length == 1) return prop;
    return propArr[propArr.length - 1];
  }
  return "";
}

// _Function 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
  if (!prop.includes(".")) return row[prop] ?? "--";
  prop.split(".").forEach(item => (row = row[item] ?? "--"));
  return row;
}

// _Function 递归查找 callValue 对应的 enum 值
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
  return enumData.reduce((accumulator: any, current: any) => {
    if (accumulator) return accumulator;
    if (current[value] == callValue) return current;
    if (current[children]) return findItemNested(current[children], callValue, value, children);
  }, null);
}

// _Function 使用拷贝
export function useClipboard(text: string, event: any) {
  const clipboard: any = new ClipboardJS(event.target, {
    text: () => text
  });

  clipboard.on("success", () => {
    clipboard.destroy();
    ElMessage.success("复制成功");
  });
  clipboard.on("error", () => {
    clipboard.destroy();
    ElMessage.error("复制失败");
  });

  clipboard.onClick(event);
}

// _Function 时间转换格式
export const format = (time: string, fmt = "yyyy-MM-dd HH:mm:ss") => {
  if (!time) {
    return "";
  }

  const _date = new Date(time);
  const o: any = {
    "M+": _date.getMonth() + 1, //月份
    "d+": _date.getDate(), //日
    "h+": _date.getHours() % 12 == 0 ? 12 : _date.getHours() % 12, //小时
    "H+": _date.getHours(), //小时
    "m+": _date.getMinutes(), //分
    "s+": _date.getSeconds(), //秒
    "q+": Math.floor((_date.getMonth() + 3) / 3), //季度
    S: _date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return fmt;
};
