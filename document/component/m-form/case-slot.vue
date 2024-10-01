<template>
  <m-form id="case-slot-from-demo" ref="proForm" :structure="formConfig">
    <template #SlotKey>
      <el-select v-model="formData" filterable remote placeholder="这是一个外置的" :remote-method="searchOther">
        <el-option
          v-for="item in otherOptions"
          :key="item.value"
          :label="item.label"
          :value="String(item.value)"
          data-testId="subDealersIdentifier-opt"
        />
      </el-select>
    </template>
  </m-form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { mFormStructureType, Obj } from "@/package/global";

const proForm = ref();
const formData = ref({});
const otherOptions = ref([] as Obj[]);

const formConfig: mFormStructureType[] = [
  {
    label: "Select1",
    prop: "Select1",
    type: "select",
    options: [
      { label: "选项1", value: 1 },
      { label: "选项2", value: 2 }
    ]
  },
  {
    label: "Slot1",
    prop: "SlotKey",
    type: "slot"
  }
];

function searchOther() {
  otherOptions.value = [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ];
}
</script>

<style scoped></style>
