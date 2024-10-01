<template>
  <m-table
    id="expand-table-demo"
    ref="proTable"
    :structure="tableConfig"
    flat
    :request-api="getTableList"
    :ex-options="exOptions"
    row-key="Text"
  >
    <template #Expand="scope"> 这里是展开的内容 Scope : {{ scope }} </template>
    <template #operation="{ index, row }">
      <m-button is="edit" @click="openExpand(index, row)"> 编辑 </m-button>
    </template>
  </m-table>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import { mTableStructureType, mOptionType } from "@/package/global";

const proTable = ref();

const tableConfig: mTableStructureType[] = [
  { type: "expand", fixed: "left" },
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Select", prop: "Select", filterType: "select" },
  { label: "操作", prop: "operation" }
];

const exOptions: Ref<mOptionType> = ref({
  Select: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

function openExpand(index, row) {
  proTable.value.setExpandRowKey(index, row, true);
}

async function getTableList(params: any) {
  console.log("++++++++++> params:", params);

  //  params 示例 {Filter:[],Page:{PageNum:1,PageSize:20},Params:{},Sort:[]}
  // return Ajax(params); // 使用接口请求数据

  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: 1 },
        { Text: "Text-d22331d1", Select: 2 },
        { Text: "Text-dg223411", Select: 2 }
      ]
    },
    Code: 200
  };
}
</script>

<style scoped></style>
