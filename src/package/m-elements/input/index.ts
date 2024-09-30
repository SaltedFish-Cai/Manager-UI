export type MElementInputType = {
  type: "input" | "textarea";
  prop?: string;
  placeholder?: string;
  disabled?: boolean;
  display?: boolean;
  maxLength?: number;
  minLength?: number;
  clearable?: boolean;
  showPassword?: boolean;
  showWordLimit?: boolean;
  minRows?: number;
  maxRows?: number;
  autofocus?: boolean;
  size?: "default" | "large" | "small";
  inputParser?: (value: string) => string | undefined;
  inputFormatter?: (value: number | string) => string | undefined;
};
