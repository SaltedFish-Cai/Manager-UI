<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 10:00:34
 * @ Modified by: Cai
 * @ Modified time: 2024-08-23 14:57:10
 * @ Description: page name: m-element-number
 -->

<template>
  <template v-if="item.prop">
    <m-number v-model="data[item.prop]" v-bind="item"></m-number>
    <div
      v-if="
        alwaysContrast ||
        (contrastData &&
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
import MNumber from "../../m-number/m-number.vue";
import lodashPkg from "lodash";

const { isEqual } = lodashPkg;

type Props = {
  item: MElementNumberType;
  data?: {};
  contrastData?: {};
  alwaysContrast?: boolean;
};
withDefaults(defineProps<Props>(), {
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
</script>

<style lang="scss">
@import "../index.scss";
</style>
