export type MElementIconType = {
  type: "select-icon";
  prop?: string; // 唯一key
  placeholder?: string;
  disabled?: boolean;
  display?: boolean;
  size?: "default" | "large" | "small";
};
