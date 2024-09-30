<template>
  <div style="height: 400px">
    <m-tabs v-model="state.activeName" card>
      <m-tab-item label="User" name="one" scroll>
        <div style="height: 800px; width: 1200px">scroll</div>
      </m-tab-item>
      <m-tab-item label="User" name="two">
        <div style="height: 800px; width: 1200px">no-scroll</div>
      </m-tab-item>
    </m-tabs>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const state = reactive({
  activeName: "one"
});
</script>

<style scoped lang="scss"></style>
