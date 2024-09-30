<template>
  <m-table
    id="children-table-demo"
    ref="proTable"
    row-key="Text"
    flat
    :structure="tableConfig"
    :request-api="getTableList"
    :ex-options="exOptions"
  >
    <template #operation>
      <m-button is="edit"> 编辑 </m-button>
    </template>
  </m-table>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { mTableStructureType } from "@/package/global";

const proTable = ref();

const tableConfig: mTableStructureType[] = [
  { type: "row", fixed: "left" },
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Select", prop: "Select", filterType: "select" },
  { label: "操作", prop: "operation" }
];

const exOptions = ref({
  Select: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

async function getTableList(params: any) {
  console.log("++++++++++> params:", params);
  //  params 示例 {Filter:[],Page:{PageNum:1,PageSize:20},Params:{},Sort:[]}
  // return Ajax(params); // 使用接口请求数据

  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: "1", children: [{ Text: "Text-3221cars", Select: "1" }] },
        { Text: "Text-d2i23411", Select: "2", children: [{ Text: "Text-d2fda234", Select: "1" }] }
      ]
    },
    Code: 200
  };
}
</script>

<style scoped></style>
