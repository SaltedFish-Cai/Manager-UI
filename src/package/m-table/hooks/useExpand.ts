// _Import 表格展开操作
import { ref, nextTick } from "vue";
import inBrowser from "@/package/tools/inBrowser";

export const useExpand = (id, tableRef, emits, rowKey: string = "id", expandAuto) => {
  // _Var
  const expandRowKeys = ref([] as string[]);
  const expandRowVisible = ref([] as boolean[]);
  const empowerWidth = ref("1px");
  const empowerBodyWidth = ref("100%");

  let createInitExpand = true;
  let createInitChildren = true;

  // _Function 初始化ExpandKeys
  function initExpandRowKeys(Data) {
    expandRowKeys.value.length = 0;
    expandRowVisible.value.length = 0;
    Data.map((item: { rowKey: string }) => {
      expandRowKeys.value.push(item[rowKey]);
      if (expandAuto && createInitExpand) {
        expandRowVisible.value.push(true);
      }
    });
    createInitExpand = !(tableRef.value.data?.length > 0);
    setExpandBody();
  }

  // _Function 初始化ChildrenKeys
  function initChildrenRowKeys(Data) {
    expandRowKeys.value.length = 0;
    expandRowVisible.value.length = 0;
    if (expandAuto && createInitChildren) {
      for (let index = 0; index < Data.length; index++) {
        Data[index].childrenVisible = true;
      }
      Data.map(item => {
        expandRowKeys.value.push(item[rowKey]);
        expandRowVisible.value.push(true);
      });
    }
    createInitChildren = !(tableRef.value.data?.length > 0);
  }

  // _Function 设置Expand高度
  function setExpandBody() {
    if (!inBrowser) return;
    nextTick(() => {
      const el = window.document?.getElementById(id);
      empowerBodyWidth.value = el?.clientWidth ? el?.clientWidth + "px" : "auto";
      setTimeout(() => {
        empowerWidth.value = "1px";
      }, 100);
    });
  }

  // _Function 展开/折叠单个Expand
  function setExpandRowKey(index, row, state?: boolean) {
    expandRowVisible.value[index] = state == undefined ? !expandRowVisible.value[index] : !!state;
    if (expandRowVisible.value.indexOf(true) < 0) {
      expandRowVisible.value.length = 0;
    }
    emits("expandRowBack", { index, row });
  }

  // _Function 展开/折叠单个Children
  function setChildrenRowKey(row) {
    row.childrenVisible = !row.childrenVisible;
    const _index = expandRowKeys.value.indexOf(row[rowKey]);
    if (_index > -1) {
      expandRowKeys.value = expandRowKeys.value.filter(item => item != row[rowKey]);
    } else {
      expandRowKeys.value.push(row[rowKey]);
    }

    expandRowVisible.value.length = 0;
    const Data = expandRowKeys.value;
    for (let index = 0; index < Data.length; index++) {
      expandRowVisible.value.push(true);
    }
    // expandRowVisible.value[index] = !expandRowVisible.value[index];
  }

  // _Function 展开/折叠全部Children
  function setChildrenRowKeysAll() {
    if (expandRowVisible.value.length) {
      expandRowVisible.value.length = 0;
      expandRowKeys.value = [];

      const Data = tableRef.value.data;
      for (let index = 0; index < Data.length; index++) {
        Data[index].childrenVisible = false;
      }
    } else {
      const Data = tableRef.value.data;
      for (let index = 0; index < Data.length; index++) {
        Data[index].childrenVisible = true;
        expandRowKeys.value.push(Data[index][rowKey]);
        expandRowVisible.value.push(true);
      }
    }
  }

  // _Function 展开/折叠全部Expand
  function setExpandRowKeysAll(state?: boolean) {
    if (state != undefined) {
      if (!state) {
        expandRowVisible.value = [];
      } else {
        expandRowVisible.value.length = 0;
        tableRef.value.data.map(() => {
          expandRowVisible.value.push(true);
        });
      }
    } else {
      if (expandRowVisible.value.length) {
        expandRowVisible.value = [];
      } else {
        expandRowVisible.value.length = 0;
        tableRef.value.data.map(() => {
          expandRowVisible.value.push(true);
        });
      }
    }

    emits("expandRowAllBack", !!expandRowVisible.value.length);
  }

  return {
    expandRowKeys,
    expandRowVisible,
    empowerWidth,
    empowerBodyWidth,
    setExpandRowKey,
    initExpandRowKeys,
    setChildrenRowKey,
    setExpandRowKeysAll,
    setChildrenRowKeysAll,
    setExpandBody,
    initChildrenRowKeys
  };
};
