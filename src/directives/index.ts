import { App, Directive } from "vue";

import testId from "./modules/test-id";
import resize from "./modules/resize";

const directivesList: { [key: string]: Directive } = {
  testId,
  resize
};

// _Message directives
const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key]);
    });
  }
};

export default directives;
