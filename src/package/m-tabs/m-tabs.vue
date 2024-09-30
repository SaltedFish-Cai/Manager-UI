<template>
  <div
    class="m-tabs"
    :class="[
      card ? 'm-tabs-card' : 'm-tabs-default',
      createSize == 'small' ? 'm-tabs_small' : '',
      portrait ? 'm-tab-portrait' : '',
      slider ? 'm-tab-portrait m-tab-slider' : ''
    ]"
    :id="tabsId"
    ref="tabsRef"
  >
    <div :class="['m-tabs-content', portrait || slider ? 'flex' : 'flex-col']">
      <div :class="['m-tab-header', useHeaderLine ? 'm-tab-header_line' : '']">
        <div v-if="$slots['HeaderLeft']" class="mr10"><slot name="HeaderLeft"></slot></div>
        <!-- 左更多 -->
        <m-icon v-if="scrollValue > 0" class="icons left-icon" name="left_small" @click="minusScroll" />

        <div :class="[card ? 'm-tab-title-list_card' : 'm-tab-title-list']" :id="tabsId + '-tab-titles'">
          <div v-if="portrait || slider" class="m-tab-box flex-col" :style="{ '--tab-header-scroll': '-' + headerScroll + 'px' }">
            <title-item
              :slots="slotsTitle"
              :activeName="state.activeName"
              :changeTabs="changeTabs"
              :card="card"
              :portrait="portrait || slider"
            ></title-item>
          </div>
          <div v-else class="m-tab-box" :style="{ '--tab-header-scroll': '-' + headerScroll + 'px' }">
            <title-item
              :slots="slotsTitle"
              :activeName="state.activeName"
              :changeTabs="changeTabs"
              :card="card"
              :portrait="portrait || slider"
            ></title-item>
          </div>
        </div>

        <!-- 右更多 -->
        <m-icon v-if="scrollValue > 0" class="icons right-icon" name="right_small_fill" @click="addScroll" />
        <div v-if="$slots['HeaderRight']" class="mr10"><slot name="HeaderRight"></slot></div>
      </div>

      <div v-if="slider" class="m-tab-scroll">
        <div
          :id="tabsId + '-tab-contents-slider'"
          class="m-tab-contents m-tab-contents_slider"
          :style="{ transform: `translateX(-${mode == 'visible' ? slotIndex : 0}00%)` }"
        >
          <m-scrollbar always ref="mScrollRef" @scroll="scrollChange" :useShadow="useShadow">
            <slot></slot>
          </m-scrollbar>
        </div>
      </div>
      <div v-else class="m-tab-scroll">
        <div
          :id="tabsId + '-tab-contents'"
          class="m-tab-contents"
          :style="{ transform: `translateX(-${mode == 'visible' ? slotIndex : 0}00%)` }"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// _Import
import { ref, computed, reactive, onMounted, onUnmounted, useSlots, watch, nextTick, provide } from "vue";
import lodashPkg from "lodash";
import { randChar } from "../tools/rand-char";
import titleItem from "./components/title.vue";
import { Obj } from "../global";
import { useBaseStore } from "../store/index";
import { MTabsType } from "./type";
import inBrowser from "@/package/tools/inBrowser";

// _Var
const { debounce } = lodashPkg;

const props = withDefaults(defineProps<MTabsType>(), {
  modelValue: "",
  mode: "visible",
  card: false,
  portrait: false,
  slider: false,
  useHeaderLine: false,
  useShadow: true
});

const randId = String(randChar());
const tabsRef: any = ref();
const slots: any = ref({});
const defaultSlot = useSlots().default;
const slotsTitle = ref([] as Obj[]);
const slotIndex = ref(0);
// const lineStyle = ref({ width: 0, left: 0 });
const tabsId = ref(randId);
const scrollValue = ref(0);
const headerScroll = ref(0);
const state = reactive({ activeName: "" });
const globalState = useBaseStore();
const emits = defineEmits(["update:modelValue", "tab-change"]);
const _debounce = debounce(
  () => {
    if (!props.slider) {
      setClick();
      setLine();
    }
  },
  500,
  { trailing: true }
);

let observer;
let observerScroll;
let tabsTitle: {
  scrollWidth: number;
  clientWidth: number;
} = {
  scrollWidth: 0,
  clientWidth: 0
};

const mScrollRef = ref();
let scrollChangeValue = 0;

// _Computed
const createSize = computed(() => {
  return globalState.getSize == "small" ? "small" : "default";
});

provide("createTabItemObserver", element => {
  setWatch();
  observerScroll.observe(element);
});

// _Vue onMounted
onMounted(() => {
  init();
  let defaultValue = props.modelValue;

  if (props.slider) {
    observerScroll?.disconnect && observerScroll?.disconnect();
  } else {
    observer?.disconnect && observer?.disconnect();
  }

  setTimeout(() => {
    watchDom();
    if (props.slider) {
      changeTabs(defaultValue, 0);
    }
  }, 500);
});

// _Vue onUnmounted
onUnmounted(() => {
  observer?.disconnect && observer?.disconnect();
  observerScroll?.disconnect && observerScroll?.disconnect();
});

// _Function 变更Tab
function changeTabs(name, index) {
  if (!props.slider) {
    slotIndex.value = index;
    setLine();
    emits("update:modelValue", name);
  } else {
    let target: any = document.querySelector(`#${tabsId.value}-tab-contents-slider #${randId}-${name}`);
    if (target) {
      mScrollRef.value.setScrollTop(target.offsetTop - 10);
    }
  }
  emits("tab-change", { name, index });
}

