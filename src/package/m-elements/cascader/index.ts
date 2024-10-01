import { Obj } from "@/package/global";

export type MElementCascaderType = {
  prop?: string;
  displayProp?: string;
  type: "cascader-check" | "cascader" | "multiple-cascader-check" | "multiple-cascader";
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  collapseTags?: boolean;
  maxCollapseTags?: number;
  options?: MElementCascaderOptionType[];
  display?: boolean;
  size?: "default" | "large" | "small";
};

export type MElementCascaderOptionType = {
  label: string;
  value: number | string;
  children?: MElementCascaderOptionType[];
  disabled?: boolean;
  base?: Obj;
};
