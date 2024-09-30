/**
 * @ Author: Cai
 * @ Create Time: 2024-04-28 09:34:25
 * @ Modified by: Cai
 * @ Modified time: 2024-04-29 16:52:26
 * @ Description: page name: m-input-type
 */

// import { InputProps } from "element-plus";

type BaseType = {
  maxLength?: number | string; // 同原生 max-length 属性
  minLength?: number | string; // 原生属性，最小输入长度
  showWordLimit?: boolean; // 是否显示统计字数, 只在 type 为 'text' 或 'textarea' 的时候生效
  placeholder?: string; // 输入框占位文本
  disabled?: boolean; // 是否禁用
  autocomplete?: string; // 原生 autocomplete 属性
  name?: string; // 等价于原生 input name 属性
  readonly?: boolean; // 原生 readonly 属性，是否只读
  inputStyle?: string[] | string; // input 元素或 textarea 元素的 style
  display?: boolean; // 纯展示模式
  contrast?: boolean; // 对比模式
};

export type MInputDefaultType = BaseType & {
  type: "input";
  clearable?: boolean; // 是否显示清除按钮
  formatter?: (value: number | string) => string; // 指定输入值的格式
  parser?: (value: number | string) => string; // 指定从格式化器输入中提取的值
  showPassword?: boolean; // 是否显示切换密码图标
  size?: "default" | "large" | "small"; // 输入框尺寸
};

export type MInputTextareaType = BaseType & {
  type: "textarea";
  minRows?: number; // 输入框行数
  maxRows?: number; // 输入框行数
  autoSize?: boolean | { minRows?: number; maxRows?: number }; // textarea 高度是否自适应，仅 type 为 'textarea' 时生效。 可以接受一个对象，比如: { minRows: 2, maxRows: 6 }
};

export type MInputType = StrictUnion<MInputDefaultType | MInputTextareaType>;

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;
