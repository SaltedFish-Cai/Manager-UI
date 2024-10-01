export type MElementSwitchType = MElementSwitchOptionType & {
  type: "switch";
  prop?: string; // 唯一key
  disabled?: boolean;
  display?: boolean;
  size?: "default" | "large" | "small";
};

export type MElementSwitchOptionType = {
  activeValue?: boolean | number | string;
  inActiveValue?: boolean | number | string;
  activeText?: string;
  inActiveText?: string;
};
