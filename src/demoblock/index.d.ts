declare module "*.vue" {
  const component: import("vue").DefineComponent<{}, {}, any>;
  export default component;
}

declare module "manager-ui" {
  const demoblock: (md: any) => void;
  export default demoblock;
}