// _Function 初始化
function init() {
  if (tabsRef.value) {
    if (defaultSlot) {
      slots.value = defaultSlot();
    }
    const arr: any = [];
    function setChild(arrayData) {
      for (let index = 0; index < arrayData.length; index++) {
        const element = arrayData[index];

        if (element.props) {
          arr.push(element);
        } else if (String(element.type) == "Symbol(v-fgt)" && !!element.children?.length) {
          setChild(element.children);
        }
      }
    }
    setChild(slots.value);

    if (arr.length != slotsTitle.value.length) {
      slotsTitle.value = arr;
      const _index = slotsTitle.value.findIndex(item => item?.props?.name == props.modelValue);
      slotIndex.value = _index < 0 ? 0 : _index;
      const name = slotsTitle.value[slotIndex.value]?.props?.name;
      state.activeName = name;
      emits("update:modelValue", name);
      _debounce();
    }
  }
}

// _Function 监听元素节点
function watchDom() {
  if (tabsRef.value) {
    // 观察器的配置（需要观察什么变动）
    const config = { childList: true, subtree: true };

    // 当观察到变动时执行的回调函数(mutationsList, observer)
    const callback = function () {
      init();
    };

    // 创建一个观察器实例并传入回调函数
    observer = new MutationObserver(callback);

    // 开始观察目标节点
    observer.observe(tabsRef.value, config);
  }
}

// _Function 设置滚动位置
function setClick() {
  if (!inBrowser) return;

  setTimeout(() => {
    nextTick(() => {
      // const prEl = window.document?.getElementById(id.value);
      const tabId = tabsRef?.value?.id;
      const _id = `${tabId}-tab-titles`;
      const tabsTitleEl = window.document?.getElementById(_id);
      if (tabsTitleEl) {
        tabsTitle = {
          scrollWidth: tabsTitleEl.scrollWidth,
          clientWidth: tabsTitleEl.clientWidth
        };
        scrollValue.value = tabsTitleEl.scrollWidth - tabsTitleEl.clientWidth;
      }
    });
  }, 100);
}

// _Function 设置底线与动画
function setLine() {
  if (!inBrowser) return;

  setTimeout(() => {
    nextTick(() => {
      const tabId = tabsRef?.value?.id;
      const prEl = window.document?.getElementById(tabId);

      // >-------------> 设置底线 <------------<
      // const el = prEl?.getElementsByClassName("m-tab-title_action");
      // if (prEl && el && el.length) {
      //   const prRect = prEl.getBoundingClientRect();
      //   const rect = el[0].getBoundingClientRect();
      //   lineStyle.value = {
      //     width: Math.floor(rect.width),
      //     left: Math.floor(rect.left - prRect.left)
      //   };
      // }

      // >-------------> 设置过渡动画 <------------<
      const _els = prEl?.getElementsByClassName("tab-item");
      if (_els && _els.length) {
        const _arr = Array.prototype.slice.call(_els, 0);
        const els = _arr.filter(item => item.parentElement.id.indexOf(tabId) > -1);
        for (let index = 0; index < els.length; index++) {
          const element = els[index];
          if (props.mode == "visible") {
            if (index != slotIndex.value) {
              element.style.visibility = "hidden";
              // element.style.height = "0px";
            } else {
              element.style.visibility = "visible";
              // element.style.height = "100%";
            }
          } else {
            if (index != slotIndex.value) element.style.display = "none";
            else element.style.display = "block";
          }
        }
      }
    });
  }, 100);
}

function scrollChange({ scrollTop }) {
  scrollChangeValue = scrollTop <= 0 ? 1 : scrollTop;
}

function setWatch() {
  if (!inBrowser) return;

  const root = document.querySelector(`#${tabsId.value}-tab-contents-slider`);
  if (root) {
    const exTop = root.clientHeight - 180 < 0 ? 0 : root.clientHeight - 180;
    let options = {
      root, //根元素
      rootMargin: `0px 0px -${exTop}px 0px`, //传值形式类似于css的margin 传一个值则四个边都为0
      threshold: 1 //触发条件 表示目标元素刚进入根元素时触发
    };
    if (observerScroll) return;

    //IntersectionObserver对象
    observerScroll = new IntersectionObserver(data => {
      const target: any = data[0].target;
      const name = target?.dataset?.name;
      if (scrollChangeValue != 0) {
        state.activeName = name;
        emits("update:modelValue", name);
      }
    }, options);
  }
}

// _Function 超出标题（左）
function minusScroll() {
  const { clientWidth } = tabsTitle;
  const chr = headerScroll.value - clientWidth;
  headerScroll.value = chr <= 0 ? 0 : chr;
}

// _Function 超出标题（右）
function addScroll() {
  const { scrollWidth, clientWidth } = tabsTitle;
  const chr = headerScroll.value + clientWidth;
  headerScroll.value = clientWidth + chr >= scrollWidth ? scrollWidth - clientWidth + 30 : chr;
}

// _Watch modelValue
watch(
  () => props.modelValue,
  data => {
    state.activeName = data;
    if (slotsTitle.value) {
      const index = slotsTitle.value.findIndex(item => item?.props?.name == props.modelValue);
      slotIndex.value = index;
      setLine();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
@import "./index.scss";
</style>
