<template>
  <m-button is="go" @click="visible1 = true">显示弹窗 max</m-button>
  <m-button is="go" @click="visible2 = true">显示弹窗 s</m-button>
  <m-button is="go" @click="visible3 = true">显示弹窗 m</m-button>
  <m-button is="go" @click="visible4 = true">显示弹窗 l</m-button>
  <m-button is="go" @click="visible5 = true">自定义宽度</m-button>

  <m-dialog v-model="visible1" title="Size：max" size="max"> 页面宽度95% /高度95% </m-dialog>
  <m-dialog v-model="visible2" title="Size：s" size="s"> 页面宽度30%/高度70% </m-dialog>
  <m-dialog v-model="visible3" title="Size：m" size="m"> 页面宽度50%/高度70% </m-dialog>
  <m-dialog v-model="visible4" title="Size：l" size="l"> 页面宽度70%/高度70% </m-dialog>
  <m-dialog v-model="visible5" title="自定义宽度" width="200"> 自定义宽度 </m-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
const visible4 = ref(false);
const visible5 = ref(false);
</script>

<style></style>
