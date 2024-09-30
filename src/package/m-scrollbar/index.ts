// _Import
import MScrollBar from "./m-scrollbar.vue";

// _Function install
const install = function (app) {
  if (!app._context.components["MScrollBar"]) app.component("MScrollBar", MScrollBar);
};

export default {
  name: "MScrollBar",
  install
};
