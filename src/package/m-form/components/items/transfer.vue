<template>
  <el-transfer
    v-model="data[item.prop]"
    filterable
    :titles="['未选择', '已选择']"
    :button-texts="['取消', '选择']"
    filter-placeholder="点击搜索"
    :data="item.options || (item.prop && inExOptions && inExOptions[item.prop]) || []"
    :disabled="item.disabled"
  >
    <template #default="{ option }">
      <span> {{ option.label }}</span>
    </template>
  </el-transfer>
</template>
<script lang="ts" setup>
import { FormItemType } from "../../type";

type Props = {
  item: FormItemType & { prop: string };
  data?: {};
  inExOptions: {};
  labelWidth?: number;
};
withDefaults(defineProps<Props>(), {
  data: () => ({}),
  inExOptions: () => ({})
});
</script>
<style lang="scss" scoped></style>
