<template>
  <m-button is="go" @click="visible1 = true">自定义高度数值</m-button>
  <m-button is="go" @click="visible2 = true">自定义高度百分比</m-button>
  <m-button is="go" @click="visible3 = true">自适应高度</m-button>

  <m-dialog v-model="visible1" title="自定义高度" height="200"> 自定义高度：200 </m-dialog>
  <m-dialog v-model="visible2" title="自定义高度" height="90%"> 自定义高度：90% </m-dialog>
  <m-dialog v-model="visible3" title="自适应高度" height="auto"> 自适应高度 </m-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
</script>

<style></style>
