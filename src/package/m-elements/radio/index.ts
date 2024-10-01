export type MElementRadioType = {
  prop?: string;
  type: "radio";
  disabled?: boolean;
  options?: MElementRadioOptionType[];
  display?: boolean;
  size?: "default" | "large" | "small";
};
export type MElementRadioOptionType = {
  label: string;
  value: number | string;
  disabled?: boolean;
};
