import { TableProps } from "element-plus";
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";

import { mOptionType } from "@/package/global";

import { MElementInputType } from "@/package/m-elements/input/index";
import { MElementNumberType } from "@/package/m-elements/number/index";
import { MElementSelectType, MElementRequestSelectType, MElementOnlineSelectType } from "@/package/m-elements/select/index";
import { MElementSwitchType } from "@/package/m-elements/switch/index";
import { MElementRadioType } from "@/package/m-elements/radio/index";
import { MElementCheckBoxType } from "@/package/m-elements/checkbox/index";
import { MElementCascaderType } from "@/package/m-elements/cascader/index";
import { MElementDateType } from "@/package/m-elements/time/index";
import { MElementIconType } from "@/package/m-elements/icon/index";
import { MElementTagType } from "@/package/m-elements/tag/index";
import { MElementFileType } from "@/package/m-elements/file/index";

import { Obj } from "@/package/global";

export type summaryConfigType = {
  sumText?: string; // 合计文字
  unitText?: string; // 单位文字
};

export interface MTableType extends Partial<Omit<TableProps<any>, "data">> {
  id: string; // 表格id，同页面存在多个表格时填写，否则会导致表格推拽失效
  structure: ColumnProps[]; // 列配置项
  requestApi: (params: any, id?: string) => Promise<any> | any; // 请求表格数据的 api
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
  expandAuto?: boolean; // 是否直接打开Expand ==> 非必传（默认为true）
  requestError?: (params: any, id?: string) => void; // 表格 api 请求错误监听 ==> 非必传
  flat?: boolean; // 扁平页面 不使用 class:card
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  showToolButton?: boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
  showPagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  showExpandAll?: boolean; // 是否显示展开全部按钮 ==> 非必传（默认为true）
  showSelectAll?: boolean; // 显示全选按钮（非表自带，使用 getSelectAllOrCancel 获取结果）
  showSummary?: boolean; // 是否显示尾行 ==> false
  showTableIndex?: boolean; // 是否显示表格序号
  showOverflowTooltip?: boolean; // 是否使用超出格子使用tooltip
  embeddedToolButton?: boolean; // 是否显示表格功能按钮嵌入式样式 ==> false
  exOptions?: mOptionType; // 外置异步筛选用 选项值,
  exDependent?: {
    requestFunction?: object | {};
    disabledRule?: object | {};
    displayRule?: object | {};
    submitRule?: exRoleType;
    inputParser?: object | {};
    inputFormatter?: object | {};
    targetTag?: object | {};
    fileData?: object | {};
  }; // 外置依赖,
  exPagination?: {
    pageNum?: number; // 外置页数
    pageSize?: number; // 外置单页条数
    pageSizes?: number[]; //外置分页可选列表
    layout?: string;
    pagerCount?: number;
  };
  searchSpan?: 1 | 2 | 3 | 4; // 表格搜索项 每列占比配置
  exportApi?: (params: any) => Promise<any> | any;
  filterSelectRow?: (params: any) => Promise<any> | any;
  display?: boolean;
  operationSize?: number; // 操作内元素最大显示数量，超出放置到更多按钮
  summaryConfig?: summaryConfigType; // 合计参数
  summaryFunction?: (params: any) => string[]; // 合计方法
}

type MElementNumberTypeIn = MElementNumberType & { maxBy?: string; minBy?: string };
export type CellItemType = StrictUnion<
  | MElementCascaderType
  | MElementCheckBoxType
  | MElementDateType
  | MElementFileType
  | MElementIconType
  | MElementInputType
  | MElementNumberTypeIn
  | MElementOnlineSelectType
  | MElementRadioType
  | MElementRequestSelectType
  | MElementSelectType
  | MElementSwitchType
  | MElementTagType
>;

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

export interface EnumProps {
  label: string; // 选项框显示的文字
  value: any; // 选项框值
  disabled?: boolean; // 是否禁用此选项
  tagType?: string; // 当 tag 为 true 时，此选择会指定 tag 显示类型
  children?: EnumProps[]; // 为树形选择时，可以通过 children 属性指定子选项
  [key: string]: any;
}

export type TypeProps = "expand" | "index" | "radio" | "selection";

export type SearchType =
  | "cascader"
  | "date-picker"
  | "input-number"
  | "input"
  | "select-v2"
  | "select"
  | "slider"
  | "switch"
  | "time-picker"
  | "time-select"
  | "tree-select";

export type SearchProps = {
  el: SearchType; // 当前项搜索框的类型
  props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
  key?: string; // 当搜索项 key 不为 prop 属性时，可通过 key 指定
  order?: number; // 搜索项排序（从大到小）
  span?: number; // 搜索项所占用的列数，默认为1列
  offset?: number; // 搜索字段左侧偏移列数
  defaultValue?: any[] | boolean | number | string; // 搜索项默认值
};

