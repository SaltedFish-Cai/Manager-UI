import { ScrollbarProps } from "element-plus";

export interface ScrollbarPropsType extends Partial<Omit<ScrollbarProps, "data">> {
  useShadow?: boolean;
}
