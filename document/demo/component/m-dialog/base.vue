<template>
  <m-button is="go" @click="visible = true">显示弹窗</m-button>
  <m-dialog v-model="visible" title="弹出框Dialog" useFull>
    <template #header>自定义 Header</template>
    Slot
    <template #footer>自定义 Footer</template>
  </m-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const visible = ref(false);
</script>

<style></style>
