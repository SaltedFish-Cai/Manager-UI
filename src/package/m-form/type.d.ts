import type { FormItemRule } from "element-plus";
import { CellItemType } from "./cell";
import { Obj, mOptionType } from "@/package/global";

export type OtherType = {
  prop?: string; // 唯一key
  type: "null" | "slot";
  disabled?: boolean; // 禁用状态
  display?: boolean;
};

export type spanStyleType = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type MFormProps = {
  id: string; // 多表时唯一id识别
  value?: {}; // 非绑定外置默认数据
  data?: {}; // 双向绑定外置默认数据
  contrastData?: {}; // 对比用数据
  alwaysContrast?: boolean;
  span?: 1 | 2 | 3 | 4; // 强制分栏数量 不填写时，主动根据父类宽度设置
  exOptions?: mOptionType; // 外置下啦选择框选项对象 key = prop
  useRequired?: boolean; // 强制不使用校验
  labelWidth?: number | string;
  labelPosition?: "left" | "right";
  structure: FormItemType[]; // 表单结构
  exRules?: object | {}; // 外置表单校验规则
  disabled?: boolean; // 强制表单全信息不可编辑
  display?: boolean;
  exClass?: string;
  useRules?: boolean;
  useTopTitle?: boolean;
  exDependent?: {
    disabledRule?: object | {};
    fileData?: object; // 上传文件，外置参数
    remoteMethod?: object | {}; // online-select 接口方法
  };
  // roles?: string[]; // 外置角色规则
};

type BaseType = {
  label?: string; // 标题
  tip?: string; // 提示

  disabled?: boolean; // 禁用状态
  isEdit?: boolean;

  unitName?: string; // 自动划组时使用名
  unitTip?: string; // 自动划组时提示

  rules?: FormItemRule[] | string;
  span?: 1 | 2 | 3;
};

// >-------------> 组类型配置 <------------<
export type GroupFromConfigType = ChildItemType & {
  label: string;
  value: boolean | number | string;
  childLabel?: string;
};

type GroupType = {
  prop: string; // 唯一key
  type: "group";
  groupFormConfig: GroupFromConfigType[];
  disabled?: boolean; // 禁用状态
  display?: boolean;
};

type InGroupType = GroupType & {
  groupFormConfig: (GroupFromConfigType & { spanStyle?: spanStyleType })[];
};

// >-------------> 分栏类型配置 <------------<
type TabsType = {
  prop?: string; // 唯一key
  type: "tabs-form";
  titleKey?: string; // 分栏tab标题使用字段
  tabsFormConfig: ChildItemType[];
  disabled?: boolean;
  contrastKey?: string;
  contrastUse?: string;
};

type InTabsType = TabsType & {
  tabsFormConfig: (ChildItemType & { spanStyle?: spanStyleType })[];
};

export type ChildItemType = BaseType & StrictUnion<CellItemType | OtherType>;

export type FormItemType = BaseType & StrictUnion<CellItemType | GroupType | OtherType | TabsType>;

// >-------------> InFormType <------------<
export type InFormItemType = BaseType &
  StrictUnion<CellItemType | InGroupType | InTabsType | OtherType> & { spanStyle: spanStyleType };

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

export type TabsFormType = InFormItemType & {
  inMultipleConfig?: MultipleConfigType[];
  tabsFormConfig?: (ChildItemType & { spanStyle?: spanStyleType })[];
};

export type MultipleConfigType = {
  unitName?: string; // 自动划组时使用名
  unitTip?: string; // 自动划组时提示
  configs: InFormItemType[];
};

export interface GlobalState {
  addressMap: Obj;
  addressMapLoading: boolean;
}

export type basicsItemPropsType = {
  ruleFormRef: any;
  item: InFormItemType;
  data?: {};
  contrastData?: {};
  alwaysContrast?: boolean;
  labelWidth?: number;
  labelPosition?: "left" | "right";
  display: boolean;
  size?: "default" | "large" | "small";
  noLabel?: boolean;
};

export type TabsItemPropType = {
  id: string;
  ruleFormRef: {};
  item: TabsFormType;
  data: {};
  contrastData?: {};
  rules: {};
  display: boolean;
  labelWidth?: number;
  labelPosition?: "left" | "right";
  size?: "default" | "large" | "small";
};

export type groupItemPropsType = {
  ruleFormRef: {};
  item: InFormItemType;
  data: {};
  labelWidth?: number;
  labelPosition?: "left" | "right";
  display: boolean;
  size?: "default" | "large" | "small";
};

export type itemsSlotPropsType = { item: FormItemType; data?: {}; labelWidth?: number };

export type labelPropsType = {
  tip?: string;
  label?: string;
  labelWidth?: number;
  labelPosition?: "left" | "right";
};
