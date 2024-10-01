//  _Import
import { computed, nextTick, ref } from "vue";

export const useSelection = (tableRef, rowKey: string = "id", emits, selectTable?: any) => {
  // _Var
  let selectChildMap = {};
  const isTableSelectAll = ref(false);

  // _Computed 当前选中的所有 ids 数组
  const selectedListIds = computed((): string[] => {
    const ids: string[] = [];
    const List = tableRef?.value?.getSelectionRows() || [];
    List.forEach(item => ids.push(item[rowKey]));
    return ids;
  });

  // _Computed 已选中列表数据
  const selectedList = computed(() => {
    return tableRef?.value?.getSelectionRows() || [];
  });

  // _Function 初始化设置单条选中
  function setTableSelected(Data) {
    const selectedList = tableRef?.value?.getSelectionRows() || [];
    selectChildMap = {};
    for (let index = 0; index < Data.length; index++) {
      const row = Data[index];
      if (row?.children?.length > 0) {
        setRow(row, true);
      } else {
        const _index = selectedList.indexOf(row[rowKey]);
        if (_index > -1) {
          row.selected = true;
        } else if (row.selected != undefined) tableRef.value?.toggleRowSelection(row, row.selected);
      }
    }
    return Data;
  }

  // _Error 单行点击勾选
  function handleCellClick(row, column, cell) {
    return;
    if (selectTable && !selectTable(row)) {
      return;
    }
    if (isTableSelectAll.value) return;
    const El = ["el-input", "el-button", "table__expand", "no-click", "el-checkbox"];
    const html = cell?.innerHTML;
    let next = true;
    for (let index = 0; index < El.length; index++) {
      const element = El[index];
      if (html.indexOf(element) >= 0) {
        next = false;
      }
    }
    if (!next) {
      return;
    }
    handleChangeChecked(row);
  }

  // _Function 点击单行勾选
  function handleChangeChecked(row) {
    if (isTableSelectAll.value) return;
    const selected = tableRef.value?.getSelectionRows();
    const isSelected = selected?.findIndex(item => item[rowKey] == row[rowKey]);
    row.selected = isSelected < 0 ? true : false;
    tableRef?.value?.toggleRowSelection(row, row.selected);
    if (row?.children?.length) {
      for (let index = 0; index < row.children.length; index++) {
        const element = row.children[index];
        element.selected = row.selected;
        row.indeterminate = false;
        tableRef?.value?.toggleRowSelection(element, row.selected);
      }
    }
    setSelectAll();
    if (selectChildMap[row[rowKey]]) {
      const parent = tableRef.value.data.find(item => item[rowKey] == selectChildMap[row[rowKey]]);
      setRow(parent, false);
    }
  }

  // _Function 点击全部勾选
  function handleCellClickAll(selection) {
    const selectionMap = selection.map(item => item[rowKey]);
    for (let index = 0; index < tableRef.value.data.length; index++) {
      const row = tableRef.value.data[index];
      const selected = selectionMap.indexOf(row[rowKey]) > -1 ? true : false;
      row.selected = selected;
      row.indeterminate = false;
      tableRef.value!.toggleRowSelection(row, selected);
      if (row?.children && row?.children.length) {
        for (let ind = 0; ind < row.children.length; ind++) {
          const element = row.children[ind];
          element.selected = selected;
          tableRef.value!.toggleRowSelection(element, selected);
        }
      }
    }
    emits("selectRowAllBack", { value: !!selection.length, selection: tableRef.value.data });
  }

  // _Function 点击Radio勾选
  function handleRadioChecked(row) {
    if (isTableSelectAll.value) return;
    tableRef?.value?.clearSelection();
    for (let index = 0; index < tableRef.value.data.length; index++) {
      const element = tableRef.value.data[index];
      element.selected = false;
    }
    row.selected = true;
    tableRef?.value?.toggleRowSelection(row, row.selected);
  }

  // _Function 设置行勾号状态
  function setRow(row, init) {
    const isSelected = getParentSelected(row.children, row, init);
    if (isSelected == "selectedAll") {
      tableRef.value!.toggleRowSelection(row, true);
      row.indeterminate = false;
      row.selected = true;
    } else if (isSelected == "selected") {
      tableRef.value!.toggleRowSelection(row, true);
      row.indeterminate = true;
      row.selected = true;
    } else {
      tableRef.value!.toggleRowSelection(row, false);
      row.indeterminate = false;
      row.selected = false;
    }
    setSelectAll();
    setChildSelected(row.children);
  }

  // _Function 扁平化 tableData
  function flatTableDataFunc(tableData: [], flatArr: any = []) {
    tableData.forEach(async (col: any) => {
      if (col.children?.length) {
        flatArr.push(...flatTableDataFunc(col.children, []));
      }
      flatArr.push(col);
    });
    return flatArr;
  }

  // _Function 设置勾选全部状态
  function setSelectAll() {
    const el = document.querySelector(".el-table__header .el-checkbox__input");

    if (el) {
      nextTick(() => {
        const selected = tableRef.value?.getSelectionRows();
        const selectedMap = selected.map(item => item[rowKey]);
        const flatList = flatTableDataFunc(tableRef.value?.data);
        const flatListMap = flatList.filter(item => selectedMap.indexOf(item[rowKey]) > -1);
        if (flatList.length == flatListMap.length) {
          el.className = "el-checkbox__input is-checked";
        } else if (flatListMap.length > 0 || selectedMap.length > 0) {
          el.className = "el-checkbox__input is-indeterminate";
        } else {
          el.className = "el-checkbox__input";
        }
      });
    }
  }

  // _Function 设置勾选二级选项
  function setChildSelected(children) {
    for (let index = 0; index < children.length; index++) {
      const row = children[index];
      tableRef.value!.toggleRowSelection(row, row.selected || false);
    }
  }

  // _Function 获取一级勾选状态
  function getParentSelected(children, parent, init) {
    const selected = tableRef.value!.getSelectionRows();
    const selectedMap = selected.map(item => item[rowKey]);
    let selectedCount = 0;

    for (let index = 0; index < children.length; index++) {
      const row = children[index];
      if (init) {
        selectChildMap[row[rowKey]] = parent[rowKey];
      }
      if (selectedMap.indexOf(row[rowKey]) > -1 || row.selected == true) {
        selectedCount++;
      }
    }
    if (selectedCount == children.length) {
      return "selectedAll";
    } else if (selectedCount > 0) {
      return "selected";
    } else {
      return "noSelected";
    }
  }

  // _Function 触发选择回调
  function handleChangeBack(selected, row) {
    const index = selected.findIndex(item => item[rowKey] == row[rowKey]);
    row.selected = index > -1 ? true : false;
    if (selectChildMap[row[rowKey]]) {
      const parent = tableRef.value.data.find(item => item[rowKey] == selectChildMap[row[rowKey]]);
      setRow(parent, false);
    }
    emits("selectRowBack", { selected, row });
  }

  // _Function 设置全部 选择/取消
  function handleSelectAllOrCancel() {
    tableRef?.value?.clearSelection();
    setTimeout(() => {
      nextTick(() => {
        // const Row = tableRef?.value?.getSelectionRows();
        isTableSelectAll.value = !isTableSelectAll.value;
      });
    }, 300);
  }

  // _Function 设置清空已勾选内容
  function cleanSelectAllOrCancel() {
    tableRef?.value?.clearSelection();
    setTimeout(() => {
      nextTick(() => {
        // const Row = tableRef?.value?.getSelectionRows();
        isTableSelectAll.value = false;
      });
    }, 300);
  }

  // _Function 获取 全部 选择/取消 状态
  function getSelectAllOrCancel() {
    return isTableSelectAll.value;
  }

  // _Function 设置已经选择数据
  function setSelectedList(data: string[]) {
    cleanSelectAllOrCancel();
    if (tableRef?.value?.data) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const _index = tableRef?.value?.data.findIndex(item => item[rowKey] == element[rowKey]);
        if (_index > -1) {
          handleChangeChecked(tableRef?.value?.data[_index]);
        } else {
          tableRef?.value?.toggleRowSelection(element, true);
        }
      }
    } else {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        tableRef?.value?.toggleRowSelection(element, true);
      }
    }
  }

  return {
    isTableSelectAll,
    selectedList,
    selectedListIds,
    setTableSelected,
    handleCellClick,
    handleChangeChecked,
    handleRadioChecked,
    handleChangeBack,
    handleSelectAllOrCancel,
    cleanSelectAllOrCancel,
    getSelectAllOrCancel,
    handleCellClickAll,
    setSelectedList
  };
};
