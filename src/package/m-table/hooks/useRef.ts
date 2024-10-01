// _Import 实例下方法
import { reactive, toRefs } from "vue";

export const useRef = (tableRef, colRef, cleanSelectAllOrCancel) => {
  const state = reactive({});

  // _Function Emit 清空选中数据列表
  const clearSelection = () => {
    tableRef?.value?.clearSelection();
    cleanSelectAllOrCancel();
  };

  // _Function 打开表格设置
  const changeColSetting = (value: boolean) => colRef.value.changeColSetting(value);

  return { ...toRefs(state), clearSelection, changeColSetting };
};
