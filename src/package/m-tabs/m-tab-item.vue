<template>
  <div
    :id="'tab-item-' + randId"
    :data-name="name"
    :data-label="label"
    class="tab-item flex-col"
    :class="[animation ? 'animation' : '']"
    ref="box"
  >
    <div
      v-if="isSlider"
      ref="tabItemLine"
      class="tab-item_line pl10"
      :data-label="label"
      :data-name="name"
      :id="tabId + '-' + name"
    >
      <img class="tab-item_line_load" src="../imgs/load.png" @load="loadElement" />
      <m-title :tips="tips">
        {{ label }}
        <template #tips v-if="$slots['tips']">
          <slot name="tips"></slot>
        </template>
      </m-title>
    </div>
    <div class="flex-height-1">
      <m-scrollbar always v-if="scroll" ref="mScrollbarRef" class="m-tab-item-body">
        <slot></slot>
      </m-scrollbar>
      <div v-else class="m-tab-item-body_fix">
        <slot></slot>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
<script lang="ts" setup>
// _Import
import { ref, onMounted, onUnmounted, inject } from "vue";
import { MTabsItemType } from "./type";
import { randChar } from "../tools/rand-char";
import inBrowser from "@/package/tools/inBrowser";

const mScrollbarRef = ref();
const randId = String(randChar());
const tabId = ref("");
const isSlider = ref(false);
const createTabItemObserver: any = inject("createTabItemObserver");
// _Var
withDefaults(defineProps<MTabsItemType>(), {
  label: "",
  name: "",
  scroll: false
});

const tabItemLine = ref();
const box = ref();
const animation = ref(false);
// 观察器的配置（需要观察什么变动）
const config = { attributes: true };
// 创建一个观察器实例并传入回调函数
let observer;

// _Vue onMounted
onMounted(() => {
  if (inBrowser) {
    observer = new window.MutationObserver(callback);

    // 开始观察已配置的目标节点
    observer.observe(box.value, config);
    const tabsList = window.document.querySelectorAll(".m-tabs");
    if (tabsList) {
      for (let index = 0; index < tabsList.length; index++) {
        const element: any = tabsList[index];
        if (element.innerHTML.indexOf(`tab-item-${randId}`) > -1) {
          tabId.value = element.id;
          const classArr = [...element.classList];
          if (classArr?.findIndex(item => item == "m-tab-slider") > -1) {
            isSlider.value = true;
          }
        }
      }
    }
  }
});

// _Vue onUnmounted
onUnmounted(() => {
  observer?.disconnect && observer?.disconnect();
});

// _Function 当观察到变动时执行的回调函数
function callback(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes") {
      if (mutation.target.style.visibility.length) {
        if (mutation.target.style.visibility == "visible") {
          animation.value = true;
          mScrollbarRef?.value?.update();
        } else {
          animation.value = false;
        }
      } else {
        mScrollbarRef?.value?.update();
        animation.value = true;
      }
    }
  }
}

function loadElement() {
  createTabItemObserver(tabItemLine.value);
}
</script>

<style lang="scss" scoped>
.tab-item_line {
  position: relative;
  .tab-item_line_load {
    position: absolute;
    display: none;
  }
}
.flex-height-1 {
  height: 1px;
  flex: 1;
}
.tab-item {
  display: flex;
  flex: 0 0 100%;
  width: 100%;
  .m-tab-item-body {
    // width: calc(100% - 20px);
    padding-right: 10px;
    padding-left: 10px;
    width: initial;
  }
  .m-tab-item-body_fix {
    height: calc(100% - 7px);
    padding-right: 9px;
    padding-bottom: 7px;
    padding-left: 9px;
  }
}

.animation {
  animation: in-page 0.36s;
}

@keyframes in-page {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
