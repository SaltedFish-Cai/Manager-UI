<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="tableFormData"> </code-view>

  <div class="vp_title_label">效果展示</div>
  <m-table
    id="cell-table-demo"
    ref="proTable"
    flat
    embeddedToolButton
    :structure="tableConfig"
    :request-api="getTableList"
    :ex-options="exOptions"
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
  { label: "Cell-Text", prop: "Text" },
  { label: "Cell-Input", prop: "Input", cellConfig: { type: "input" } },
  // { label: "Cell-Textarea", prop: "Input", cellConfig: { type: "textarea" } },
  { label: "Cell-Number", prop: "Number", cellConfig: { type: "number", min: -10, display: true, precision: 2 } },
  { label: "Cell-Select", prop: "Select", cellConfig: { type: "select" } },
  { label: "Cell-Multiple-Select", prop: "MultipleSelect", cellConfig: { type: "multiple-select" }, width: 300 },
  { label: "Cell-Switch", prop: "Switch", cellConfig: { type: "switch", activeText: "aa", inActiveText: "bb" } },
  { label: "Cell-Radio", prop: "Radio", cellConfig: { type: "radio" } },
  { label: "Cell-Checkbox", prop: "CheckBox", cellConfig: { type: "checkbox" } },
  { label: "Cell-Cascader", prop: "Cascader", cellConfig: { type: "cascader" } },
  { label: "Cell-Time", prop: "Time", cellConfig: { type: "date-picker-group" } },
  { label: "Cell-Icon", prop: "Icon", cellConfig: { type: "select-icon" } },
  { label: "Cell-File", prop: "File", cellConfig: { type: "file" } },
  { label: "Cell-Request-Select", prop: "requestSelect", cellConfig: { type: "request-select" } },
  {
    label: "Cell-Request-Select",
    prop: "requestSelect2",
    cellConfig: { type: "multiple-request-select", requestBy: "requestSelect" }
  },
  {
    label: "Cell-Online-Select",
    prop: "onlineSelect",
    cellConfig: { type: "online-select" }
  },
  { label: "操作", prop: "operation" }
];

const exDependent = {
  requestFunction: { requestSelect, requestSelect2: requestSelect, onlineSelect },
  disabledRule: { Input: disabledRule },
  submitRule: {
    Input: {
      roleFn: InputRole,
      errorMessage: "Input值必须大于99"
    }
  },
  fileData: {
    File: { FileTypeCode: "AppealLabelCodeConfirmFiles", BusinessIdentifier: "" }
  }
};

function InputRole(data) {
  return data.Input >= 99;
}

async function requestSelect() {
  // const List = await Api();
  const opt = [
    { label: "online-选项1", value: "request-value-1" },
    { label: "online-选项2", value: "request-value-2" }
  ];
  return opt;
}

async function onlineSelect() {
  // const List = await Api();
  const opt = [
    { label: "online-选项33", value: "online-value-1" },
    { label: "online-选项44", value: "online-value-2" }
  ];
  return opt;
}

function disabledRule(row) {
  return row.Input == 999;
}

const exOptions = ref({
  Select: [
    { label: "选项1", value: "select-1" },
    { label: "选项2", value: "select-2" }
  ],
  MultipleSelect: [
    { label: "多选项1", value: "multiple-select-1" },
    { label: "多选项2", value: "multiple-select-2" },
    { label: "多选项3", value: "multiple-select-3" },
    { label: "多选项4", value: "multiple-select-4" },
    { label: "多选项5", value: "multiple-select-5" }
  ],
  Switch: {
    activeText: "A",
    inActiveText: "B"
  },
  Radio: [
    { label: "A", value: "a" },
    { label: "B", value: "b" }
  ],
  CheckBox: [
    { label: "A", value: "a" },
    { label: "B", value: "b" }
  ],
  Cascader: [
    {
      label: "A",
      value: "a",
      children: [
        { label: "A-A", value: "aa" },
        { label: "A-B", value: "ab" }
      ]
    },
    {
      label: "B",
      value: "b",
      children: [
        { label: "B-A", value: "ba" },
        { label: "B-B", value: "bb" }
      ]
    }
  ]
});

async function getTableList(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: "select-2", Input: 999, Number: 81827, Switch: true },
        { Text: "Text-692fds002", Select: "select-1", Input: 999, Number: 0, Switch: true },
        { Text: "Text-d2i23411", Select: "select-2", Input: 66 }
      ]
    },
    Code: 200
  };
}

function submitTable() {
  const data = proTable.value.getSubmitTableList();
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
