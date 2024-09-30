<template>
  <m-table
    id="select-table-demo"
    ref="proTable"
    row-key="Text"
    flat
    :structure="tableConfig"
    :request-api="getTableList"
    :ex-options="exOptions"
    @select-row-back="selectRowBack"
    @select-row-all-back="selectRowAllBack"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { mTableStructureType } from "@/package/global";

const proTable = ref();

const tableConfig: mTableStructureType[] = [
  { type: "selection", fixed: "left" },
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Select", prop: "Select", filterType: "select" }
];
const exOptions = {
  Select: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
};

function selectRowBack(data) {
  console.log("++++++++++> selectRowBack:", data);
}

function selectRowAllBack(data) {
  console.log("++++++++++> selectRowAllBack:", data);
}

async function getTableList(params: any) {
  console.log("++++++++++> params:", params);
  const page = params.Page.PageNum;
  //  params 示例 {Filter:[],Page:{PageNum:1,PageSize:20},Params:{},Sort:[]}
  // return Ajax(params); // 使用接口请求数据
  proTable.value.setSelectedList([
    { Text: "Text-692f8202", Select: 2 },
    { Text: "Text-6dsf8002", Select: 2 },
    { Text: "Text-crlf8d02", Select: 1 }
  ]);
  return {
    Data: {
      TotalCount: 40,
      List:
        page == 1
          ? [
              { Text: "Text-692f8002", Select: 1 },
              { Text: "Text-69lf8d02", Select: 2 },
              { Text: "Text-69hfhr02", Select: 2 },
              { Text: "Text-692f8202", Select: 1 },
              { Text: "Text-d2i23411", Select: 2 },
              { Text: "Text-d2i2cd11", Select: 1 },
              { Text: "Text-d2ifs211", Select: 2 }
            ]
          : [
              { Text: "Text-6dsf8002", Select: 2 },
              { Text: "Text-crlf8d02", Select: 1 }
            ]
    },
    Code: 200
  };
}
</script>

<style scoped></style>
