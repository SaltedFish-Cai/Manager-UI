<template>
  <div :class="['mb10', props.flat ? '' : 'SearchForm-card']">
    <m-form id="m-table-search-from" ref="proForm" :structure="columns" :useRequired="false"></m-form>
    <div class="flex-end">
      <el-button type="primary" plain>搜索</el-button>
      <el-button plain>取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="testAdmin">
// _Import
import { ref } from "vue";
import { ProTablePropsType } from "../type";

// _Var
const props = withDefaults(defineProps<ProTablePropsType>(), {
  flat: false,
  columns: () => [],
  exOptions: {}
});
const proForm = ref();
</script>

<style scoped lang="scss">
.SearchForm-card {
  box-sizing: border-box;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
</style>
