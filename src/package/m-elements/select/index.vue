<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 10:27:11
 * @ Modified by: Cai
 * @ Modified time: 2024-09-02 15:46:58
 * @ Description: page name: m-element-select
 -->

<template>
  <template v-if="item.prop">
    <el-select
      v-if="!item.display"
      v-model="data[item.prop]"
      :multiple="
        item.type == 'multiple-select' || item.type == 'multiple-request-select' || item.type == 'multiple-online-select'
          ? true
          : false
      "
      :placeholder="item.placeholder"
      :disabled="item.disabled"
      collapse-tags-tooltip
      filterable
      :clearable="item.clearable == undefined ? true : item.clearable"
      :multiple-limit="item.multipleLimit == undefined ? 0 : item.multipleLimit"
      :collapse-tags="item.collapseTags == undefined ? true : item.collapseTags"
      :max-collapse-tags="item.maxCollapseTags == undefined ? 1 : item.maxCollapseTags"
      :remote="
        item.type == 'request-select' ||
        item.type == 'multiple-request-select' ||
        item.type == 'online-select' ||
        item.type == 'multiple-online-select'
      "
      @change="onlineSelectChange(item.prop, data, item)"
      :remote-method="(query:any) => remoteMethod(query, item.prop, item, data)"
      :size="item.size"
    >
      <el-option
        v-for="option in exOptionsList"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      >
        <slot :name="'option-' + item.prop" v-bind="option"></slot>
      </el-option>
    </el-select>
    <div v-else class="el-form-item__content——value">
      <div v-if="optionsArr?.length">{{ findData(data[item.prop]) || "--" }}</div>
      <div v-else>--</div>
    </div>
    <div
      v-if="alwaysContrast || eq(data, contrastData)"
      :class="['contrast-value', item.size == 'small' ? 'contrast-value__small' : '']"
    >
      <div v-if="optionsArr?.length">{{ findData(contrastData[item.prop]) }}</div>
    </div>
  </template>
  <div v-else>--</div>
</template>
<script lang="ts" setup>
import { watch, computed } from "vue";
import { Obj } from "@/package/global";
import { MElementSelectType, MElementRequestSelectType, MElementOnlineSelectType, MElementSelectOptionType } from "./index";
import lodashPkg from "lodash";

const { isEqual } = lodashPkg;

type Props = {
  item: MElementOnlineSelectType | MElementRequestSelectType | MElementSelectType;
  data: Obj;
  contrastData?: {};
  alwaysContrast?: boolean;
  exOptions?: { [x: string]: MElementSelectOptionType[] };
};

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({}),
  exOptions: () => ({})
});

const emit = defineEmits(["remoteMethod", "onlineSelectChange", "change"]);

const exOptionsList = computed(() => {
  const { exOptions, item, data } = props;
  if (!item.prop) return [];
  const exOpt = exOptions[item.prop] || item.options || data.cellConfig?.options[item.prop] || [];
  return exOpt;
});

function remoteMethod(query, prop, item, data) {
  const isValueIndex = exOptionsList.value.findIndex(item => query == item.value);
  if (isValueIndex < 0 && (item.type == "online-select" || item.type == "multiple-online-select" || !optionsArr?.value?.length)) {
    emit("remoteMethod", { query, prop, item, data });
  }
}

function eq(data, contrastData) {
  const prop = props.item.prop;
  // if (!prop || !contrastData || !contrastData[prop] || !Array.isArray(contrastData[prop])) return false;

  // const _contrastData = contrastData[prop].filter(value => value !== null && typeof value !== "undefined");

  // if (_contrastData && _contrastData.length == 0) {
  //   return false;
  // }
  if (!prop || !contrastData || !contrastData[prop]) return false;
  return !isEqual(data[prop], contrastData[prop]);
}

function onlineSelectChange(prop, data, item) {
  emit("onlineSelectChange", { prop, data, type: "requestBy" });
  emit("change", { value: data[item.prop], item });
}
const optionsArr = computed(() => {
  const data =
    props.exOptions[String(props.item.prop)] || props.item.options || props.data.cellConfig?.options[String(props.item.prop)];
  return data;
});

function findData(data) {
  if (props.item.displayProp) {
    return props.data[props.item.displayProp] || "--";
  }
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

watch(
  () => props.data[String(props.item.prop)],
  data => {
    if (data) {
      remoteMethod(data, props.item.prop, props.item, props.data);
    }
  },
  { immediate: true }
);
</script>
<style lang="scss">
@import "../index.scss";
.el-select__selected-item {
  user-select: auto;
}
.el-select__wrapper.is-disabled {
  .el-select__placeholder {
    color: var(--el-text-color-placeholder);
  }
}

// .el-select--small .el-select__wrapper {
//   padding: 5px 8px;
// }
.el-cascader.el-tooltip__trigger {
  .el-cascader__tags {
    align-items: center;
    .el-tag {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  .el-input__inner {
    // height: initial !important;
  }
}

.el-select__selection {
  // min-height: calc(var(--el-component-base-size-default));
}

.el-select__selection.is-near {
  margin-left: 0 !important;
}

.el-select {
  .el-select__wrapper {
    padding: 1px 7px;
    min-height: calc(var(--el-component-base-size-default));
  }
}
</style>
