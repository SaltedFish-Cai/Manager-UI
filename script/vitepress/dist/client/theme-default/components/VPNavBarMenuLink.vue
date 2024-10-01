<script lang="ts" setup>
import type { DefaultTheme } from "vitepress/theme";
import { useData } from "../composables/data";
import { isActiveGroup } from "../../shared";
import VPLink from "./VPLink.vue";

defineProps<{
  item: DefaultTheme.NavItemWithLink;
}>();

const { page } = useData();
</script>

<template>
  <VPLink
    :class="{
      VPNavBarMenuLink: true,
      active: isActiveGroup(page.relativePath, item.activeMatch || item.link, !!item.activeMatch)
    }"
    :href="item.link"
    :target="item.target"
    :rel="item.rel"
    tabindex="0"
  >
    <span v-html="item.text"></span>
  </VPLink>
</template>

<style scoped>
.VPNavBarMenuLink {
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
  transition: 0.2s;
}

.VPNavBarMenuLink.active {
  color: var(--el-color-primary);
  font-weight: bold;
  transform: scale(1.3);
}
.VPNavBarMenuLink + .VPNavBarMenuLink {
  margin-left: 10px;
}

.VPNavBarMenuLink:hover {
  color: var(--el-color-primary);
}
</style>
