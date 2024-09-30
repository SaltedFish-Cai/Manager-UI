<template>
  <section class="m-icon">
    <span
      v-if="!tip"
      :class="[
        'm-iconfont',
        'm-iconfont_icon',
        `icon-${name}`,
        button ? 'button' : '',
        circle ? 'circle button' : '',
        highlight ? 'highlight' : ''
      ]"
    ></span>
    <client-only v-else>
      <el-tooltip :content="tip"> <span class="m-iconfont m-iconfont_icon" :class="'icon-' + name"></span> </el-tooltip>
    </client-only>
  </section>
</template>

<script lang="ts" setup>
// _Var
defineProps<{ name: string; tip?: string; button?: boolean; circle?: boolean; highlight?: boolean }>();
</script>

<style lang="scss" scoped>
@import "./iconfont/iconfont.css";
@import "@/styles/mp.scss";
@import "@/styles/flex.scss";
.m-icon {
  display: inline-block;
}
.m-iconfont_icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: inherit;
  line-height: 1em;
}
</style>
