<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="formData"> </code-view>

  <m-form id="tab-from-demo" ref="proForm" :structure="formConfig" :ex-options="exOptions" :span="2" />

  <div class="flex-center">
    <m-button is="submit" @click="submitForm">提交Form</m-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { mFormStructureType } from "@/package/global";

const proForm = ref();
const formData = ref({});

const formConfig: mFormStructureType[] = [
  {
    unitName: "单元",
    unitTip: "单元提示",
    label: "group组",
    tip: "这是一则提示",
    prop: "groupProp",
    type: "group",
    groupFormConfig: [
      {
        label: "选项1",
        prop: "childProp1",
        type: "input",
        value: "value1"
      },
      {
        label: "选项2",
        prop: "childProp2",
        value: "value2",
        type: "select"
      }
    ]
  }
];

const exOptions = ref({
  childProp2: [
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
