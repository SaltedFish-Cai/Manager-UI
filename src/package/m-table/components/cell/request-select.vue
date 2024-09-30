<template>
  <template v-if="item.prop && (item.cellConfig?.type == 'request-select' || item.cellConfig?.type == 'multiple-request-select')">
    <div class="hidden-span" v-if="!row?.cellConfig?.options[item.prop]">
      {{ remoteMethod("", item.prop, item, row, true) }}
    </div>
    <cell-item
      :item="{
        ...item.cellConfig,
        display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
        prop: item.prop,
        placeholder: `${item.cellConfig.placeholder || '请选择' + item.label}`,
        disabled: exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row)
      }"
      :data="row"
      :ex-options="item.exOption"
      @online-select-change="data => onlineSelectChange(data.prop, data.data, data.type)"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope"> <slot :name="slot" v-bind="scope"></slot> </template>
    </cell-item>
  </template>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import CellItem from "@/package/m-elements/select/index.vue";
import { ColumnProps } from "../../type";
import { Obj } from "@/package/global";

type CellProps = {
  item: ColumnProps & { exOption?: {} };
  row?: Obj;
  exDisabled?: {};
  exDisplay?: {};
  exOptions?: {};
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
