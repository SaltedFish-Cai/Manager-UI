// _Import
import MButton from "./m-button/m-button.vue";
import MDialog from "./m-dialog/m-dialog.vue";
import MForm from "./m-form/m-form.vue";
import MIcon from "./m-icon/m-icon.vue";
import MTable from "./m-table/m-table.vue";
import MInput from "./m-input/m-input.vue";
import MNumber from "./m-number/m-number.vue";
import MScrollBar from "./m-scrollbar/m-scrollbar.vue";

import { FormItemType, ChildItemType } from "./m-form/type";
import { OptionsTypes, SelectOptionsTypes, TagOptionsTypes } from "./typings/cell-options";
import { ColumnProps, GlobalState } from "./m-table/type";
import { MInputType as InputType } from "./m-input/type";
import { MNumberInputType as NumberInputType } from "./m-number/type";

import { useBaseStore as globalState } from "./store/index";
import { useBaseStore as tableBaseStore } from "./m-table/hooks/store";

// _Message global
declare module "vue" {
  interface GlobalComponents {
    MButton: typeof MButton;
    MDialog: typeof MDialog;
    MForm: typeof MForm;
    MIcon: typeof MIcon;
    MTable: typeof MTable;
    MInput: typeof MInput;
    MNumber: typeof MNumber;
    MScrollBar: typeof MScrollBar;
  }
}

export type mFormStructureType = FormItemType;
export type mChildStructureType = ChildItemType;
export type mTableStructureType = ColumnProps;
export type mOptionType = OptionsTypes;
export type mSelectOptionType = SelectOptionsTypes;
export type mTagOptionType = TagOptionsTypes;
export type MInputType = InputType;
export type MNumberInputType = NumberInputType;

// type UnionKeys<T> = T extends T ? keyof T : never;
// type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
// type StrictUnion<T> = StrictUnionHelper<T, T>;

export type Obj = {
  [x: string]: any;
};

declare global {
  interface Window {
    log: {
      info: (title: string, message?: any) => any;
      error: (title: string, message?: any) => any;
      warning: (title: string, message?: any) => any;
      success: (title: string, message?: any) => any;
      msg: (title: string, message?: any) => any;
    };
    Sortable: any;
    wangEditor: any;
    MTableSortableData: {};
    setManagerTheme: (themeColor: string, isDark: boolean) => void;
    setManagerThemeDark: (val: any) => void;
    setManagerTableGlobalConfig: (config: GlobalState) => void;
    getManagerTableGlobalConfig: () => {
      isKeepAliveTableWidth: boolean;
      isAutoTableWidth: boolean;
      isTableTextCopy: boolean;
      tableGlobalZoom: number;
    };

    MGlobalState: typeof globalState;
    MTableState: typeof tableBaseStore;
  }
  interface log {
    info: (title: string, message?: any) => any;
    error: (title: string, message?: any) => any;
    warning: (title: string, message?: any) => any;
    success: (title: string, message?: any) => any;
    msg: (title: string, message?: any) => any;
  }
}
