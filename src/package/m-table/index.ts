// _Import
import mTable from "./m-table.vue";
import inBrowser from "@/package/tools/inBrowser";

// _Var
if (inBrowser) {
  const script = window.document?.createElement("script") || {};
  script.src = "https://dms-qas.bbraun.cn/DocumentToDms/library/sortable.js";
  window.document?.head?.appendChild(script);
}

// _Function install
const install = function (app) {
  if (!app._context.components["MTable"]) app.component("MTable", mTable);
};

export default {
  name: "MTable",
  install
};
