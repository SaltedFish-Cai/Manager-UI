export type MElementTagType = {
  type: "tag";
  prop?: string;
  disabled?: boolean;
  display?: boolean;
  size?: "default" | "large" | "small";
};

export type MElementTagOptionType = {
  label: string;
  value: number | string;
  tagStyle?: {
    bgColor?: string;
    textColor?: string;
    icon?: string;
  };
};
