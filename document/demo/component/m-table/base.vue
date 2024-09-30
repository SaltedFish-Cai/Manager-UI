<template>
  <div class="vp_title_label">接口请求参数(params)：</div>

  <code-view v-model:html="params"> </code-view>

  <m-table id="base-table-demo" ref="proTable" flat :structure="tableConfig" :request-api="getTableList" :ex-options="exOptions">
    <template #operation>
      <m-button key="key1" is="save" index="1" v-if="isFalse"> 编辑1 </m-button>
      <m-button key="key2" is="edit" index="2"> 编辑2 </m-button>
      <m-button key="key3" is="trash" index="3" v-if="isFalse"> 编辑3 </m-button>
      <m-button key="key4" is="edit" index="4"> 编辑4 </m-button>
      <m-button key="key5" is="edit" index="5"> 编辑5 </m-button>
      <m-button key="key6" is="edit" index="6"> 编辑6 </m-button>
    </template>

    <!-- <template #moreOperation>
      <m-button is="edit"> 更多按钮展示 </m-button>
    </template> -->
  </m-table>
</template>

<script lang="ts" setup>
import { mTableStructureType } from "@/package/global";
import { ref } from "vue";

const proTable = ref();
const params = ref({});
const isFalse = ref(false);

const tableConfig: mTableStructureType[] = [
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

// const a = 7;

// if ((a & 1) > 0) {
//   console.log("++++++++++> 1:", 1);
// }
// if ((a & 2) > 0) {
//   console.log("++++++++++> 2:", 2);
// }
</script>

<style scoped></style>
