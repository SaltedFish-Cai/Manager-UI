// _Import
import MTabs from "./m-tabs.vue";
import MTabItem from "./m-tab-item.vue";

// _Function install
const install = function (app) {
  if (!app._context.components["MTabs"]) {
    app.component("MTabs", MTabs);
    app.component("MTabItem", MTabItem);
  }
};

export default {
  name: "MTabs",
  install
};
