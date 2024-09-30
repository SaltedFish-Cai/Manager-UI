<template>
  <div class="vp_title_label">baseFormData结果值：</div>

  <code-view v-model:html="baseFormData"> </code-view>

  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="formData"> </code-view>

  <m-form id="base-from-demo" :data="baseFormData" ref="proForm" :structure="formConfig" :ex-options="exOptions" />

  <div class="flex-center">
    <m-button is="submit" @click="submitForm">提交Form</m-button>
    <m-button is="go" @click="changeData">二次修改默认值</m-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { mFormStructureType } from "@/package/global";

const proForm = ref();
const baseFormData = ref({
  Input2: "默认值",
  Select1: 1
});
const formData = ref({});

const formConfig: mFormStructureType[] = [
  { label: "Input1", tip: "Tip Message", prop: "Input1", type: "input" },
  { label: "Input2", prop: "Input2", type: "input", rules: [{ required: false }] },
  { label: "Select1", prop: "Select1", type: "select" }
];

const exOptions = ref({
  Select1: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

async function changeData() {
  baseFormData.value = {
    Input2: "默认值2",
    Select1: 2
  };
}

async function submitForm() {
  const data = await proForm.value.getSubmitForm();
  if (data) {
    formData.value = data;
  }
}
</script>

<style scoped></style>
