<template>
  <div class="flex config-box">
    <div class="in_title_label">显示筛选/刷新：<el-switch v-model="state.showToolButton" /></div>
    <div class="in_title_label">是否显示分页功能：<el-switch v-model="state.showPagination" /></div>
    <div class="in_title_label">显示一键全选按钮：<el-switch v-model="state.showSelectAll" /></div>
    <div class="in_title_label">显示尾部合计行：<el-switch v-model="state.showSummary" /></div>
    <div class="in_title_label">是否功能按钮嵌入式样式：<el-switch v-model="state.embeddedToolButton" /></div>
  </div>

  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="tableFormData"> </code-view>

  <div class="vp_title_label">效果展示</div>
  <m-table
    id="options-table-demo"
    ref="proTable"
    flat
    :structure="tableConfig"
    :request-api="getTableList"
    :ex-options="exOptions"
    :showToolButton="state.showToolButton"
    :showPagination="state.showPagination"
    :showSelectAll="state.showSelectAll"
    :showSummary="state.showSummary"
    :embeddedToolButton="state.embeddedToolButton"
    :exDependent="exDependent"
    :exPagination="exPagination"
    row-key="Text"
  >
    <template #operation>
      <m-button is="edit"> 编辑 </m-button>
    </template>
  </m-table>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { mTableStructureType } from "@/package/global";

const proTable = ref();
const params = ref({});
const tableFormData = ref({});
const state = reactive({
  showToolButton: true,
  showPagination: true,
  showSelectAll: true,
  showSummary: false,
  embeddedToolButton: false
});

const tableConfig: mTableStructureType[] = [
  { type: "selection", fixed: "left" },
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Input", prop: "Input", width: 200 },
  { label: "Label-Select", prop: "Select" },
  { label: "操作", prop: "operation" }
];

const exPagination = {
  pageNum: 2,
  pageSize: 1,
  pageSizes: [1, 2, 3]
};

const exDependent = {
  submitRule: {
    Input: {
      roleFn: InputRole,
      errorMessage: "自定义错误信息"
    }
  }
};

function InputRole(data) {
  return data.Input >= 99;
}

const exOptions = ref({
  Select: [
    { label: "选项1", value: "select-1" },
    { label: "选项2", value: "select-2" }
  ]
});

async function getTableList(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: "select-2", Input: 999 },
        { Text: "Text-d2i23411", Select: "select-2", Input: 66 }
      ]
    },
    Code: 200
  };
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
