<template>
  <!-- select -->
  <el-table-column
    v-if="item.prop && item.cellConfig?.type == 'tag'"
    v-bind="item"
    min-width="200px"
    :align="item.align ?? 'left'"
  >
    <template #default="{ row }">
      <template v-if="!(exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row))">
        <cell-item :item="{ ...item.cellConfig, prop: item.prop }" :data="row" :exOptions="exOptions"></cell-item>
      </template>

      <div v-else>{{ row[item.prop] || "--" }}</div>
    </template>
  </el-table-column>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import CellItem from "@/package/m-elements/tag/index.vue";
import { ColumnProps } from "../../type";

type CellProps = {
  item: ColumnProps;
  exOptions: {};
  exDisabled?: {};
};
withDefaults(defineProps<CellProps>(), {
  exOptions: () => ({}),
  exDisabled: () => ({})
});
</script>

<style lang="scss"></style>
