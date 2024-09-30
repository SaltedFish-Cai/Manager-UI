<template>
  <el-row>
    <m-button font="star_arc_line" @click="debouncedClick">非防抖按钮</m-button>
    <m-button font="star_arc_line" debounced @click="debouncedClick">防抖按钮</m-button>
  </el-row>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";

function debouncedClick() {
  ElMessage.success("点击触发");
}
</script>

<style></style>
