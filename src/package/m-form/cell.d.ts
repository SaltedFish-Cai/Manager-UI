import { MElementInputType } from "@/package/m-elements/input/index";
import { MElementNumberType } from "@/package/m-elements/number/index";
import { MElementSelectType, MElementOnlineSelectType, MElementRequestSelectType } from "@/package/m-elements/select/index";
import { MElementSwitchType } from "@/package/m-elements/switch/index";
import { MElementRadioType } from "@/package/m-elements/radio/index";
import { MElementCheckBoxType } from "@/package/m-elements/checkbox/index";
import { MElementCascaderType } from "@/package/m-elements/cascader/index";
import { MElementDateType } from "@/package/m-elements/time/index";
import { MElementIconType } from "@/package/m-elements/icon/index";
import { MElementFileType } from "@/package/m-elements/file";
import { MElementAddressType } from "@/package/m-elements/address/index";
import { MElementTransferType } from "@/package/m-elements/transfer/index";

export type CellItemType = StrictUnion<
  | MElementAddressType
  | MElementCascaderType
  | MElementCheckBoxType
  | MElementDateType
  | MElementFileType
  | MElementIconType
  | MElementInputType
  | MElementNumberType
  | MElementOnlineSelectType
  | MElementRadioType
  | MElementRequestSelectType
  | MElementSelectType
  | MElementSwitchType
  | MElementTransferType
>;

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;
