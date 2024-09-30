export type MElementFileType = {
  type: "file";
  prop?: string;
  placeholder?: string;
  disabled?: boolean;
  fileMultiple?: number;
  display?: boolean;
  fileIncludeType?: string[];
  fileExcludeType?: string[];
  fileAttached?: object;
  fileSingleSize?: number;
  fileAllSize?: number;
};
