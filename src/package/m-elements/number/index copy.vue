<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 10:00:34
 * @ Modified by: Cai
 * @ Modified time: 2024-07-30 14:20:57
 * @ Description: page name: m-element-number
 -->

<template>
  <template v-if="item.prop">
    <el-input-number
      v-if="!item.display"
      class="m-number-input"
      v-model="data[item.prop]"
      :placeholder="item.placeholder"
      :disabled="item.disabled"
      controls-position="right"
      :controls="item.controls == undefined ? false : item.controls"
      :value-on-clear="item.clearOnValue == undefined ? null : item?.min || 0"
      :precision="item?.precision || 0"
      :max="item?.max || 2147483647"
      :min="item?.min || -2147483647"
      :step="item?.step == undefined ? 1 : item?.min"
      :stepStrictly="item.stepStrictly == undefined ? false : item.stepStrictly"
      :size="item.size"
      @keydown="inputChange"
    />
    <div v-else>{{ keepDecimalPlaces(data[item.prop], item?.precision) }}</div>
    <div
      v-if="
        alwaysContrast ||
        (contrastData &&
          contrastData[item.prop] &&
          contrastData[item.prop] != undefined &&
          contrastData[item.prop] != null &&
          !isEqual(data[item.prop], contrastData[item.prop]))
      "
      :class="['contrast-value', item.size == 'small' ? 'contrast-value__small' : '']"
    >
      {{ keepDecimalPlaces(contrastData[item.prop], item?.precision) }}
    </div>
  </template>
  <div v-else>--</div>
</template>
<script lang="ts" setup>
import { MElementNumberType } from "./index";
import lodashPkg from "lodash";

const { isEqual } = lodashPkg;

type Props = {
  item: MElementNumberType;
  data?: {};
  contrastData?: {};
  alwaysContrast?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({})
});

const keepDecimal = (_numStr, precision) => {
  const numStr = _numStr < 0 ? String(0 - _numStr) : String(_numStr);
  const regexp = new RegExp(`^\\d+(?:\\.\\d{0,${precision}})?`);
  const result = numStr.match(regexp);
  return result ? (_numStr < 0 ? String(0 - Number(result[0])) : result[0]) : "0";
};

function numberWithCommas(numStr, precision) {
  const _numStr = numStr.toString();
  const _numStrArr = _numStr.split(".");
  let x = _numStrArr[0];
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return precision > 0 ? [x, _numStrArr[1]].join(".") : x;
}

const keepDecimalPlaces = (numStr = 0, precision) => {
  let numberStr = keepDecimal(numStr, precision);
  let rs = numberStr.indexOf(".");

  if (precision == undefined) return (numberStr = numberStr.split(".")[0]);

  if (precision == 0) {
    return numberWithCommas((numberStr = numberStr.split(".")[0]), precision);
  }
  if (rs < 0 && precision > 0) {
    rs = numberStr.length;
    numberStr += ".";
  }
  while (numberStr.length <= rs + precision) {
    numberStr += "0";
  }
  return numberWithCommas(numberStr, precision);
};

const inputChange = e => {
  const item = props.item;
  const precision = item?.precision || 0;
  const data = props.data[String(item.prop)];
  const key = e.key;
  if (key === "e" || key === "E" || key === "+" || (data < 0 && key === "-") || (precision <= 0 && key === ".")) {
    e.returnValue = false;
    return false;
  }
  return true;
};
</script>

<style lang="scss">
@import "../index.scss";
.m-number-input {
  width: 100%;
  .el-input {
    .el-input__wrapper {
      padding: 1px 11px !important;
      .el-input__inner {
        text-align: left;
      }
    }
  }
  .el-input--small {
    .el-input__wrapper {
      padding: 1px 7px !important;
    }
  }
}
</style>
