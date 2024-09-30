// _Message 表格主方法

import { Ref, reactive, watch, computed, onUnmounted, ref, toRefs, provide, nextTick } from "vue";
import lodashPkg from "lodash";
import { Table, ColumnProps, GlobalState, exRoleType, summaryConfigType } from "../type";
import { handleProp } from "../utils";
import { columnDrop } from "./drag";
import { useBaseStore } from "./store";
import { setTableChild, flatTableDataFunc } from "./utils/index";
import { Obj } from "@/package/global";
import { isSelectType, isTimeType } from "./isType";
import inBrowser from "@/package/tools/inBrowser";

const { cloneDeep, isObject, isEmpty, isUndefined, isNull } = lodashPkg;

export const useTable = (
  tableRef: any,
  id: string,
  rowKey: string,
  api: (params: any, tableId?: string) => Promise<any> | any,
  requestAuto: boolean = true,
  requestError: ((error: any) => void) | undefined,
  showPagination: boolean = true,
  showToolButton: boolean = true,
  exDisabled: any,
  exDisplay: any,
  exRole: Ref<exRoleType>,
  exFunction: any,
  pageNum: number = 1,
  pageSize: number = 20,
  pageSizes: number[] = [20, 50, 100, 150],
  useScrollTop,
  setTableSelected: (data: any) => void,
  getSelectAllOrCancel: any,
  initExpandRowKeys: any,
  setExpandBody: any,
  initChildrenRowKeys: any,
  summaryConfig: summaryConfigType,
  summaryFunction?: (params: any) => string[]
) => {
  // _Var
  const state = reactive<Table.TableStateProps>({
    // 表格数据
    tableData: [],
    // 表格数据
    flatTableData: [],
    // 分页数据
    pageable: {
      // 当前页数
      pageNum,
      // 每页显示条数
      pageSize,
      // 每页选择页数列表
      pageSizes,
      // 总条数
      total: 0
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {},

    tableQuery: { Filter: [], AdvancedFilter: [], Page: {}, Params: {}, Sort: [] },

    tableLoad: true,

    useSelectionTable: false,

    orderProp: ""
  });

  const isShowSearch = ref(false);
  const isSelectionColumn = ref(false);
  const useExpand = ref(false);
  const useChildren = ref(false);
  const renderOptions = [] as string[];

  const dragColumns = ref<ColumnProps[]>([]);
  const tableColumns = ref<ColumnProps[]>([]);
  const settingColumns = ref<ColumnProps[]>([]);
  const searchColumns = ref<ColumnProps[]>();
  const flatColumns = ref<ColumnProps[]>();

  const enumMap = ref(new Map<string, { [key: string]: any }[]>());
  provide("enumMap", enumMap);

  const observeConfig = { childList: true, subtree: false };
  let OperationObserver: any = {};

  // _Computed 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
  const pageParam = computed({
    get: () => {
      return {
        PageNum: state.pageable.pageNum,
        PageSize: state.pageable.pageSize
      };
    },
    set: (newVal: any) => {
      const _window: any = typeof window == "undefined" ? global : window;
      _window.log.info("我是分页更新之后的值", newVal);
    }
  });

  // _Computed 表格比例
  const tableGlobalZoom = computed(() => {
    const globalStore = useBaseStore();
    return globalStore.tableGlobalZoom / 100;
  });
  const scrollObserver = setScrollObserver();
  // _Function 创建更多按钮监听
  function createObserver() {
    OperationObserver?.disconnect && OperationObserver?.disconnect();
    if (inBrowser) {
      scrollObserver.start();
      OperationObserver = new window.MutationObserver(MutationObserverCallback);
      const operation_item = window.document?.querySelectorAll(`#${id} .operation_item`);
      if (operation_item && operation_item.length > 0) {
        for (let index = 0; index < operation_item.length; index++) {
          const element = operation_item[index];
          OperationObserver?.observe && OperationObserver?.observe(element, observeConfig);
        }
        MutationObserverCallback(operation_item);
      }
    }
  }

  function setScrollObserver() {
    let bodyWrapper;
    function setScrollState() {
      // 滚动距离
      const scrollTop = bodyWrapper.scrollTop;
      useScrollTop.value = scrollTop > 10;
    }
    return {
      start: () => {
        bodyWrapper = tableRef.value?.scrollBarRef?.wrapRef;
        if (!bodyWrapper) return;
        bodyWrapper.addEventListener("scroll", setScrollState);
      },
      close: () => {
        bodyWrapper = tableRef.value?.scrollBarRef?.wrapRef;
        if (!bodyWrapper) return;
        bodyWrapper.removeEventListener("scroll", setScrollState);
      }
    };
  }

  // _Function 获取表格数据
  async function getTableList(Query?: any) {
    const globalStore = useBaseStore();
    try {
      state.tableLoad = true;
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, showPagination ? pageParam.value : {});
      // let { data } = await api({ ...state.searchInitParam, ...state.totalParam });
      const _query = {
        ...state.tableQuery,
        Page: {
          ...state.totalParam
        },
        ...Query
      };
      state.tableQuery = _query;
      renderOptions.length = 0;

      // _Error 设置配置表是否使用了高级搜索
      // const baseDataName = state.tableQuery.AdvancedFilter.map(item => item.fieldName);
      // const _settingColumns = JSON.parse(JSON.stringify(settingColumns.value));
      // const newCol = _settingColumns.map(item => {
      //   const useSenior = baseDataName.indexOf(item.prop) < 0 ? false : true;
      //   return { ...item, useSenior };
      // });
      // settingColumns.value = newCol;

      const { Data } = await api(_query, id);
      // tableRef?.value?.scrollTo(0, 0);

      // const deepData = lodash.cloneDeep(Data);
      const deepData = Data;

      let _data = showPagination ? deepData.List || deepData : deepData;
      _data = setTableChild(_data);
      _data = setTableSelected(_data);
      state.tableData = _data;

      const flatList = flatTableDataFunc(_data);
      state.flatTableData = flatList;

      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      showPagination && updatePageable({ total: deepData.TotalCount });
      state.tableLoad = false;

      if (getSelectAllOrCancel()) {
        tableRef?.value?.clearSelection();
        tableRef?.value?.toggleAllSelection();
      }

      // >-------------> 设置ExpandRowKey <------------<
      if (useExpand.value) initExpandRowKeys(state.tableData);
      if (useChildren.value) initChildrenRowKeys(state.tableData);

      // >-------------> 设置列宽 <------------<
      setTimeout(() => {
        createObserver();
        if (globalStore.isAutoTableWidth) {
          setTableCellWidth();
        }
      }, 40);
    } catch (error) {
      state.tableLoad = false;
      requestError && requestError(error);
    }
  }

  // _Function 设置(操作)自动宽度
  function MutationObserverCallback(mutationsList) {
    if (!mutationsList.length) return;
    let width = 0;

    const operation_item = window.document?.querySelectorAll(`#${id} .operation_item`);
    if (operation_item && operation_item.length > 0) {
      for (let index = 0; index < operation_item.length; index++) {
        const target = operation_item[index];
        const targetRect = target.getBoundingClientRect();
        if (targetRect.width > width) width = targetRect.width;
      }

      const filterIndex = tableColumns.value.findIndex(item => item.prop == "operation");
      if (filterIndex >= 0) {
        if (!width || width < 20) {
          tableColumns.value[filterIndex].width = 1;
        } else {
          tableColumns.value[filterIndex].width = width + 3;
        }
      }
    }

    // if (mutationsList.length) {
    //   setTimeout(() => {
    //     for (const mutation of mutationsList) {
    //       const target = mutation.target ? mutation.target : mutation;
    //       console.dir(target);
    //       const targetRect = target.getBoundingClientRect();
    //       console.log("++++++++++> targetRect:", targetRect);
    //       if (targetRect.width > width) width = targetRect.width;
    //     }

    //     const filterIndex = tableColumns.value.findIndex(item => item.prop == "operation");
    //     if (filterIndex >= 0) {
    //       if (!width || width < 20) {
    //         tableColumns.value[filterIndex].width = 1;
    //       } else {
    //         tableColumns.value[filterIndex].width = width + 3;
    //       }
    //     }
    //   }, 0);
    // }
  }

  // _Vue onUnmounted
  onUnmounted(() => {
    OperationObserver?.disconnect && OperationObserver?.disconnect();
    scrollObserver.close();
  });

  // _Function 设置(全表)自动宽度
  function setTableCellWidth() {
    nextTick(() => {
      const exOut = ["selection", "radio", "index", "expand", "row", "operation"];
      const columns = tableColumns.value.filter((item: any) => exOut.indexOf(item.prop) < 0);
      for (let index = 0; index < columns.length; index++) {
        const cell = columns[index];
        const _window: any = typeof window == "undefined" ? global : window;
        const cell_elements = _window.document?.querySelectorAll(`#${id} .find-class-${cell.prop}`);
        if (cell_elements.length > 0) {
          let parentWidth = 0;
          let set = false;
          for (let index = 0; index < cell_elements.length; index++) {
            const el: any = cell_elements[index];
            const parentEl: any = el.parentElement;
            parentWidth = Number(parentEl?.clientWidth) > parentWidth ? Number(parentEl?.clientWidth) : parentWidth;
            const offsetWidth = Number(el?.offsetWidth) + 40;
            if (offsetWidth > parentWidth) {
              parentWidth = offsetWidth;
              set = true;
            }
          }
          const filterIndex = tableColumns.value.findIndex(item => item.prop == cell.prop);
          if (filterIndex >= 0 && set) {
            tableColumns.value[filterIndex].width = parentWidth;
          } else {
            tableColumns.value[filterIndex].width = tableColumns.value[filterIndex].width || undefined;
          }
        }
      }
    });
  }

  // _Function 重置表列宽
  function reSizeWidth() {
    const globalStore = useBaseStore();
    createObserver();
    if (globalStore.isAutoTableWidth) {
      setTableCellWidth();
    }
  }

  // _Function 手动插入(全表)数据
  function setTableList(List: Obj[]) {
    // const deepData = lodash.cloneDeep(List);
    const deepData = List;
    state.tableData = deepData;
    showPagination && updatePageable({ total: deepData.length });
    createObserver();
  }

  // _Function 手动插入(单条)是数据
  function setTableRow(id: string, data: Obj) {
    const deepData = cloneDeep(data);
    const tableData = tableRef.value.data;
    for (let index = 0; index < tableData.length; index++) {
      const _data = tableData[index];
      if (_data[rowKey] == id) {
        state.tableData[index] = deepData;
      }
    }
    createObserver();
  }

  // _Function 设置枚举字典
  async function setEnumMap(col: ColumnProps) {
    if (!col.enum) return;
    // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
    if (typeof col.enum !== "function") return enumMap.value.set(col.prop!, col.enum!);
    const { data } = await col.enum();
    enumMap.value.set(col.prop!, data);
  }

  // _Function 设置外置枚举字段
  function setExOptionEnumMap(data: Obj) {
    for (const key in data) {
      if (Array.isArray(data[key])) {
        enumMap.value.set(key, data[key]);
      } else {
        const _data: { label: string; value: string }[] = [];
        const item = data[key];
        _data.push({
          label: item.activeText || "on",
          value: item.activeValue || "true"
        });
        _data.push({
          label: item.inActiveText || "off",
          value: item.inActiveValue || "false"
        });
        enumMap.value.set(key, _data);
      }
    }
  }

  // _Function 初始化 表结构数据
  function initColumns(data) {
    tableColumns.value = data;
    nextTick(() => {
      handleChangeDragEl("table");
      initTableColumns();
    });

    // flatColumns
    flatColumns.value = flatColumnsFunc(tableColumns.value);

    // 过滤需要搜索的配置项
    const _searchColumns = flatColumns.value.filter(item => item.search?.el);

    // 设置搜索表单排序默认值 && 设置搜索表单项的默认值
    _searchColumns.forEach((column, index) => {
      column.search!.order = column.search!.order ?? index + 2;
      if (column.search?.defaultValue !== undefined && column.search?.defaultValue !== null) {
        state.searchInitParam[column.search.key ?? handleProp(column.prop!)] = column.search?.defaultValue;
        state.searchParam[column.search.key ?? handleProp(column.prop!)] = column.search?.defaultValue;
      }
    });

    // 排序搜索表单项
    _searchColumns.sort((a, b) => a.search!.order! - b.search!.order!);
    isShowSearch.value = _searchColumns.length > 0 ? true : false;
    searchColumns.value = _searchColumns;
  }

  // _Function 变更拖拽对象顺序
  function handleChangeDragSort(data) {
    const dataMap = data.map(item => item.prop);
    dragColumns.value.sort((a, b) => dataMap.indexOf(a.prop) - dataMap.indexOf(b.prop));
  }

  // _Function 变更拖拽对象目标
  function handleChangeDragEl(el: "col" | "table") {
    setTimeout(() => {
      dragColumns.value = columnDrop(id, dragColumns.value, el, tableColumns.value);
    }, 1000);
  }

  // _Function 初始化Columns表格结构
  function initTableColumns() {
    // const tableBody = document.getElementById(String(id));
    // const clientWidth = tableBody?.clientWidth || 0;
    const data = JSON.parse(JSON.stringify(tableColumns.value));
    // let maxWidth = 0;
    // let maxItem = data.length;
    const tableWidthStore = useBaseStore();
    const globalStore = useBaseStore();

    const tableWidth = tableWidthStore.getTableWidth(id);
    const keys = Object.keys(tableWidth);
    if (keys.length != data.length) {
      tableWidthStore.removeTableWidth(id);
    }

    const exOut = ["selection", "radio", "index", "expand", "row", "operation"];

    const lastKey = data.filter(item => exOut.indexOf(item.prop) < 0);
    const lastKeyProp = lastKey.length > 0 ? lastKey[lastKey.length - 1].prop : "";
    const _obj: Obj = {};
    data.map(item => {
      if (item.type == "selection" || item.type == "radio") {
        state.useSelectionTable = true;
      }
      if (item.type == "row") {
        useChildren.value = true;
      } else if (item.type == "expand") {
        useExpand.value = true;
      }

      if (item.prop == "operation") {
        item.fixed = "right";
        if (item?.size) {
          item.width = 22;
          item.width += item?.size * 107;
          item.width += item?.size ? (item?.size - 1) * 10 : 0;
        } else if (item?.width) {
          item.width = item.width;
        } else {
          item.width = 1;
        }
      }

      if (tableWidth[item.prop] && tableWidth[item.prop] > 0 && item.prop != lastKeyProp) {
        item.width = tableWidth[item.prop];
      } else {
        tableWidth[item.prop] = 0;
      }
      _obj[item.prop] = item.width;
    });

    if (globalStore.isKeepAliveTableWidth) tableWidthStore.setTableWidth(id, _obj);
    tableColumns.value = setTableFixed(data);
    initColSettingValue();

    if (!requestAuto) {
      state.tableLoad = false;
      return;
    }
    getTableList();
  }

  // _Function 初始化 表结构数据默认值
  function initColSettingValue() {
    const _config = tableColumns.value;
    settingColumns.value = _config!.filter((item: any) => {
      // item.sortable = item.useSort == false ? false : true;
      if (item.type == "selection") {
        isSelectionColumn.value = true;
        if (rowKey == "id" && inBrowser) {
          window.log.error("来自 ProTable：当前表单结果使用多选，请配置row-key");
        }
      }

      if (!showToolButton) {
        item.sortable = false;
      }

      if (isTimeType(item, true) || isSelectType(item, true)) {
        item.searchCriteria = [];
      } else {
        item.searchCriteria = "";
      }

      const exOut = ["selection", "radio", "index", "expand", "row", "operation"];
      if (exOut.indexOf(item.prop) > -1) {
        item.useSort = false;
        item.useFilter = false;
      }
      // return !exOut.includes(item.type!) && item.prop !== "operation" && item.useFilter !== false;
      return !exOut.includes(item.type!) && item.prop !== "operation";
    });
    dragColumns.value = cloneDeep(settingColumns.value);
  }

  // _Function 设置 表固定列
  function setTableFixed(array) {
    const leftFixed: any = [];
    const rightFixed: any = [];
    const noFixed: any = [];

    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.isShow) {
        if (element.fixed && element.fixed == "left") {
          leftFixed.push(element);
        } else if (element.fixed && element.fixed == "right") {
          rightFixed.push(element);
        } else {
          noFixed.push(element);
        }
      }
    }
    const List = [...leftFixed, ...noFixed, ...rightFixed];
    return List;
  }

  // _Function 回调 设置 表格结构
  function callbackColSetting(its: { label?: string; props?: string; relValue?: string }, all?: boolean, index?: number) {
    settingColumns.value = settingColumns.value?.map((item: Obj) => {
      if (all) {
        return { ...item, searchCriteria: isSelectType(item, true) || isTimeType(item, true) ? [] : "" };
      } else if (its.props == item.prop) {
        if (isSelectType(item, true)) {
          item.searchCriteria = item.searchCriteria.map(item => String(item));
          const _index = item.searchCriteria.indexOf(String(its.relValue));
          item.searchCriteria.splice(_index, 1);
          return { ...item };
        } else if (isTimeType(item, true)) {
          item.searchCriteria[Number(index)] = "";
          return item;
        } else {
          return { ...item, searchCriteria: "" };
        }
      } else {
        return item;
      }
    });
  }

  // _Function 保存 表格结构
  function handleColSetting({ Filter, Col }) {
    if (Col) {
      handleCloseDrawer({ Col });
      const _filters = Filter.filter(item => String(item.fieldValue)?.length);
      for (let index = 0; index < _filters.length; index++) {
        const element = _filters[index];
        state.tableQuery.AdvancedFilter = state.tableQuery.AdvancedFilter.filter(item => {
          return item.fieldName != element.fieldName;
        });
      }
    } else {
      for (let index = 0; index < Filter.length; index++) {
        const element = Filter[index];

        state.tableQuery.AdvancedFilter = state.tableQuery.AdvancedFilter.filter(item => item.fieldName != element.fieldName);

        const Col: any = settingColumns.value;
        const findIndex = Col.findIndex(item => item.prop == element.fieldName);
        if (findIndex > -1) {
          if (isTimeType(Col[findIndex], true)) {
            Col[findIndex].searchCriteria[element.conditionalType == 3 ? 0 : 1] = element.fieldValue.split(" ")[0];
          } else {
            Col[findIndex].searchCriteria = isSelectType(Col[findIndex], true)
              ? element.fieldValue.split(",")
              : element.fieldValue;
          }
        }
      }
    }

    getTableList({ Filter });
  }

  // _Function 设置表结构(是否显示列,左对齐右对齐)
  function handleCloseDrawer({ Col }) {
    const _config = tableColumns.value;
    const tableMap = _config.map(item => item.prop);
    const _startIndex = _config.findIndex(
      item =>
        item.type != "selection" && item.type != "radio" && item.type != "expand" && item.type != "index" && item.type != "row"
    );

    for (let _index = 0; _index < Col.length; _index++) {
      const col = Col[_index];
      if (tableMap.indexOf(col.prop) < 0) {
        _config.splice(_startIndex + _index, 0, col);
      }
    }
    for (let index = 0; index < _config.length; index++) {
      const element = _config[index];
      for (let _index = 0; _index < Col.length; _index++) {
        const col = Col[_index];
        if (element?.prop == col?.prop) {
          _config[index] = col;
        }
      }
    }

    tableColumns.value = setTableFixed(_config);
    // setTimeout(() => {
    //   tableColumns.value = columnDrop(id || "default-table", tableColumns.value);
    // }, 1000);
  }

  // _Function  扁平化 columns
  function flatColumnsFunc(columns: ColumnProps[], flatArr: ColumnProps[] = []) {
    columns.forEach(async col => {
      if (col.childrenColumn?.length) flatArr.push(...flatColumnsFunc(col.childrenColumn));
      flatArr.push(col);

      // 给每一项 column 添加 isShow && isFilterEnum 默认属性
      col.isShow = col.isShow ?? true;
      // col.isFilterEnum = col.isFilterEnum ?? true;

      // 设置 enumMap
      setEnumMap(col);
    });
    return flatArr.filter(item => !item.childrenColumn?.length);
  }

  // _Function 排序更改
  function handleSortChange({ prop, order }: { prop: string; order: "ascending" | "descending" | null }) {
    state.orderProp = prop;
    const Sort = [{ SortKey: prop, SortValue: order }];
    // if (state.useSelectionTable) {
    //   return;
    // }
    getTableList(order ? { Sort } : { Sort: [] });
  }

  // _Function 更新查询参数
  function updatedTotalParam() {
    state.totalParam = {};
    // 处理查询参数，可以给查询参数加自定义前缀操作
    const nowSearchParam: { [key: string]: any } = {};
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (const key in state.searchParam) {
      // * 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    Object.assign(state.totalParam, nowSearchParam, showPagination ? pageParam.value : {});
  }

  // _Function  更新分页信息
  function updatePageable(resPageable: Table.Pageable) {
    Object.assign(state.pageable, resPageable);
  }

  // _Function 表格数据查询
  function searchAction() {
    state.pageable.pageNum = 1;
    updatedTotalParam();
    getTableList();
  }

  // _Function 表格数据重置
  function searchReset() {
    state.pageable.pageNum = 1;
    state.searchParam = {};
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    Object.keys(state.searchInitParam).forEach(key => {
      state.searchParam[key] = state.searchInitParam[key];
    });
    updatedTotalParam();
    getTableList();
  }

  // _Function 每页条数改变
  function handleSizeChange(val: number) {
    state.pageable.pageNum = 1;
    state.pageable.pageSize = val;
    getTableList();
  }

  // _Function 当前页改变
  function handleCurrentChange(val: number) {
    state.pageable.pageNum = val;
    getTableList();
  }

  // _Function 校验表格填写数据并返回
  function getSubmitTableList() {
    const cellConfig = {} as Obj;
    const cellConfigKeys = {} as Obj;
    tableColumns.value.map(item => {
      cellConfigKeys[String(item.prop)] = String(item.label);
      if (item.cellConfig) {
        if (item.cellConfig?.required == false || item.cellConfig?.display == true) {
          cellConfig[String(item.prop)] = false;
        } else {
          cellConfig[String(item.prop)] = {
            is: true,
            prop: item?.cellConfig?.type
          };
        }
      }
    });
    let success = true;
    // const errorConfigList = [] as string[];
    // let exRoleMessage = "";
    for (let index = 0; index < state.tableData.length; index++) {
      const element = state.tableData[index];
      const errorMessage = {};
      for (const key in cellConfig) {
        if (!!cellConfig[key].is) {
          if (exRole.value[key]) {
            const Role = exRole.value[key];
            const isTrue = Role?.roleFn(element, key);
            if (isTrue != true) {
              success = false;
              errorMessage[key] = Role?.errorMessage ? Role?.errorMessage : String(isTrue);
            }
          } else if (
            cellConfig[key].prop != "tag" &&
            !(exDisabled && exDisabled.value && exDisabled.value[key] && exDisabled.value[key](element)) &&
            (isObject(element[key])
              ? isEmpty(element[key])
              : !String(isNull(element[key]) || isUndefined(element[key]) ? "" : element[key]))
          ) {
            success = false;
            errorMessage[key] = "必填项";
          }
        }
      }

      state.tableData[index] = {
        ...element,
        errorMessage
      };
    }
    if (success) {
      const tableData = cloneDeep(state.tableData);
      const outData = tableData.map(item => {
        delete item.cellConfig;
        delete item.children;
        delete item.tableState;
        delete item.errorMessage;
        return item;
      });
      return outData;
    } else {
      return false;
    }
  }

  // _Function 设置单条数据状态
  function setListState(list: Obj[], key: string, tableKey?: string) {
    if (!key) {
      return window.log.error("来自 ProTable：设置错误，设置单条数据状态，必须设置key");
    }
    const KeyList = list.map(item => item[key]);
    const _tableData = state.tableData.map(item => {
      if (KeyList.indexOf(item[tableKey || key]) > -1) {
        item.tableState = "error";
      } else {
        item.tableState = "normal";
      }
      return item;
    });
    state.tableData = _tableData;
  }

  // _Function 表头列宽更改回调
  function handleHeaderDragend(newWidth, oldWidth, column) {
    const globalStore = useBaseStore();
    if (!globalStore.isKeepAliveTableWidth) return;

    const tableWidthStore = useBaseStore();
    const tableWidth = tableWidthStore.getTableWidth(id);
    tableWidth[column.property] = newWidth;
    tableWidthStore.setTableWidth(id, tableWidth);
  }

  // _Function 异步请求接口获取表下拉参数数据
  async function remoteMethod(query, prop, item, row, once?: boolean) {
    if (JSON.stringify(row) == "{}") return;
    if (once && rowKey == "id") {
      window.log.warning("使用request-select时必须填写rowKey");
      return;
    }
    if (once) {
      const _k = row[rowKey] + "-" + prop;
      if (renderOptions.indexOf(_k) > -1) return;
      renderOptions.push(_k);
    }
    const FN = exFunction && exFunction.value && exFunction.value[prop];
    if (FN) {
      if (query.length <= 0 && (item.type == "online-select" || item.type == "multiple-online-select")) {
        return;
      }
      if (!row?.cellConfig) {
        row.cellConfig = { options: {} };
      }
      if (!row.cellConfig.options?.[prop]) {
        row.cellConfig.options[prop] = [];
        return;
      }
      const Options = await FN({ query, row });
      row.cellConfig.options[prop] = Options;
    } else {
      window.log.warning("使用online-select/request-select时，必须配置exFunction且内部包含对应的prop");
    }
  }

  // _Function 表格内下拉框请求在线选项
  function onlineSelectChange(prop, row) {
    const columns = tableColumns.value;
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (item?.cellConfig?.requestBy && !Array.isArray(item?.cellConfig?.requestBy)) {
        if (item?.cellConfig?.requestBy == prop) {
          const _k = row[rowKey] + "-" + item.prop;
          const _index = renderOptions.indexOf(_k);
          if (_index > -1) {
            renderOptions.splice(_index, 1);
            remoteMethod("", item.prop, item, row, true);
          }
        }
      } else {
        if (item?.cellConfig?.requestBy && item?.cellConfig?.requestBy.indexOf(prop) > -1) {
          const _k = row[rowKey] + item.prop;
          const _index = renderOptions.indexOf(_k);
          if (_index > -1) {
            renderOptions.splice(_index, 1);
            remoteMethod("", item.prop, item, row, true);
          }
        }
      }
    }
  }

  // _Function 表格底部尾行方法
  function getSummaries(param) {
    if (summaryFunction) return summaryFunction(param);

    const { columns, data } = param;
    const sums: string[] = [];
    const exText = "";
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = summaryConfig.sumText || "合计";
        return;
      }

      const findCol = tableColumns.value.find(item => item.prop == column.property);
      if (findCol?.useSum == false) {
        return (sums[index] = exText);
      }
      const values = data.map(item => Number(item[column.property]));
      if (!values.every(value => Number.isNaN(value))) {
        sums[index] = `${values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!Number.isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0)}`;
        sums[index] = Number(sums[index])?.toLocaleString("en-US") + summaryConfig.unitText;
      } else {
        sums[index] = exText;
      }
    });

    return sums;
  }

  // _Function 表格尺寸变更回调
  function tableResize() {
    setExpandBody();
  }

  // _Function 获取表全局配置
  function getGlobalConfig() {
    const { isKeepAliveTableWidth, isAutoTableWidth, isTableTextCopy, tableGlobalZoom } = useBaseStore();
    return {
      isKeepAliveTableWidth,
      isAutoTableWidth,
      isTableTextCopy,
      tableGlobalZoom
    };
  }

  // _Function 设置表全局配置
  function setGlobalConfig(config: GlobalState) {
    const globalStore = useBaseStore();
    globalStore.setGlobalConfig(config);
  }

  // _Watch dragColumns
  watch(
    () => dragColumns.value,
    data => {
      const dataMap = data.map(item => item.prop);
      tableColumns.value.sort((a, b) => dataMap.indexOf(a.prop) - dataMap.indexOf(b.prop));
      tableColumns.value.sort((a, b) => String(a.prop)?.indexOf("operation") - String(b.prop)?.indexOf("operation"));

      settingColumns.value.sort((a, b) => dataMap.indexOf(a.prop) - dataMap.indexOf(b.prop));
    },
    { deep: true, immediate: true }
  );

  return {
    ...toRefs(state),
    enumMap,

    tableGlobalZoom,

    initColumns,
    createObserver,
    tableColumns,
    settingColumns,
    searchColumns,
    flatColumns,

    isShowSearch,
    isSelectionColumn,
    isExpand: useExpand,
    isChildren: useChildren,

    getTableList,

    getSubmitTableList,

    setTableList,
    setTableRow,
    setListState,
    setExOptionEnumMap,

    searchAction,
    searchReset,

    handleSizeChange,
    handleCurrentChange,
    handleSortChange,

    reSizeWidth,

    handleCloseDrawer,
    handleColSetting,
    handleChangeDragEl,
    handleChangeDragSort,
    handleHeaderDragend,

    remoteMethod,
    onlineSelectChange,
    getSummaries,

    callbackColSetting,

    getGlobalConfig,
    setGlobalConfig,
    tableResize
  };
};
