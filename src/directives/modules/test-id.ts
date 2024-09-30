/*
  测试ID 注入
*/
import type { Directive, DirectiveBinding } from "vue";
interface ElType extends HTMLElement {
  __handleClick__: () => any;
  disabled: boolean;
}

// _Message test-id
const throttle: Directive = {
  created(el: ElType, binding: DirectiveBinding) {
    let val = binding.value;
    if (binding.value == "btn-") {
      val += el.innerText.trim();
    }
    if (binding.value) el.setAttribute("data-testId", val);
  }
  // beforeUnmount(el: ElType) {}
};

export default throttle;
