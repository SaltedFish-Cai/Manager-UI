export type MElementCheckBoxType = {
  prop?: string;
  type: "checkbox";
  disabled?: boolean;
  options?: MElementCheckBoxOptionType[];
  display?: boolean;
  size?: "default" | "large" | "small";
};
export type MElementCheckBoxOptionType = {
  label: string;
  value: number | string;
  disabled?: boolean;
};
