<template>
  <m-form id="case-ex-rules-from-demo" ref="proForm" :structure="formConfig" :ex-rules="exRules" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { mFormStructureType } from "@/package/global";

const proForm = ref();

const formConfig: mFormStructureType[] = [{ label: "Input1", prop: "Input1", type: "input" }];

const exRules = ref({
  Input1: [{ validator: Input1Rules, trigger: "blur" }]
});

function Input1Rules(rule: any, value: any, callback: any) {
  const rg = /^[A-Z0-9]{5}$/;
  if (rg.test(value)) {
    callback();
  } else {
    callback(new Error("请正确填写"));
  }
}
</script>

<style scoped></style>
