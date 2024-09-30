<template>
  <template v-if="item.prop">
    <el-radio-group
      v-if="!item.display && item.prop"
      v-model="data[item.prop]"
      :disabled="item.disabled"
      @change="changeEvent(data, item)"
      :size="item.size"
    >
      <el-radio
        v-for="option in exOptions[item.prop] || item.options"
        :key="option.value"
        :label="option.value"
        :name="String(option.value)"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </el-radio>
    </el-radio-group>
    <div v-else class="el-form-item__content——value">{{ findData(data[item.prop]) || "--" }}</div>
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
      {{ findData(contrastData[item.prop]) }}
    </div>
  </template>
  <div v-else>--</div>
</template>

<script lang="ts" setup>
import { MElementRadioType, MElementRadioOptionType } from "./index";
import lodashPkg from "lodash";

const { isEqual } = lodashPkg;

type Props = {
  item: MElementRadioType;
  data: {};
  contrastData?: {};
  alwaysContrast?: boolean;
  exOptions: { [x: string]: MElementRadioOptionType[] };
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({}),
  exFormatter: () => ({}),
  exParser: () => ({})
});

const emit = defineEmits(["change"]);

function changeEvent(value, item) {
  if (item.prop) {
    emit("change", { value: value[item?.prop], item });
  }
}

function findData(data) {
  const prop = props.item.prop;
  if (!prop || !data) {
    return;
  }
  let text = "";
  const options = props.exOptions[prop] || props.item.options;
  for (let index = 0; index < options.length; index++) {
    const option = options[index];
    if (option.value == data) {
      text += option.label;
    }
  }
  return text || "--";
}
</script>
<style lang="scss" scoped>
@import "../index.scss";
</style>

<style>
.el-radio {
  user-select: auto;
}
.el-radio-button,
.el-radio-button--small,
.el-radio-button--large {
  .el-radio-button__inner {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    line-height: 1.6em;
    height: 100%;
    display: block;
  }
}
</style>
