<template>
  <el-row>
    <m-button font="star_arc_line" @click="debouncedClick">左侧</m-button>
    <m-button font="star_arc_line" position="right" @click="debouncedClick">右侧</m-button>
  </el-row>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";

function debouncedClick() {
  ElMessage.success("点击触发");
}
</script>

<style></style>
