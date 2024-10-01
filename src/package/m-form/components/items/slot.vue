<template>
  <el-form-item :prop="item.prop">
    <!-- label -->
    <template #label v-if="item.label">
      <form-label :label="item.label" :tip="item.tip" :labelWidth="labelWidth" />
    </template>

    <slot :name="item.prop" :row="item" />
  </el-form-item>
</template>
<script lang="ts" setup>
// _Improt
import formLabel from "../label.vue";
import { itemsSlotPropsType } from "../../type";

// _Var
withDefaults(defineProps<itemsSlotPropsType>(), {
  data: () => ({})
});
</script>
<style lang="scss" scoped></style>
