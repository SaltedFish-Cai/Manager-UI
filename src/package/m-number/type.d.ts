// _Message Type

export type MNumberInputType = {
  modelValue: number; // 绑定值
  min?: number; // 设置计数器允许的最小值
  max?: number; // 设置计数器允许的最大值
  step?: number; // 计数器步长
  stepStrictly?: boolean; // 是否只能输入 step 的倍数
  precision?: number; // 数值精度
  size?: "default" | "large" | "small"; // 输入框尺寸
  disabled?: boolean; // 是否禁用
  controls?: boolean; // 是否使用控制按钮
  controlsPosition?: "" | "right"; // 控制按钮位置
  placeholder?: string; // 输入框占位文本
  valueOnClear?: number; // 当输入框被清空时显示的值
  display?: boolean; // 纯展示模式
};
