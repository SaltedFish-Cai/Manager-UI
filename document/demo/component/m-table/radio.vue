<template>
  <m-table
    id="radio-table-demo"
    ref="proTable"
    row-key="Text"
    flat
    :structure="tableConfig"
    :request-api="getTableList"
    :ex-options="exOptions"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { mTableStructureType } from "@/package/global";

const proTable = ref();

const tableConfig: mTableStructureType[] = [
  { type: "radio", fixed: "left" },
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Select", prop: "Select", filterType: "select" }
];

const exOptions = {
  Select: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
};

async function getTableList(params: any) {
  console.log("++++++++++> params:", params);

  //  params 示例 {Filter:[],Page:{PageNum:1,PageSize:20},Params:{},Sort:[]}
  // return Ajax(params); // 使用接口请求数据

  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: 1 },
        { Text: "Text-d2i23411", Select: 2 }
      ]
    },
    Code: 200
  };
}
</script>

<style scoped></style>
