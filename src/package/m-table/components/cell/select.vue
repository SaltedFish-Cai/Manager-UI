<template>
  <!-- select -->
  <cell-item
    v-if="item.prop && (item.cellConfig?.type == 'select' || item.cellConfig?.type == 'multiple-select')"
    :item="{
      ...item.cellConfig,
      prop: item.prop,
      display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
      placeholder: `${item.cellConfig.placeholder || '请选择' + item.label}`,
      disabled: exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row)
    }"
    :data="row"
    :exOptions="exOptions"
  >
    <template v-for="slot in Object.keys($slots)" #[slot]="scope"> <slot :name="slot" v-bind="scope"></slot> </template>
  </cell-item>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import CellItem from "@/package/m-elements/select/index.vue";
import { ColumnProps } from "../../type";
import { Obj } from "@/package/global";

type CellProps = {
  item: ColumnProps;
  row?: Obj;
  exDisabled?: {};
  exOptions: {};
  exDisplay?: {};
};

withDefaults(defineProps<CellProps>(), {
  exDisabled: () => ({}),
  exOptions: () => ({}),
  exDisplay: () => ({})
});
</script>

<style lang="scss"></style>
