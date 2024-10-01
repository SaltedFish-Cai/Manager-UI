// _Import
import { reactive, toRefs } from "vue";
import { Obj } from "@/package/global";
import inBrowser from "@/package/tools/inBrowser";
import { useBaseStore as globalState } from "@/package/store/index";
import { GetConditionals } from "@/package/api/table";

export const useDictionary = () => {
  // _Var
  const state = reactive({
    seniorFilterOptions: { LineConditional: [] as Obj[], linkOptions: [] as Obj[] },
    seniorFilterData: { visible: false, propItem: {} as Obj }
  });

  const useGlobalState = globalState();
  if (inBrowser && useGlobalState.getTableConfig?.advancedQueryApi) {
    GetDictionaries();
  }

  // _Function 获取高级搜索关系字典
  async function GetDictionaries() {
    const Data = await GetConditionals("link");
    state.seniorFilterOptions.LineConditional = Data.ConditionalType;

    const List = await GetConditionals("group", { keys: "FilterLinkNextType" });
    state.seniorFilterOptions.linkOptions = List.FilterLinkNextType;
  }

  // _Function 设置高级搜索字典（计算类型）
  function setConditionalType(value: string) {
    const { LineConditional } = state.seniorFilterOptions;
    const findData = LineConditional.find(item => item.Value == value);
    return findData?.Description;
  }

  // _Function 设置高级搜索字典（上下关系）
  function setRelationshipGroupLinkType(value: string) {
    const { linkOptions } = state.seniorFilterOptions;
    const findData = linkOptions.find(item => item.Value == value);
    return findData?.Description;
  }

  // _Function 打开高级搜索
  function openSeniorFilter(propItem: Obj) {
    if (propItem) {
      state.seniorFilterData = { visible: true, propItem };
    }
  }

  return {
    ...toRefs(state),
    openSeniorFilter,
    setConditionalType,
    setRelationshipGroupLinkType
  };
};
