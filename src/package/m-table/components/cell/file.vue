<template>
  <!-- file -->
  <cell-item
    v-if="item.prop && item.cellConfig?.type == 'file'"
    :item="{
      ...item.cellConfig,
      prop: item.prop,
      display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
      placeholder: `${item.cellConfig.placeholder || '请选择' + item.label}`,
      disabled: exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row),
      fileAttached: exFileData[item.prop]
    }"
    :data="row"
    :uploadConfig="uploadConfig"
  ></cell-item>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import { computed } from "vue";
import { useBaseStore } from "../../../store/index";

import CellItem from "@/package/m-elements/file/index.vue";
import { ColumnProps } from "../../type";
import { Obj } from "@/package/global";

type CellProps = {
  item: ColumnProps;
  row?: Obj;
  exDisabled?: {};
  exDisplay?: {};
  exFileData?: {};
};
const globalState = useBaseStore();

const uploadConfig = computed(() => ({
  host: globalState.getApiHost || "",
  token: globalState.getToken || "",
  version: globalState.getVersion || ""
}));

withDefaults(defineProps<CellProps>(), {
  exDisabled: () => ({}),
  exDisplay: () => ({}),
  exFileData: () => ({})
});
</script>

<style lang="scss"></style>
