<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 09:15:22
 * @ Modified by: Cai
 * @ Modified time: 2024-08-27 16:24:49
 * @ Description: page name: m-input
 -->

<template>
  <template v-if="inValue != undefined">
    <el-input
      v-if="!config.display"
      v-bind="config"
      v-model="inValue"
      :type="config.type == 'textarea' ? 'textarea' : 'text'"
      :placeholder="config?.placeholder || '请输入内容'"
      :clearable="config.clearable == undefined ? true : config.clearable"
      :show-word-limit="config.showWordLimit == undefined ? true : config.showWordLimit"
      :autosize="{ minRows: config.minRows || 3, maxRows: config.maxRows || 5 }"
      :size="config.size || baseSize"
      @blur="() => emits('update:modelValue', inValue)"
    />
    <div v-else>{{ inValue || "--" }}</div>
    <div
      v-if="config.contrast || (contrastValue && !isEqual(contrastValue, inValue))"
      :class="['contrast-value', config.size == 'small' ? 'contrast-value__small' : '']"
    >
      {{ contrastValue }}
    </div>
  </template>
  <div v-else class="title-error">M-Input 初始化失败</div>
</template>
<script lang="ts" setup>
import { ref, Ref, onBeforeMount, watch } from "vue";
import inBrowser from "@/package/tools/inBrowser";

import { MInputType } from "./type.d";
import lodashPkg from "lodash";

const { isEqual } = lodashPkg;

const props = withDefaults(
  defineProps<{
    modelValue: number | string; // 绑定数据
    contrastValue?: number | string; // 对比数据
    config?: MInputType;
  }>(),
  { config: () => ({ type: "input" }) }
);
const inValue: Ref<number | string> = ref("");
const baseSize: Ref<"default" | "small"> = ref("default");

onBeforeMount(() => {
  if (!props.config.size) {
    if (inBrowser) {
      baseSize.value = window.innerWidth > 1745 ? "default" : "small";
    } else {
      baseSize.value = "small";
    }
  }
});

// _Emits
const emits = defineEmits(["update:modelValue"]);

// >-------------> Watch <------------<
watch(
  () => props.modelValue,
  data => {
    inValue.value = data;
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
