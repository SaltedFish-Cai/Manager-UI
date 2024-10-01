// _Message type
export type MTabsType = {
  modelValue?: string;
  mode?: "display" | "visible";
  card?: boolean;
  portrait?: boolean;
  slider?: boolean;
  useHeaderLine?: boolean;
  useShadow?: boolean;
};

export type MTabsItemType = {
  label: string;
  name: string;
  scroll?: boolean;
  tips?: string;
};

export type MTabsItemTitleType = {
  slots: any;
  activeName: string;
  changeTabs: any;
  card: boolean;
  portrait: boolean;
};
