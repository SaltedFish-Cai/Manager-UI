<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 10:27:11
 * @ Modified by: Cai
 * @ Modified time: 2024-08-23 10:17:52
 * @ Description: page name: m-element-transfer
 -->

<template>
  <template v-if="item.prop">
    <div class="flex-col" style="width: 100%">
      <div class="m-transfer-class" :class="[item.size == 'small' ? 'm-transfer-class_small' : '']">
        <el-transfer
          v-if="!item.display"
          v-model="data[item.prop]"
          filterable
          :props="{ key: 'value', label: 'label' }"
          :titles="item.titles ? item.titles : ['未选择', '已选择']"
          :filter-placeholder="item.filterPlaceholder ? item.filterPlaceholder : '点击搜索'"
          :data="optionsArr || []"
          :disabled="item.disabled"
          @change="onlineSelectChange"
        >
          <template #default="{ option }">
            <span> {{ option.label }}</span>
          </template>
        </el-transfer>
        <div v-else class="el-form-item__content——value">
          <div v-if="optionsArr?.length">{{ findData(data[item.prop]) || "--" }}</div>
          <div v-else>--</div>
        </div>
      </div>
      <div
        v-if="alwaysContrast || eq(data, contrastData)"
        :class="['contrast-value', item.size == 'small' ? 'contrast-value__small' : '']"
      >
        <div v-if="optionsArr?.length">{{ findData(contrastData[item.prop]) }}</div>
      </div>
    </div>
  </template>
  <div v-else>--</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Obj } from "@/package/global";
import { MElementTransferType, MElementTransferOptionType } from "./index";
import lodashPkg from "lodash";

const { isEqual } = lodashPkg;

type Props = {
  item: MElementTransferType;
  data: Obj;
  contrastData?: {};
  alwaysContrast?: boolean;
  exOptions?: { [x: string]: MElementTransferOptionType[] };
};

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({}),
  exOptions: () => ({})
});

const emit = defineEmits(["change"]);

function eq(data, contrastData) {
  const prop = props.item.prop;
  if (!prop || !contrastData || !contrastData[prop] || !Array.isArray(contrastData[prop])) return false;

  const _contrastData = contrastData[prop].filter(value => value !== null && typeof value !== "undefined");

  if (_contrastData && _contrastData.length == 0) {
    return false;
  }

  return !isEqual(data[prop], _contrastData);
}

function onlineSelectChange(prop, data, item) {
  emit("change", { value: data[item.prop], item });
}

const optionsArr = computed(() => {
  const arr =
    props.exOptions[String(props.item.prop)] ||
    props.item.options ||
    props.data.cellConfig?.options[String(props.item.prop)] ||
    [];

  return arr.map(item => ({ ...item, disabled: props.item.disabled }));
});

function findData(data) {
  const prop = props.item.prop;
  // const type = props.item.type;
  if (!prop || !data) {
    return;
  }
  let text = "";
  const options = optionsArr.value;
  if (Array.isArray(data)) {
    for (let I_index = 0; I_index < data.length; I_index++) {
      const row = data[I_index];
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        if (option.value == row) {
          text += option.label + `${I_index < data.length - 1 ? "，" : ""}`;
        }
      }
    }
  } else {
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.value == data) {
        text += option.label;
      }
    }
  }
  return text || "--";
}

// watch(
//   () => props.data[String(props.item.prop)],
//   data => {
//     if (data) {
//       remoteMethod(data, props.item.prop, props.item, props.data);
//     }
//   },
//   { immediate: true }
// );
</script>

<style lang="scss">
@import "../index.scss";
.m-transfer-class {
  width: 100%;
  .el-transfer {
    display: flex;
  }
  .el-transfer-panel {
    width: 100%;
  }
  .el-checkbox-group {
    height: calc(100% - 36px);
  }
  .el-transfer__buttons {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
  }
  .el-transfer-panel__filter {
    height: 50px;
    padding: 10px;
    border-bottom: 1px solid var(--el-transfer-border-color);
    .el-input__inner {
      font-size: 14px;
    }
  }
  .el-checkbox-group {
    height: calc(100% - 51px);
  }
}
.m-transfer-class_small {
  .el-transfer-panel {
    width: 100%;
  }
  .el-transfer-panel__header {
    height: 34px;
    padding-left: 10px;
    .el-checkbox__label {
      font-size: 13px !important;
    }
  }
  .el-checkbox-group {
    height: calc(100% - 36px);
  }
  .el-transfer__button {
    height: 28px;
    padding: 0 10px;
  }
  .el-transfer-panel__filter {
    height: 34px;
    padding: 5px 10px;
    border-bottom: 1px solid var(--el-transfer-border-color);
    .el-input__inner {
      font-size: 12px;
    }
  }
  .el-transfer-panel__item {
    height: 24px;
    padding-left: 10px;
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .el-transfer-panel__empty {
    font-size: 13px !important;
  }
}
</style>
