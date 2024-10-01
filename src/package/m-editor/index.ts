// _Import
import MEditor from "./m-editor.vue";
import inBrowser from "@/package/tools/inBrowser";

// _Var
if (inBrowser) {
  const script = window.document?.createElement("script") || {};
  script.src = "https://cdn.jsdelivr.net/npm/wangeditor@latest/dist/wangEditor.min.js";
  window.document?.head?.appendChild(script);
}

// _Function install
const install = function (app) {
  if (!app._context.components["MEditor"]) app.component("MEditor", MEditor);
};

export default {
  name: "MEditor",
  install
};
