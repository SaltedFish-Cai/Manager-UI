<template>
  <div class="flex config-box">
    <div class="in_title_label">是否现实第二页：<el-switch v-model="switchValue" /></div>
  </div>

  <m-tabs v-model="activeName">
    <m-tab-item label="第一页" name="page1">
      <template #label>
        <m-icon name="applet_line" />
        <span>Page1</span>
      </template>
      page1
    </m-tab-item>
    <m-tab-item v-if="switchValue" label="第二页" name="page2"> page2 </m-tab-item>
    <m-tab-item label="第三页" name="page3"> page3 </m-tab-item>
    <m-tab-item label="第四页" name="page4"> page4 </m-tab-item>
  </m-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName = ref("page1");
const switchValue = ref(false);
</script>

<style scoped lang="scss"></style>
