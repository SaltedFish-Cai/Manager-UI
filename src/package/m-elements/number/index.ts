export type MElementNumberType = {
  type: "number";
  prop?: string;
  placeholder?: string;
  disabled?: boolean;
  max?: number;
  min?: number;
  precision?: number;
  controls?: boolean;
  clearOnValue?: boolean;
  step?: number;
  stepStrictly?: boolean;
  display?: boolean;
  size?: "default" | "large" | "small";
};
