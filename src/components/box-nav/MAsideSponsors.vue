<script setup lang="ts">
import { VPDocAsideSponsors } from "vitepress/theme";

const data = [
  {
    items: [{ img: "" }]
  },
  {
    items: [{ img: "" }]
  }
];
</script>

<template>
  <VPDocAsideSponsors :data="data" />
</template>

<style>
.vp-sponsor-grid.medium .vp-sponsor-grid-image {
  max-height: 90px;
}
</style>
