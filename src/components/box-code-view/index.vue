<template>
  <section class="mb10 mt5 code-view">
    <json-viewer :value="JSON.parse(code)" :expand-depth="expandDepth" boxed sort :show-array-index="false" :copyable="copyable">
      <template #copy v-if="copyable"> Copy </template>
    </json-viewer>
  </section>
</template>

<script setup lang="ts" name="boxCodeView">
import { computed } from "vue";

interface ProTableProps {
  html: object;
  placeholder?: string;
  height?: number;
  autofocus?: boolean;
  copyable?: boolean;
  expandDepth?: number;
}
const props = withDefaults(defineProps<ProTableProps>(), {
  html: () => ({}),
  placeholder: "Code goes here...",
  height: 200,
  autofocus: false,
  copyable: false,
  expandDepth: 5
});

const code = computed(() => {
  const jsonStr = JSON.stringify(props.html);
  return jsonStr;
});
</script>

<style lang="scss">
.code-view {
  .jv-container .jv-code {
    padding: 10px 20px !important;
  }
  .jv-container.boxed {
    &:hover {
      border: 1px solid var(--vp-c-purple);
      box-shadow: none;
    }
  }
}
</style>
