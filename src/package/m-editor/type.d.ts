// _Message Type
import { MElementFileType } from "../m-elements/file";

export type fileType = { FileUrl?: string; OriginalName?: string; FileName?: string };

export type MEditorType = {
  id: string;
  defaultValue: string;
  exButton?: {
    icon: string;
    name: string;
    target: Function;
  }[];
  upImageConfig: MElementFileType;
};
