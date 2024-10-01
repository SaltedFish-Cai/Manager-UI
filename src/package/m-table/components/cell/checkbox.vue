<template>
  <!-- checkbox -->
  <cell-item
    v-if="item.prop && item.cellConfig?.type == 'checkbox'"
    :item="{
      ...item.cellConfig,
      display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
      prop: item.prop,
      disabled: exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row)
    }"
    :data="row"
    :exOptions="exOptions"
  ></cell-item>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import CellItem from "@/package/m-elements/checkbox/index.vue";
import { ColumnProps } from "../../type";
import { Obj } from "@/package/global";

type CellProps = {
  item: ColumnProps;
  row?: Obj;
  exOptions?: {};
  exDisabled?: {};
  exDisplay?: {};
};

withDefaults(defineProps<CellProps>(), {
  exOptions: () => ({}),
  exDisabled: () => ({}),
  exDisplay: () => ({})
});
</script>

<style lang="scss"></style>
