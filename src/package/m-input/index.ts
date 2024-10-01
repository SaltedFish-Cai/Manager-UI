import MInput from "./m-input.vue";

const install = function (app) {
  if (!app._context.components["MInput"]) app.component("MInput", MInput);
};
export default {
  name: "MInput",
  install
};
