<template>
  <!-- select-icon -->
  <cell-item
    v-if="item.prop && item.cellConfig?.type == 'select-icon'"
    :item="{
      ...item.cellConfig,
      prop: item.prop,
      display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
      placeholder: `${item.cellConfig.placeholder || '请选择' + item.label}`,
      disabled: exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row)
    }"
    :data="row"
  ></cell-item>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import CellItem from "@/package/m-elements/icon/index.vue";
import { ColumnProps } from "../../type";
import { Obj } from "@/package/global";

type CellProps = {
  item: ColumnProps;
  row?: Obj;
  exDisabled?: {};
  exDisplay?: {};
};

withDefaults(defineProps<CellProps>(), {
  exDisabled: () => ({}),
  exDisplay: () => ({})
});
</script>

<style lang="scss"></style>
