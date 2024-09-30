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
  Input1: "北京市/西城区",
  File1: [
    {
      CreateDate: "2024-04-23 15:55:31",
      FileFullPath: null,
      FileId: "ff1502d1-ac4c-41cc-8d68-98171e2679a6",
      FileName: "经销商备案信息_20240423103821.xlsx",
      FileThumbName: "",
      FileTypeId: 0,
      FileUrl: "upload/DealerInfo/AppealLabelCodeConfirmFiles/20208799/202404/db681f43-3c89-4353-8402-a077e2b2c9b0.xlsx",
      FullPath:
        "https://dms-qas.bbraun.cn/newapi/upload/DealerInfo/AppealLabelCodeConfirmFiles/20208799/202404/db681f43-3c89-4353-8402-a077e2b2c9b0.xlsx",
      Id: 0,
      OriginalName: "经销商备案信息_20240423103821.xlsx"
    }
  ]
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
