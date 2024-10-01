<script lang="ts" setup>
import { useData } from "../composables/data";
import VPSwitchAppearance from "./VPSwitchAppearance.vue";
import VPSwitchAppearanceLine from "./VPSwitchAppearanceLine.vue";
import VPSelectColor from "./VPSelectColor.vue";
import VPSelectSize from "./VPSelectSize.vue";

const { site, env } = useData();
</script>

<template>
  <div v-if="site.appearance && site.appearance !== 'force-dark'" class="VPNavBarAppearance">
    <VPSwitchAppearance v-if="env == 'document'" />
    <VPSwitchAppearanceLine v-else />
    <VPSelectColor class="ml10" />
    <VPSelectSize class="ml10" />
  </div>
</template>

<style scoped>
.VPNavBarAppearance {
  display: none;
}

@media (min-width: 1280px) {
  .VPNavBarAppearance {
    display: flex;
    align-items: center;
  }
}
</style>
