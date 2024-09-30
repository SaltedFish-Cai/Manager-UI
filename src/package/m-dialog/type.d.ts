// _Message Type
export type MDialogType = {
  modelValue: boolean;
  size?: "l" | "m" | "max" | "s";
  height?: number | string | "auto";
  width?: number | string;
  offsetX?: number | string;
  offsetY?: number | string;
  keepAlive?: boolean;
  title?: string;
  useFull?: boolean;
  closeOnMod?: boolean;
  closeOnEsc?: boolean;
  draggable?: boolean;
  scroll?: boolean;
};
