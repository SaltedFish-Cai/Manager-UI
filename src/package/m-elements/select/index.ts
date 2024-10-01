export type MElementSelectType = {
  prop?: string;
  displayProp?: string;
  type: "multiple-select" | "select";
  placeholder?: string;
  disabled?: boolean;
  options?: MElementSelectOptionType[];
  clearable?: boolean;
  multipleLimit?: number;
  collapseTags?: boolean;
  maxCollapseTags?: number;
  display?: boolean;
  size?: "default" | "large" | "small";
};

export type MElementRequestSelectType = {
  prop?: string;
  displayProp?: string;
  type: "multiple-request-select" | "request-select";
  placeholder?: string;
  disabled?: boolean;
  options?: MElementSelectOptionType[];
  clearable?: boolean;
  multipleLimit?: number;
  collapseTags?: boolean;
  maxCollapseTags?: number;
  requestBy?: string[] | string;
  display?: boolean;
  size?: "default" | "large" | "small";
};

export type MElementOnlineSelectType = {
  prop?: string;
  displayProp?: string;
  type: "multiple-online-select" | "online-select";
  placeholder?: string;
  disabled?: boolean;
  options?: MElementSelectOptionType[];
  clearable?: boolean;
  multipleLimit?: number;
  collapseTags?: boolean;
  maxCollapseTags?: number;
  display?: boolean;
  size?: "default" | "large" | "small";
};

export type MElementSelectOptionType = {
  label: string;
  value: number | string;
  disabled?: boolean;
};
