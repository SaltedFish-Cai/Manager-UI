<template>
  <div class="vp_title_label">效果展示</div>
  <m-table
    id="tag-table-demo"
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
</template>

<script lang="ts" setup>
import { mTagOptionType, mTableStructureType } from "@/package/global";
import { ref, nextTick } from "vue";
const proTable = ref();
const params = ref({});

const tableConfig: mTableStructureType[] = [
  { label: "Cell-Text", prop: "Text" },
  { label: "Cell-Input", prop: "Select", cellConfig: { type: "tag" } },
  { label: "操作", prop: "operation" }
];

const exOptions = ref({});

const exDependent = {
  targetTag: {
    Select: targetTags
  }
};
function targetTags(data) {
  console.log("++++++++++> data:", data);
}

nextTick(async () => {
  const Select: mTagOptionType[] = [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ];
  const bgColor = ["#33b698", "#409eff"];
  for (let index = 0; index < Select.length; index++) {
    Select[index].tagStyle = { bgColor: bgColor[index], textColor: "#fff" };
  }
  exOptions.value = { Select };
});

async function getTableList(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: ["1", "2"] },
        { Text: "Text-d2i23411", Select: "2" }
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
