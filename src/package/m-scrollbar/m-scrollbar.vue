<template>
  <section :id="id" :class="['m-scrollbar', useBarX ? 'm-scrollbar-use-bar-x' : '', useBarY ? 'm-scrollbar-use-bar-y' : '']">
    <el-scrollbar class="m-scrollbar-body" ref="mScrollbarRef" v-bind="prop" @scroll="scrollFn">
      <div v-if="useShadow" class="is-scroll" :class="[scrollValue > 0 ? 'in-scroll' : '']"></div>
      <div class="pt7">
        <slot></slot>
      </div>
    </el-scrollbar>
  </section>
</template>

<script lang="ts" setup>
// _Import
import { ref, onMounted, onBeforeUnmount } from "vue";
import lodashPkg from "lodash";
import { randChar } from "../tools/rand-char";
import { ScrollbarPropsType } from "./type";

// _Var
const { debounce } = lodashPkg;
const emits = defineEmits(["scroll"]);

const prop = withDefaults(defineProps<ScrollbarPropsType>(), {
  useShadow: true
});
const id = ref(randChar());
const mScrollbarRef = ref();
const scrollValue = ref(0);
const useBarX = ref(false);
const useBarY = ref(false);
const _debounce = debounce(
  targetNode => {
    watchDomAction(targetNode);
  },
  200,
  { trailing: true }
);

let observer;

// _Vue onMounted
onMounted(() => {
  setTimeout(() => {
    watchDom();
    mScrollbarRef?.value?.update();
  }, 0);
});

// _Vue onBeforeUnmount
onBeforeUnmount(() => {
  if (observer?.disconnect) observer?.disconnect();
});

// _Function 监听元素节点
function watchDom() {
  // 目标节点
  const targetNode = document.getElementById(id.value);
  if (targetNode) {
    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true };

    // 当观察到变动时执行的回调函数(mutationsList, observer)
    const callback = function () {
      _debounce(targetNode);
    };
    _debounce(targetNode);
    // 创建一个观察器实例并传入回调函数
    observer = new MutationObserver(callback);

    // 开始观察目标节点
    observer.observe(targetNode, config);
  }
}

// _Function 监听元素节点
function watchDomAction(targetNode) {
  const barX = targetNode.firstChild.children[1].firstChild;
  const barY = targetNode.firstChild.children[2].firstChild;
  if (barX) {
    if (!!barX.clientWidth) {
      useBarY.value = true;
    } else {
      useBarY.value = false;
    }
  }

  if (barY) {
    if (!!barY.clientHeight) {
      useBarX.value = true;
    } else {
      useBarX.value = false;
    }
  }
}

// _Function 更新滚动条状态
function update() {
  mScrollbarRef?.value?.update();
}

// _Function 设置左距离
function setScrollLeft(value: number) {
  mScrollbarRef?.value?.scrollTo({ left: value, behavior: "smooth" });
}

// _Function 设置高距离
function setScrollTop(value: number) {
  mScrollbarRef?.value?.scrollTo({ top: value, behavior: "smooth" });
}

// _Function 滚动回调
function scrollFn({ scrollTop, scrollLeft }) {
  scrollValue.value = scrollTop;
  emits("scroll", { scrollTop, scrollLeft });
}

defineExpose({ update, setScrollTop, setScrollLeft });
</script>

<style lang="scss">
.m-scrollbar {
  width: 100%;
  height: 100%;
  .m-scrollbar-body {
    position: relative;
  }
  .is-scroll {
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;
    transition: 0.3s;
    z-index: 999;
  }
  .in-scroll {
    box-shadow: 0px 0 10px 1.5px var(--el-color-black);
  }
  // .el-scrollbar__bar.is-horizontal {
  //   .el-scrollbar__thumb {
  //     background-color: #c1c1c1;
  //     opacity: 1;
  //     &:active,
  //     &:hover {
  //       background-color: var(--el-color-primary);
  //       opacity: 1;
  //     }
  //   }
  // }
  // .el-scrollbar__bar.is-vertical {
  //   .el-scrollbar__thumb {
  //     background-color: #c1c1c1;
  //     opacity: 1;
  //     &:active,
  //     &:hover {
  //       background-color: var(--el-color-primary);
  //       opacity: 1;
  //     }
  //   }
  // }
}

.m-scrollbar-use-bar-x {
  .m-scrollbar-body {
    width: calc(100% - var(--el-scrollbar-width) - 7px);
    padding-right: calc(var(--el-scrollbar-width) + 7px);
    > .el-scrollbar__bar.is-vertical {
      right: 0;
      background-color: var(--el-border-color-light);
    }
  }
  .el-scrollbar__bar.is-vertical {
    width: var(--el-scrollbar-width);
    transform: scaleY(0.97);
  }
}

.m-scrollbar-use-bar-y {
  .m-scrollbar-body {
    height: calc(100% - var(--el-scrollbar-width) - 4px);
    padding-bottom: calc(var(--el-scrollbar-width) + 4px);
    > .el-scrollbar__bar.is-horizontal {
      bottom: 0;
      background-color: var(--el-border-color-light);
    }
  }
  .el-scrollbar__bar.is-horizontal {
    height: var(--el-scrollbar-width);
    transform: scaleY(0.97);
  }
}
</style>
