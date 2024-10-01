<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="tableFormData"> </code-view>

  <div class="vp_title_label">效果展示</div>
  <m-table
    id="cell-table-demo-submit"
    ref="proTable"
    flat
    embeddedToolButton
    :structure="tableConfig"
    :request-api="getTableList"
    :ex-dependent="exDependent"
    row-key="Text"
  >
    <template #operation>
      <m-button is="edit"> 编辑 </m-button>
    </template>
  </m-table>
  <div class="flex-center mt10">
    <m-button is="edit" @click="submitTable"> 提交表格 </m-button>
  </div>
</template>

<script lang="ts" setup>
import { mTableStructureType } from "@/package/global";
import { ref } from "vue";

const proTable = ref();
const params = ref({});
const tableFormData = ref({});

const tableConfig: mTableStructureType[] = [
  { label: "Cell-Input", prop: "Input", cellConfig: { type: "input" } },
  { label: "Cell-Input1", prop: "Input1", cellConfig: { type: "input" } },
  { label: "Cell-Input2", prop: "Input2", cellConfig: { type: "input" } },
  { label: "Cell-Input3", prop: "Input3", cellConfig: { type: "input", required: false } },
  { label: "Cell-Input4", prop: "Input4", cellConfig: { type: "input", display: true } }
];

const exDependent = {
  submitRule: {
    Input1: {
      roleFn: data => data.Input1 >= 99,
      errorMessage: "Input值必须大于99"
    },
    Input2: {
      roleFn: Input2roleFn
    }
  }
};

function Input2roleFn(data) {
  if (data.Input2 == 1) return "不可为1";
  if (data.Input2 == 2) return "不可为2";
  if (data.Input2 != 3) return "填写1-3";
  return true;
}

async function getTableList(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: "select-2", Input: 999, Number: 81827, Switch: true },
        { Text: "Text-692fds002", Select: "select-1", Input: 999, Number: 0, Switch: true },
        {}
      ]
    },
    Code: 200
  };
}

function submitTable() {
  const data = proTable.value.getSubmitTableList();
  console.log("++++++++++> data:", data);
  tableFormData.value = data;
}
</script>

<style scoped>
.vp_title_label {
  height: 32px;
}
.in_title_label {
  width: 33%;
  font-size: 14px;
}
.config-box {
  flex-wrap: wrap;
  padding: 5px 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
}
</style>