export type FieldNamesProps = {
  label: string;
  value: string;
  children?: string;
};

export interface ColumnProps<T = any> extends Partial<Omit<TableColumnCtx<T>, "children" | "renderCell" | "renderHeader">> {
  tag?: boolean; // 是否是标签展示
  isShow?: boolean; // 是否显示在表格当中
  useSort?: boolean; // 是否使用排序
  useFilter?: boolean; // 是否使用筛选
  useTag?: boolean; // 是否使用标签
  search?: SearchProps | undefined; // 搜索项配置
  enum?: EnumProps[] | ((params?: any) => Promise<any>); // 枚举类型（字典）
  isFilterEnum?: boolean; // 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据）(废弃)
  filterType?: "input" | "number" | "select" | "time"; // 当前筛选 显示类型
  fieldNames?: FieldNamesProps; // 指定 label && value && children 的 key 值
  headerRender?: (row: ColumnProps) => any; // 自定义表头内容渲染（tsx语法）
  render?: (scope: { row: T }) => any; // 自定义单元格内容渲染（tsx语法）
  childrenColumn?: ColumnProps<T>[]; // 多级表头
  textWarp?: string; // 单元格是否进行拆分折行
  cellConfig?: CellItemType & {
    required?: boolean;
    size?: "default" | "large" | "small";
  };
  useSum?: boolean; // 列是否使用合计
  useSenior?: boolean; // 该单元是否使用高级搜索
  searchCriteria?: string; // 搜索值
  textSpill?: boolean; // 单元格文字溢出 当true时 不使用tooltip
}

export type Responsive = {
  span?: number;
  offset?: number;
};

export interface GlobalState {
  isKeepAliveTableWidth: boolean;
  isAutoTableWidth: boolean;
  isTableTextCopy: boolean;
  tableGlobalZoom: number;
  tableWidth: Obj;
}

export type exRoleType = { [x: string]: { roleFn: (element: Obj, key?: string) => any; errorMessage?: string } };

export type SettingPropsType = {
  id: string;
  size: "default" | "small";
  settingColumns: ColumnProps[];
  exOptions?: any;
  display: boolean;
};

export type HeaderItemType = {
  id: string;
  item: Obj;
  length: number;
  exOptions: {};
  tableRef: any;
  orderProp: string;
  listeners: any;
  tableQuery: Obj;
  size: "default" | "small";
};

export interface PaginationPropsType {
  pageable: Pageable;
  exPagination: {
    layout?: string;
    pagerCount?: number;
  };
  useFooterCenter: boolean;
  handleSizeChange: (size: number) => void;
  handleCurrentChange: (currentPage: number) => void;
}

export interface SearchFormItem {
  column: ColumnProps;
  searchParam: { [key: string]: any };
}

export interface MTableSearchType {
  id: string;
  columns?: ColumnProps[]; // 搜索配置列
  searchParam?: { [key: string]: any }; // 搜索参数
  searchSpan?: 1 | 2 | 3 | 4;
  search: (params: any) => void; // 搜索方法
  searchReset: (params: any) => void; // 重置方法
  flat?: boolean;
}

export interface ProTablePropsType {
  columns: FormItemType[]; // 列配置项
  flat?: boolean; // 扁平页面 不使用 class:card
  exOptions?: any; // 外置异步筛选用 选项值,
}

export type SeniorFilterPropsType = {
  modelValue: boolean;
  propItem: Obj;
  settingColumns: any;
  seniorFilterOptions: { LineConditional: Obj[]; linkOptions: Obj[] };
  tableQuery: Obj;
};

export type TableColumnPropsType = {
  id: string;
  column: ColumnProps;
  length: number;
  exOptions: {};
  tableRef: any;
  orderProp: string;
  listeners: any;
  exTargetTag: {};
  size?: "default" | "large" | "small";
  tableQuery: Obj;
  showOverflowTooltip: boolean;
  operationSize: number;
};

export type TableColumnFilterType = { item: Obj; id: string; data: Obj; exOptions?: any; size?: "default" | "large" | "small" };

export namespace Table {
  export interface Pageable {
    pageNum?: number;
    pageSize?: number;
    pageSizes?: number[];
    total: number;
  }
  export interface TableStateProps {
    tableData: any[];
    flatTableData: any[];
    pageable: Pageable;
    searchParam: {
      [key: string]: any;
    };
    searchInitParam: {
      [key: string]: any;
    };
    totalParam: {
      [key: string]: any;
    };
    icon?: {
      [key: string]: any;
    };
    tableQuery: {
      [key: string]: any;
    };

    tableLoad: boolean;

    useSelectionTable: boolean;

    orderProp: string;
  }
}

export namespace HandleData {
  export type MessageType = "" | "error" | "info" | "success" | "warning";
}

export namespace Theme {
  export type GreyOrWeakType = "grey" | "weak";
}
