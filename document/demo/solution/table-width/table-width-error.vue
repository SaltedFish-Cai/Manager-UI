<template>
  <el-tabs v-model="state.activeName">
    <el-tab-pane label="User" name="first">
      <transition v-show="'first' == state.activeName" appear name="fade-transform" mode="out-in">
        <m-table
          vif=""
          id="base-table-demo-error1"
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
      </transition>
    </el-tab-pane>
    <el-tab-pane label="Config" name="second">
      <transition v-show="'second' == state.activeName" appear name="fade-transform" mode="out-in">
        <m-table
          id="base-table-demo-error2"
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
      </transition>
    </el-tab-pane>
  </el-tabs>
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

<style scoped lang="scss">
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.4s;
}
.fade-transform-enter-from {
  opacity: 0;
  transition: all 0.4s;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transition: all 0.4s;
  transform: translateX(30px);
}
.flx_tabs_line {
  .el-tabs__header {
    padding-bottom: 10px;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}
.flx_tabs {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 1px;
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 1px;
    overflow: inherit;
  }
  .el-tab-pane {
    flex: 1;
    height: 1px;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
