export type MElementTransferType = {
  type: "transfer";
  prop?: string;
  placeholder?: string;
  disabled?: boolean;
  options?: MElementTransferOptionType[];
  titles?: [string, string];
  buttonTexts?: [string, string];
  filterPlaceholder?: string;
  clearable?: boolean;
  multipleLimit?: number;
  collapseTags?: boolean;
  maxCollapseTags?: number;
  display?: boolean;
  size?: "default" | "large" | "small";
};

export type MElementTransferOptionType = {
  label: string;
  value: number | string;
  disabled?: boolean;
};
