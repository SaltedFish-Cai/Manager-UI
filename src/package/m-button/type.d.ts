// _Message Type
export type MButtonType = {
  is?:
    | string
    | "add"
    | "cancel"
    | "check"
    | "download"
    | "edit"
    | "export"
    | "file"
    | "go"
    | "import"
    | "ok"
    | "refresh"
    | "remove"
    | "save"
    | "search"
    | "submit"
    | "switch"
    | "sync"
    | "time"
    | "trash"
    | "upload"
    | "view";
  font?: string;
  type?: "danger" | "default" | "info" | "primary" | "success" | "text" | "warning";
  size?: "default" | "large" | "small";
  loading?: boolean;
  debounced?: boolean;
  line?: boolean;
  debouncedTime?: number;
  disabled?: boolean;
  position?: "left" | "right";
  loadingBy?: string;
  useFont?: boolean;
};
