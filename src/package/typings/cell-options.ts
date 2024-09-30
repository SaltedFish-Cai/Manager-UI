// _Import
// import { MElementSelectOptionType } from "@/package/m-elements/select/index";
// import { MElementRadioOptionType } from "@/package/m-elements/radio/index";
import { MElementTagOptionType } from "@/package/m-elements/tag/index";
import { MElementSwitchOptionType } from "@/package/m-elements/switch/index";
import { MElementCascaderOptionType } from "@/package/m-elements/cascader/index";
import { GroupFromConfigType } from "@/package/m-form/type";

// _Message typings
export type OptionsTypes = { [x: string]: GroupFromConfigType[] | MElementCascaderOptionType[] | MElementSwitchOptionType };
export type SelectOptionsTypes = MElementCascaderOptionType;
export type TagOptionsTypes = MElementTagOptionType & { base?: any };

// type UnionKeys<T> = T extends T ? keyof T : never;
// type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
// type StrictUnion<T> = StrictUnionHelper<T, T>;
