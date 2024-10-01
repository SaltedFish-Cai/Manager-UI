<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 09:15:22
 * @ Modified by: Cai
 * @ Modified time: 2024-08-30 14:36:18
 * @ Description: page name: m-element-input
 -->

<template>
  <template v-if="item.prop">
    <el-input
      v-if="!item.display"
      v-model="data[item.prop]"
      :class="[item.maxLength ? 'text-area-wrap' : '']"
      :type="item.type == 'textarea' ? 'textarea' : 'text'"
      :placeholder="item.placeholder"
      :disabled="item.disabled"
      :maxlength="item?.maxLength"
      :minlength="item?.minLength"
      :clearable="item.clearable == undefined ? true : item.clearable"
      :show-password="item?.showPassword"
      :show-word-limit="item.showWordLimit == undefined ? true : item.showWordLimit"
      :autosize="autoSize"
      :autofocus="item?.autofocus"
      :formatter="formatter"
      :parser="parser"
      :size="item.size"
      @input="limitLength"
    />
    <div v-else class="el-form-item__content——value">{{ data[item.prop] || "--" }}</div>
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
      {{ contrastData[item.prop] }}
    </div>
  </template>
  <div v-else>--</div>
</template>
<script lang="ts" setup>
import { ref, Ref, computed, watch } from "vue";

import { MElementInputType } from "./index";
import lodashPkg from "lodash";
import { Obj } from "@/package/global";

const { isEqual, debounce } = lodashPkg;

type Props = {
  item: MElementInputType;
  data: {};
  contrastData?: {};
  alwaysContrast?: boolean;
};

const autoSize: Ref<Obj | boolean> = ref(false);
const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({})
});

const formatter = computed(() => {
  const { inputParser } = props.item;
  if (inputParser) return inputParser;
  return undefined;
});

const parser = computed(() => {
  const { inputFormatter } = props.item;
  if (inputFormatter) return inputFormatter;
  return undefined;
});

const limitLength = value => {
  if (props.item?.maxLength && value.length > props.item.maxLength) {
    const { prop } = props.item;
    props.data[prop!] = value.slice(0, props.item.maxLength);
  }
};

const _debounce = debounce(
  data => {
    autoSize.value = !data ? { minRows: props.item?.minRows || 3, maxRows: props.item?.maxRows || 5 } : false;
  },
  300,
  { trailing: true }
);
watch(
  () => props.item.display,
  data => {
    _debounce(data);
  },
  { deep: true }
);
</script>
<style lang="scss" scoped>
@import "../index.scss";
</style>
<style lang="scss">
.text-area-wrap {
  .el-textarea__inner {
    padding: 4px 7px 20px !important;
  }
}

.el-textarea__inner {
  font-size: var(--el-font-base-size-default) !important;
}
// .el-input--small .el-input__wrapper {
//   padding: 4px 8px;
// }
</style>
