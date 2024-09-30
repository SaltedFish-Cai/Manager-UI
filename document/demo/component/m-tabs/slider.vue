<template>
  <div class="max-box">
    <m-tabs v-model="activeName5" slider card>
      <m-tab-item label="第一页" name="page1-1"> <div class="box">page1</div> </m-tab-item>
      <m-tab-item label="第二页" name="page2-1"> <div class="box">page2</div> </m-tab-item>
      <m-tab-item label="第三页" name="page3-1" :tips="'tips'"> <div class="box">page3</div> </m-tab-item>
      <m-tab-item label="第四页" name="page4-1">
        <div class="box">page4</div>
        <template #tips>tips2</template>
      </m-tab-item>
    </m-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName5 = ref("page3-1");
</script>

<style scoped lang="scss">
.vp_title_label {
  margin-top: 20px;
  margin-bottom: 5px;
  &:first-child {
    margin-top: 0;
  }
}
.max-box {
  height: 400px;
}
.box {
  width: 100%;
  height: 500px;
}
</style>
