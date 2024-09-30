<template>
  <div class="m-title" :class="[!!props.line ? '' : 'm-title_no-line', createSize == 'small' ? 'm-title_small' : '']">
    <div class="m-title_box" :class="[!!props.line ? '' : 'm-title_no-line']">
      <div class="m-title_text"><slot /></div>
    </div>
    <div class="m-title_tip">
      <slot name="tips">{{ tips }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
// _Import
import { computed, ComputedRef } from "vue";
import { MTitleType } from "./type";
import { useBaseStore } from "../store/index";

// _Var
const props = withDefaults(defineProps<MTitleType>(), {
  line: true
});

const globalState = useBaseStore();
const createSize: ComputedRef<"default" | "small"> = computed(() => (globalState.getSize == "small" ? "small" : "default"));
</script>

<style lang="scss">
.m-title {
  position: relative;
  font-weight: bold;
  font-size: var(--el-font-base-size-default);
  margin-left: 0;
  color: var(--el-color-primary);
  width: calc(100% - 0px);
  margin-top: 5px;
  margin-bottom: 10px;

  .m-title_box {
    position: relative;
    &::after {
      position: absolute;
      bottom: 0;
      content: "";
      display: block;
      height: 3px;
      border-radius: 0 8px;
      left: 3px;
      z-index: 1;
      width: calc(100% - 3px);
      background-color: var(--el-color-primary-light-7);
    }
  }

  .m-title_text {
    display: inline-block;
    width: max-content;
    position: relative;
    padding-bottom: 8px;
    &::after {
      position: absolute;
      bottom: 0;
      content: "";
      display: block;
      height: 8px;
      border-radius: 0 8px;
      z-index: 2;
      left: 0px;
      width: 100%;
      background-color: var(--el-color-primary);
    }
  }

  .m-title_tip {
    font-size: 14px;
  }
}

.m-title_no-line {
  margin-top: 0;
  margin-bottom: 0px;
  width: max-content;
  &::after {
    display: none;
  }
  .m-title_text {
    padding-bottom: 5px;

    &::after {
      position: absolute;
      bottom: 0;
      content: "";
      display: block;
      height: 5px;
      border-radius: 0 5px;
      z-index: 2;
      left: 0px;
      width: 100%;
      background-color: var(--el-color-primary);
    }
  }
}

.m-title_small {
  font-size: 13px;
}
</style>
