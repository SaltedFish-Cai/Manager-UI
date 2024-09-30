<template>
  <!-- time -->
  <cell-date
    v-if="
      item.prop &&
      (item.cellConfig?.type == 'date-picker-group' ||
        item.cellConfig?.type == 'date-picker' ||
        item.cellConfig?.type == 'date-time-range')
    "
    :item="{
      ...item.cellConfig,
      prop: item.prop,
      display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
      placeholder: `请选择${item.cellConfig.placeholder || item.label}`,
      disabled: exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row)
    }"
    :data="row"
  ></cell-date>

  <template v-if="item.prop && (item.cellConfig?.type == 'time-picker-group' || item.cellConfig?.type == 'time-picker')">
    <template v-if="!(exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row))">
      <cell-time
        :item="{
          ...item.cellConfig,
          display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
          prop: item.prop,
          placeholder: `${item.cellConfig.placeholder || '请选择' + item.label}`
        }"
        :data="row"
      ></cell-time>
    </template>

    <div v-else>{{ row[item.prop] || "--" }}</div>
  </template>

  <template v-if="item.prop && (item.cellConfig?.type == 'month-picker-group' || item.cellConfig?.type == 'month-picker')">
    <template v-if="!(exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row))">
      <cell-month
        :item="{
          ...item.cellConfig,
          display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
          prop: item.prop,
          placeholder: `${item.cellConfig.placeholder || '请选择' + item.label}`
        }"
        :data="row"
      ></cell-month>
    </template>

    <div v-else>{{ row[item.prop] || "--" }}</div>
  </template>

  <template v-if="item.prop && item.cellConfig?.type == 'year-picker'">
    <template v-if="!(exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row))">
      <cell-year
        :item="{
          ...item.cellConfig,
          display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
          prop: item.prop,
          placeholder: `${item.cellConfig.placeholder || '请选择' + item.label}`
        }"
        :data="row"
      ></cell-year>
    </template>

    <div v-else>{{ row[item.prop] || "--" }}</div>
  </template>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import CellDate from "@/package/m-elements/time/date.vue";
import CellTime from "@/package/m-elements/time/time.vue";
import CellMonth from "@/package/m-elements/time/month.vue";
import CellYear from "@/package/m-elements/time/year.vue";
import { Obj } from "@/package/global";

import { ColumnProps } from "../../type";

type CellProps = {
  item: ColumnProps;
  row?: Obj;
  exDisabled?: {};
  exDisplay?: {};
};

withDefaults(defineProps<CellProps>(), {
  row: () => ({}),
  exDisabled: () => ({}),
  exDisplay: () => ({})
});
</script>

<style lang="scss"></style>
