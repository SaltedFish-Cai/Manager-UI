<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="formData"> </code-view>

  <m-form id="base-from-demo" ref="proForm" :structure="formConfig" :ex-options="exOptions" :data="baseData">
    <template #Input1="{ data }">
      <el-input v-model="data.Input1"></el-input>
    </template>
  </m-form>
</template>

<script lang="ts" setup>
import { mFormStructureType } from "@/package/global";
import { ref } from "vue";

const proForm = ref();
const formData = ref({});

const formConfig: mFormStructureType[] = [
  { label: "Input1", tip: "Tip Message", prop: "Input1", type: "slot" },
  { label: "Input2", prop: "Input2", type: "input", rules: [{ required: false }] },
  { label: "Select1", prop: "Select1", type: "select" }
];

const exOptions = ref({
  Select1: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

const baseData = ref({
  Input1: 22,
  Input2: 33
});
</script>

<style scoped></style>
