<script lang="ts" setup>
import { useData } from "../composables/data";
import { inBrowser } from "vitepress";

const { themeColor, isDark } = useData();

const toggleThemeColor = async value => {
  if (value) {
    themeColor.value = value;
    window.setManagerTheme(value, isDark.value);
  }
};
if (inBrowser) window.setManagerTheme(themeColor.value, isDark.value);
</script>

<template>
  <div class="VP-select-color">
    <el-color-picker
      class="VP-select-color"
      v-model="themeColor"
      @change="toggleThemeColor"
      :popper-class="isDark ? 'is-dark' : ''"
    />
  </div>
</template>

<style>
.VP-select-color {
  .el-color-picker__trigger {
    height: 28px;
    width: 28px;
    padding: 1px;
  }
}
</style>
