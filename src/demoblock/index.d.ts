declare module "*.vue" {
  const component: import("vue").DefineComponent<{}, {}, any>;
  export default component;
}

declare module "document-to-dms" {
  const demoblock: (md: any) => void;
  export default demoblock;
}
