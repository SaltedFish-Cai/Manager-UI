<template>
  <!-- cascader -->
  <cell-item
    v-if="
      item.prop &&
      (item.cellConfig?.type == 'cascader' ||
        item.cellConfig?.type == 'cascader-check' ||
        item.cellConfig?.type == 'multiple-cascader-check' ||
        item.cellConfig?.type == 'multiple-cascader')
    "
    :item="{
      ...item.cellConfig,
      display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
      prop: item.prop,
      placeholder: `${item.cellConfig.placeholder || '请选择' + item.label}`,
      disabled: exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row)
    }"
    :data="row"
    :exOptions="exOptions"
  ></cell-item>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import CellItem from "@/package/m-elements/cascader/index.vue";
import { ColumnProps } from "../../type";
import { Obj } from "@/package/global";

type CellProps = {
  item: ColumnProps;
  row?: Obj;
  exDisabled?: {};
  exDisplay?: {};
  exOptions?: {};
};

withDefaults(defineProps<CellProps>(), {
  exDisabled: () => ({}),
  exDisplay: () => ({}),
  exOptions: () => ({})
});
</script>

<style lang="scss"></style>
