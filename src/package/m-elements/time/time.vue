<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 15:43:45
 * @ Modified by: Cai
 * @ Modified time: 2024-08-23 10:17:58
 * @ Description: page name: m-element-time
 -->

<template>
  <template v-if="item.prop">
    <template v-if="!item.display">
      <el-time-picker
        class="m-time-editor"
        v-if="item.type == 'time-picker-group'"
        v-model="data[item.prop]"
        is-range
        :placeholder="item.placeholder || '请选择时间'"
        :disabled="item.disabled"
        format="HH:mm:ss"
        value-format="HH:mm:ss"
        :start-placeholder="item?.disabled ? ' ' : '开始时间'"
        :end-placeholder="item?.disabled ? ' ' : '结束时间'"
        :size="item.size"
      />
      <el-time-picker
        class="m-time-editor"
        v-else
        v-model="data[item.prop]"
        :placeholder="item.placeholder || '请选择时间'"
        :disabled="item.disabled"
        format="HH:mm:ss"
        value-format="HH:mm:ss"
        :start-placeholder="item?.disabled ? ' ' : '开始时间'"
        :end-placeholder="item?.disabled ? ' ' : '结束时间'"
        :size="item.size"
      />
    </template>
    <div v-else class="el-form-item__content——value">{{ findData(data[item.prop]) || "--" }}</div>
    <div
      v-if="alwaysContrast || eq(item.prop, data, contrastData)"
      :class="['contrast-value', item.size == 'small' ? 'contrast-value__small' : '']"
    >
      {{ findData(contrastData[item.prop]) }}
    </div>
  </template>
  <div v-else>--</div>
</template>
<script lang="ts" setup>
import { MElementDateType } from "./index";
import format from "../../../package/tools/format";
import lodashPkg from "lodash";

const { isEqual } = lodashPkg;

type Props = {
  item: MElementDateType;
  data?: {};
  contrastData?: {};
  alwaysContrast?: boolean;
};
withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({})
});

function eq(prop, data, contrastData) {
  if (!prop || !contrastData || !contrastData[prop] || !Array.isArray(contrastData[prop])) return false;

  const _contrastData = contrastData[prop].filter(value => value !== null && typeof value !== "undefined");

  if (_contrastData && _contrastData.length == 0) {
    return false;
  }

  return !isEqual(data[prop], _contrastData);
}

function findData(data) {
  const useType = "HH:mm:ss";
  if (Array.isArray(data)) {
    return data.map(item => format("2000-01-01 " + item, useType))?.join(" 至 ") || "--";
  } else return format("2000-01-01 " + data, useType) || "--";
}
</script>
<style lang="scss">
@import "../index.scss";
.m-time-editor {
  width: 100% !important;
  .el-range__icon,
  .el-range__close-icon,
  .el-input__prefix {
    display: none;
  }
}
</style>
