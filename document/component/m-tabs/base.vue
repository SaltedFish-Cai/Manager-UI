<template>
  <div class="vp_title_label">标准</div>
  <m-tabs v-model="activeName">
    <m-tab-item label="第一页" name="page1"> page1 </m-tab-item>
    <m-tab-item label="第二页" name="page2"> page2 </m-tab-item>
    <m-tab-item label="第三页" name="page3"> page3 </m-tab-item>
    <m-tab-item label="第四页" name="page4"> page4 </m-tab-item>
  </m-tabs>

  <m-tabs v-model="activeName" card>
    <m-tab-item label="第一页" name="page1"> page1 </m-tab-item>
    <m-tab-item label="第二页" name="page2"> page2 </m-tab-item>
    <m-tab-item label="第三页" name="page3"> page3 </m-tab-item>
    <m-tab-item label="第四页" name="page4"> page4 </m-tab-item>
  </m-tabs>

  <div class="vp_title_label">组合使用</div>
  <m-tabs v-model="activeName2" card useHeaderLine>
    <m-tab-item label="第一页" name="page1">
      <m-tabs v-model="activeName5" portrait>
        <m-tab-item label="第一页" name="page1-1"> page1 </m-tab-item>
        <m-tab-item label="第二页" name="page2-1"> page2 </m-tab-item>
        <m-tab-item label="第三页" name="page3-1"> page3 </m-tab-item>
        <m-tab-item label="第四页" name="page4-1"> page4 </m-tab-item>
      </m-tabs></m-tab-item
    >
    <m-tab-item label="第二页" name="page2"> page2 </m-tab-item>
    <m-tab-item label="第三页" name="page3"> page3 </m-tab-item>
    <m-tab-item label="第四页" name="page4"> page4 </m-tab-item>
  </m-tabs>

  <div class="vp_title_label">纵向</div>

  <m-tabs v-model="activeName3" portrait>
    <m-tab-item label="第一页" name="page1"> page1 </m-tab-item>
    <m-tab-item label="第二页" name="page2"> page2 </m-tab-item>
    <m-tab-item label="第三页" name="page3"> page3 </m-tab-item>
    <m-tab-item label="第四页" name="page4"> page4 </m-tab-item>
  </m-tabs>

  <div class="vp_title_label">纵向卡片</div>

  <m-tabs v-model="activeName4" portrait card>
    <m-tab-item label="第一页" name="page1"> page1 </m-tab-item>
    <m-tab-item label="第二页" name="page2"> page2 </m-tab-item>
    <m-tab-item label="第三页" name="page3"> page3 </m-tab-item>
    <m-tab-item label="第四页" name="page4"> page4 </m-tab-item>
  </m-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName = ref("page1");
const activeName2 = ref("page1");
const activeName3 = ref("page1");
const activeName4 = ref("page1");
const activeName5 = ref("page2-1");
</script>

<style scoped lang="scss">
.vp_title_label {
  margin-top: 20px;
  margin-bottom: 5px;
  &:first-child {
    margin-top: 0;
  }
}
</style>
