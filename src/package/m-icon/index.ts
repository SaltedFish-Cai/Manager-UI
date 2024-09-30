import MIcon from "./m-icon.vue";

// _Function install
const install = function (app) {
  if (!app._context.components["MIcon"]) app.component("MIcon", MIcon);
};
export default {
  name: "MIcon",
  install
};
