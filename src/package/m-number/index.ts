// _Import
import MNumber from "./m-number.vue";

// _Function install
const install = function (app) {
  if (!app._context.components["MNumber"]) app.component("MNumber", MNumber);
};

export default {
  name: "MNumber",
  install
};
