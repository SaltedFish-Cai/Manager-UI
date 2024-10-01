<template>
  <div class="vp_title_label">Form状态：{{ formState }}</div>

  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="formData"> </code-view>

  <m-form
    id="show-from-demo"
    ref="proForm"
    :labelWidth="100"
    :labelPosition="'right'"
    :data="baseFormData"
    :structure="formConfig"
    @on-form-state-change="item => (formState = item)"
  >
  </m-form>

  <div class="flex-center">
    <m-button is="submit" @click="submitForm">提交Form</m-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { mFormStructureType } from "@/package/global";

const proForm = ref();
const formState = ref("");
const baseFormData = ref({
  Input1: "北京市/西城区"
});

const formData = ref({});

const formConfig: mFormStructureType[] = [
  { label: "输入框", prop: "Input1", type: "input" },
  {
    label: "文件",
    prop: "File1",
    type: "file"
    // fileMultiple: 2,
    // fileAttached: { FileTypeCode: "AppealLabelCodeConfirmFiles", BusinessIdentifier: "" },
    // fileIncludeType: [".png"],
    // fileExcludeType: [".jpg"],
    // fileSize: 2048
  }
];

setTimeout(() => {
  nextTick(() => {
    proForm.value?.resetStructure("Input1", {
      inputParser: text => {
        return "#" + text;
      },
      inputFormatter: text => {
        return "%" + text;
      }
    });

    proForm.value?.resetStructure("File1", {
      fileIncludeType: [".png", ".jpg"],
      fileExcludeType: [".jpeg"],
      fileAttached: { FileTypeCode: "AppealLabelCodeConfirmFiles", BusinessIdentifier: "" },
      fileMultiple: 3,
      fileSingleSize: 0.1 * 1024,
      fileAllSize: 0.2 * 1024
    });
  });
}, 1000);

async function submitForm() {
  const data = await proForm.value.getSubmitForm();
  if (data) {
    formData.value = data;
  }
}
</script>

<style scoped></style>
