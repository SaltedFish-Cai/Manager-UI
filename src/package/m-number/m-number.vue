<template>
  <el-input-number
    v-if="!display"
    class="m-number"
    v-model="inValue"
    :placeholder="placeholder"
    :disabled="disabled"
    controls-position="right"
    :controls="controls == undefined ? false : controls"
    :value-on-clear="valueOnClear != undefined ? valueOnClear : min || 0"
    :precision="precision || 0"
    :max="max || 2147483647"
    :min="min || -2147483647"
    :step="step == undefined ? 1 : min"
    :stepStrictly="stepStrictly == undefined ? false : stepStrictly"
    :size="baseSize"
    @keydown="inputKeyDown"
    @keyup="inputKeyUp"
    @change="inputChange"
  />
  <div v-else class="el-form-item__content——value">{{ keepDecimalPlaces(inValue, precision) }}</div>
</template>
<script lang="ts" setup>
// _Import
import { ref, Ref, computed, watch } from "vue";
import lodashPkg from "lodash";
import { useBaseStore } from "../store/index";
import { MNumberInputType } from "./type.d";

// _Var
const { isNumber } = lodashPkg;

const props = withDefaults(defineProps<MNumberInputType>(), {});

const emits = defineEmits(["update:modelValue"]);

const globalState = useBaseStore();
const globalStateSize: Ref<"default" | "large" | "small"> = ref("small");
const inValue: Ref<number | undefined> = ref(undefined);

// _Computed
const baseSize = computed(() => {
  if (props.size) {
    return props.size;
  } else {
    return globalStateSize.value;
  }
});

// _Function 加小数点
function keepDecimal(_numStr, precision) {
  const numStr = _numStr < 0 ? String(0 - _numStr) : String(_numStr);
  const regexp = new RegExp(`^\\d+(?:\\.\\d{0,${precision}})?`);
  const result = numStr.match(regexp);
  return result ? (_numStr < 0 ? String(0 - Number(result[0])) : result[0]) : "0";
}

// _Function 加数字分号
function numberWithCommas(numStr, precision) {
  const _numStr = numStr.toString();
  const _numStrArr = _numStr.split(".");
  let x = _numStrArr[0];
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return precision > 0 ? [x, _numStrArr[1]].join(".") : x;
}

// _Function 设置数字格式
function keepDecimalPlaces(numStr = 0, precision) {
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
}

// _Function 键盘弹起
function inputKeyUp() {
  inValue.value = Number(inValue.value) ? inValue.value : props.valueOnClear != undefined ? props.valueOnClear : props.min || 0;
  emits("update:modelValue", inValue.value);
}

// _Function 键盘摁下
function inputKeyDown(e) {
  const precision = props?.precision || 0;
  const data = inValue.value || 0;
  const key = e.key;
  if (key === "e" || key === "E" || key === "+" || (data < 0 && key === "-") || (precision <= 0 && key === ".")) {
    e.returnValue = false;
    return false;
  }
  return true;
}

// _Function 输入框内容变革
function inputChange() {
  emits("update:modelValue", inValue.value);
}

// _Watch globalState
watch(
  () => globalState,
  data => {
    globalStateSize.value = data.getSize || "default";
  },
  { immediate: true, deep: true }
);

// _Watch modelValue
watch(
  () => props.modelValue,
  data => {
    inValue.value = isNumber(data) ? Number(data) : undefined;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
.m-number {
  width: 100%;
  .el-input {
    .el-input__wrapper {
      padding: 1px 11px !important;
      .el-input__inner {
        text-align: left;
      }
    }
  }

  // .el-input--small {
  //   .el-input__wrapper {
  //     padding: 4px 7px !important;
  //   }
  // }
  .is-controls-right {
    height: 50% !important;
  }
}

.m-number.is-controls-right {
  .el-input-number__increase,
  .el-input-number__decrease {
    height: auto;
  }
}
.el-tooltip {
  .m-number {
    width: 99%;
  }
}
</style>
