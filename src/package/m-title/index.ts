// _Import
import MTitle from "./m-title.vue";

// _Function install
const install = function (app) {
  if (!app._context.components["MButton"]) app.component("MTitle", MTitle);
};

export default {
  name: "MTitle",
  install
};
