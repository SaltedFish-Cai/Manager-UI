<template>
  <cell-item
    v-if="item.prop && (item.cellConfig?.type == 'online-select' || item.cellConfig?.type == 'multiple-online-select')"
    :item="{
      ...item.cellConfig,
      display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
      prop: item.prop,
      placeholder: `${item.cellConfig.placeholder || '请选择' + item.label}`,
      disabled: exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row)
    }"
    :data="row"
    @remote-method="data => remoteMethod(data.query, data.prop, data.item, data.data)"
    @online-select-change="data => onlineSelectChange(data.prop, data.data, data.type)"
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
  exDisplay?: {};
  remoteMethod: Function;
  onlineSelectChange: Function;
};

withDefaults(defineProps<CellProps>(), {
  exDisabled: () => ({}),
  exDisplay: () => ({}),
  exOptions: () => ({})
});
</script>

<style lang="scss"></style>
