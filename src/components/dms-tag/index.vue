<template>
  <template v-for="(item, index) in props.stateList" :key="item.id">
    <el-tag
      v-if="String(item.value) == String(props.state)"
      :effect="useFont ? 'light' : 'dark'"
      :type="StateKey[item.key] ? StateKey[item.key][index] : ''"
      :disable-transitions="true"
    >
      <m-icon v-if="useFont" class="mr5" :name="fontList[item.key][item.value]"></m-icon>
      <span> {{ item.text }}</span>
    </el-tag>
  </template>
</template>
<script lang="ts" setup>
// import { reactive, onMounted } from "vue";
import StateKey from "./state-key";
import fontList from "./font-key";
import { Obj } from "@/package/global";
const props = defineProps<{
  state: number | string;
  stateList: Obj[];
  useFont?: boolean;
}>();
</script>
<style lang="scss" scoped></style>
