<template>
  <m-tabs v-model="state.activeName">
    <m-tab-item label="User" name="first">
      <m-table
        vif=""
        id="base-table-demo1"
        ref="proTable1"
        flat
        :structure="tableConfig"
        :request-api="getTableList"
        :ex-options="exOptions"
      >
        <template #operation>
          <m-button is="edit"> 编辑 </m-button>
        </template>
      </m-table>
    </m-tab-item>
    <m-tab-item label="Config" name="second">
      <m-table
        id="base-table-demo2"
        ref="proTable2"
        flat
        :structure="tableConfig"
        :request-api="getTableList"
        :ex-options="exOptions"
      >
        <template #operation>
          <m-button is="edit"> 编辑编辑编辑 </m-button>
        </template>
      </m-table>
    </m-tab-item>
  </m-tabs>
</template>

<script lang="ts" setup>
import { mTableStructureType } from "@/package/global";
import { ref, reactive } from "vue";

const state = reactive({
  activeName: "first"
});
const proTable1 = ref();
const proTable2 = ref();

const params = ref({});

const tableConfig: mTableStructureType[] = [
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Select", prop: "Select", filterType: "select" },
  { label: "操作2", prop: "operation" }
];

const exOptions = ref({
  Select: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

async function getTableList(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: [1, 2] },
        { Text: "Text-d2i23411", Select: 2 }
      ]
    },
    Code: 200
  };
}
</script>

<style scoped lang="scss"></style>
