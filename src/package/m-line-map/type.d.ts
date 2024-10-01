export type PropsDataConfigType = Obj & {
  id: string;
  place: { x: number; y: number; width?: number; height?: number };
  condition?: Obj;
  children?: PropsDataConfigType[];
};

export type DefaultPropsDataConfigType = {
  steps: { id: string; place: { x: number; y: number; width?: number; height?: number } }[];
  lines: { to: string; from: string }[];
};

// export type BaseDataConfigType = {
//   id: string;
//   place: { x: number; y: number; width?: number; height?: number };
// };

export type DataConfigType = {
  id: string;
  place: { x: number; y: number; width?: number; height?: number };
  parent: string[];
  children: string[];
  data?: Obj;
  condition?: Obj;
};
