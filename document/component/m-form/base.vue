<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="formData"> </code-view>

  <m-form id="base-from-demo" ref="proForm" :structure="formConfig" :ex-options="exOptions" :use-rules="false" />

  <div class="flex-center">
    <m-button is="submit" @click="submitForm">提交Form</m-button>
  </div>
</template>

<script lang="ts" setup>
import { mFormStructureType } from "@/package/global";
import { ref } from "vue";

const proForm = ref();
const formData = ref({});

const formConfig: mFormStructureType[] = [
  { label: "Input1", tip: "Tip Message", prop: "Input1", type: "textarea", maxLength: 100 },
  { label: "Input2", prop: "Input2", type: "input", rules: [{ required: false }] },
  { label: "Select1", prop: "Select1", type: "select" }
];

const exOptions = ref({
  Select1: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

async function submitForm() {
  const data = await proForm.value.getSubmitForm();
  if (data) {
    formData.value = data;
  }
}
</script>

<style scoped></style>
