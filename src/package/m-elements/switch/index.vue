<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 11:44:55
 * @ Modified by: Cai
 * @ Modified time: 2024-08-23 10:18:16
 * @ Description: page name: m-element-switch
 -->

<template>
  <template v-if="item.prop">
    <el-switch
      v-if="!item.display"
      v-model="data[item.prop]"
      :disabled="item.disabled"
      :active-value="options.activeValue"
      :inactive-value="options.inActiveValue"
      :active-text="options.activeText"
      :inactive-text="options.inActiveText"
      :size="item.size"
    />
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
import { computed } from "vue";
import { MElementSwitchType } from "./index";
import lodashPkg from "lodash";

const { isEqual } = lodashPkg;

type Props = {
  item: MElementSwitchType;
  data: {};
  contrastData?: {};
  alwaysContrast?: boolean;
  exOptions: {};
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({}),
  exOptions: () => ({})
});

const options = computed(() => {
  const item = props.item;
  let _opt = {
    activeValue: item.activeValue,
    inActiveValue: item.inActiveValue,
    activeText: String(item.activeText),
    inActiveText: String(item.inActiveText)
  };
  if (item.prop && props.exOptions[item.prop]) {
    const _item = props.exOptions[item.prop];
    _opt = {
      activeValue: _item.activeValue,
      inActiveValue: _item.inActiveValue,
      activeText: String(_item.activeText),
      inActiveText: String(_item.inActiveText)
    };
  }
  return _opt;
});

function findData(data) {
  const prop = props.item.prop;
  if (!prop || data == undefined || data == null) {
    return;
  }
  let text = "";
  const opt = options.value;
  const _options = [
    { label: opt.activeText, value: opt.activeValue },
    { label: opt.inActiveText, value: opt.inActiveValue }
  ];
  for (let index = 0; index < _options.length; index++) {
    const option = _options[index];
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
