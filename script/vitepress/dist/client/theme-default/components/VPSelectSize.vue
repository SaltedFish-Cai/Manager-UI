<script lang="ts" setup>
import { useData } from "../composables/data";
import { inBrowser } from "vitepress";

const { themeSize } = useData();

const toggleThemeSize = async value => {
  if (value) {
    themeSize.value = value;
    const useGlobalState = window.MGlobalState();
    useGlobalState.setGlobalConfig({ size: value });
  }
};
if (inBrowser) toggleThemeSize(themeSize.value);
</script>

<template>
  <div class="VP-select-size">
    <el-radio-group size="large" v-model="themeSize" @change="toggleThemeSize">
      <el-radio-button label="small" value="small">小</el-radio-button>
      <el-radio-button label="default" value="default">中</el-radio-button>
      <el-radio-button label="large" value="large">大</el-radio-button>
    </el-radio-group>
  </div>
</template>

<style>
.VP-select-size {
  .el-radio-button__inner {
    font-size: 12px !important;
    height: 28px !important;
    line-height: 27px !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
</style>
