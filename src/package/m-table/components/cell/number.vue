<template>
  <!-- number -->
  <cell-item
    v-if="item.prop && item.cellConfig?.type == 'number'"
    :item="{
      ...item.cellConfig,
      max: maxSize,
      min: minSize,
      display: item.cellConfig.display || (exDisplay[item.prop] && exDisplay[item.prop](row)),
      prop: item.prop,
      placeholder: `${item.cellConfig.placeholder || '请输入' + item.label}`,
      disabled: exDisabled && exDisabled[item.prop] && exDisabled[item.prop](row)
    }"
    :data="row"
  ></cell-item>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import { computed } from "vue";
import CellItem from "@/package/m-elements/number/index.vue";
import { ColumnProps } from "../../type";
import { Obj } from "@/package/global";

type CellProps = {
  item: ColumnProps;
  row?: Obj;
  exDisabled?: {};
  exDisplay?: {};
};

const props = withDefaults(defineProps<CellProps>(), {
  exDisabled: () => ({}),
  exDisplay: () => ({})
});

const maxSize = computed(() => {
  const { item, row } = props;
  if (item.cellConfig?.maxBy && row?.[item.cellConfig?.maxBy]) {
    return row?.[item.cellConfig?.maxBy];
  } else {
    return item?.cellConfig?.max || 2147483647;
  }
});

const minSize = computed(() => {
  const { item, row } = props;
  if (item.cellConfig?.minBy && row?.[item.cellConfig?.minBy]) {
    return row?.[item.cellConfig?.minBy];
  } else {
    return item?.cellConfig?.min || -2147483647;
  }
});
</script>

<style lang="scss"></style>
