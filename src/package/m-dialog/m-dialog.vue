<template>
  <el-dialog
    :alt="'dialog:' + title"
    class="m-dialog-class"
    :class="[
      createSize == 'small' ? 'm-dialog-class_small' : createSize == 'large' ? 'm-dialog-class_large' : 'm-dialog-class_default'
    ]"
    v-model="state.visible"
    @closed="closeMenu"
    append-to-body
    :width="setSize"
    :fullscreen="state.fullscreen"
    :style="{
      height: `${setHeight}`,
      '--m-dialog-class-offset-x': `${setOffsetX}`,
      '--m-dialog-class-offset-y': `${setOffsetY}`
    }"
    :close-on-click-modal="closeOnMod"
    :close-on-press-escape="closeOnEsc"
    :draggable="draggable"
  >
    <template #header="row">
      <div class="flex-center-start">
        <slot name="header" :row="row">
          <div class="flex-center-start">
            <div class="mr10">{{ title }}</div>
          </div>
        </slot>
        <m-icon
          v-if="useFull"
          :name="!state.fullscreen ? 'fullscreen_arrow_line' : 'fullscreen_arrow_exit_line'"
          class="flex-center full_icon"
          @click="state.fullscreen = !state.fullscreen"
        />
      </div>
    </template>

    <div
      v-if="keepAlive"
      :class="[
        'flex-col',
        state.fullscreen || size == 'max' || height != undefined ? 'height100' : height == 'auto' ? '' : 'height100'
      ]"
    >
      <m-scrollbar always v-if="scroll">
        <div class="dialog__body flex-col"><slot></slot></div>
      </m-scrollbar>
      <div v-else class="dialog__body flex-col"><slot></slot></div>
    </div>

    <template v-else>
      <div
        v-if="state.visible"
        :class="[
          'flex-col',
          state.fullscreen || size == 'max' || height != undefined ? 'height100' : height == 'auto' ? '' : 'height100'
        ]"
      >
        <m-scrollbar always v-if="scroll">
          <div class="dialog__body flex-col"><slot></slot></div>
        </m-scrollbar>
        <div v-else class="dialog__body flex-col"><slot></slot></div>
      </div>
    </template>

    <template #footer v-if="$slots['footer']"><slot name="footer" /></template>
  </el-dialog>
</template>

<script lang="ts" setup>
// _Import
import { reactive, watch, computed } from "vue";
import { useBaseStore } from "../store/index";
import { MDialogType } from "./type";

// _Var
const props = withDefaults(defineProps<MDialogType>(), {
  size: "m",
  offsetX: 0,
  offsetY: 0,
  keepAlive: false,
  title: "Dialog",
  useFull: false,
  closeOnMod: true,
  closeOnEsc: true,
  draggable: false,
  scroll: true
});

const emits = defineEmits(["update:modelValue", "closed"]);

const globalState = useBaseStore();
const state = reactive({
  visible: false,
  fullscreen: false
});

// _Computed setSize
const setSize = computed(() => {
  let size: number | string = 500;
  switch (props.size) {
    case "s":
      size = "30%";
      break;
    case "m":
      size = "50%";
      break;
    case "l":
      size = "70%";
      break;
    case "max":
      size = "95%";
      break;
    default:
      break;
  }
  return props.width || size;
});

// _Computed transform
const transform = computed(() => {
  let size: number | string = "-5%";
  switch (props.size) {
    case "s":
      size = "-6%";
      break;
    case "m":
      size = "-3%";
      break;
    case "l":
      size = 0;
      break;
    case "max":
      size = 0;
      break;
    default:
      break;
  }
  return props.offsetX || size;
});

// _Computed setOffsetX
const setOffsetX = computed(() => {
  let data = transform.value;
  if (props.offsetX) {
    data = isNumber(props.offsetX) ? props.offsetX + "px" : props.offsetX;
  }
  if (state.fullscreen) {
    data = 0;
  }
  return data;
});

// _Computed setOffsetY
const setOffsetY = computed(() => {
  let data = 0 as number | string;
  if (props.offsetY) {
    data = isNumber(props.offsetY) ? props.offsetY + "px" : props.offsetY;
  }
  if (state.fullscreen) {
    data = 0;
  }
  return data;
});

// _Computed setHeight
const setHeight = computed(() => {
  let data = 500 as number | string;
  if (props.size == "max") {
    data = "95%";
  } else if (props.size == "l") {
    data = "80%";
  } else if (props.size == "m") {
    data = "80%";
  } else if (props.size == "s") {
    data = "80%";
  }
  if (props.height) {
    data = isNumber(props.height) ? props.height + "px" : props.height;
  }
  if (state.fullscreen) {
    data = "100%";
  }
  return data;
});

// _Computed createSize
const createSize = computed(() => {
  return globalState.getSize || "default";
});

// _Function isNumber
function isNumber(value) {
  return Number.isNaN(value / 1) === false;
}

// _Function 关闭弹窗回调
function closeMenu() {
  emits("update:modelValue", false);
  emits("closed", false);
}

// _Watch modelValue
watch(
  () => props.modelValue,
  data => {
    state.visible = data;
  }
);
</script>

<style lang="scss">
@import "./index.scss";
@import "../../../src/styles/flex.scss";
</style>
