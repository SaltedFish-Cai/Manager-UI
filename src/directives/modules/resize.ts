import type { Directive, DirectiveBinding } from "vue";

// _Message resize
const auth: Directive = {
  mounted(el: any, binding: DirectiveBinding) {
    // 这里使用debounce防抖处理，防抖的延时时间可以通过自定义指令的参数传过来，如`v-resize:300`表示300ms延时
    // 也可以将此处延时去掉，放在绑定的函数中自定义
    function antiShake(fn, delay = 200) {
      let t: any = null;
      return function () {
        if (t) {
          clearTimeout(t);
        }
        t = setTimeout(() => {
          // eslint-disable-next-line prefer-rest-params
          fn(arguments);
        }, delay);
      };
    }
    el.reSizer = new window.ResizeObserver(antiShake(binding.value, Number(binding.arg) || 200));
    el.reSizer.observe(el);
  },
  unmounted(el) {
    el.reSizer.disconnect();
  }
};

export default auth;
