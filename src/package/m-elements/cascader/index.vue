<template>
  <template v-if="item.prop">
    <el-cascader
      v-if="!item.display"
      :props="cascaderProps"
      :show-all-levels="false"
      :data-testId="item.prop"
      v-model="inValue"
      :placeholder="item.placeholder"
      :disabled="item.disabled"
      :options="exOptions[item.prop] || item.options"
      filterable
      collapse-tags-tooltip
      :clearable="
        item.clearable == undefined && item.type != 'multiple-cascader-check' && item.type != 'multiple-cascader'
          ? true
          : item.clearable
      "
      :collapse-tags="item.collapseTags == undefined ? true : item.collapseTags"
      :max-collapse-tags="item.maxCollapseTags == undefined ? 1 : item.maxCollapseTags"
      :size="item.size"
    >
      <template #default="scope">
        <span>{{ scope.data.label }}</span>
        <span v-if="!scope.node.isLeaf"> ({{ scope.data.children.length }}) </span>
      </template>
    </el-cascader>
    <div v-else class="el-form-item__content——value">{{ findData(inValue) || "--" }}</div>
    <div
      v-if="alwaysContrast || eq(data, contrastData)"
      :class="['contrast-value', item.size == 'small' ? 'contrast-value__small' : '']"
    >
      {{ findData(inContrastValue) }}
    </div>
  </template>
  <div v-else>--</div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import lodashPkg from "lodash";
import { MElementCascaderType, MElementCascaderOptionType } from "./index";

const { isEqual, debounce } = lodashPkg;

const emits = defineEmits(["change"]);

type Props = {
  item: MElementCascaderType;
  data: {};
  contrastData?: {};
  alwaysContrast?: boolean;
  exOptions: { [x: string]: MElementCascaderOptionType[] };
};

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({}),
  exOptions: () => ({})
});

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

const cascaderProps = {
  multiple: props.item.type == "multiple-cascader" || props.item.type == "multiple-cascader-check",
  checkStrictly: props.item.type == "cascader-check" || props.item.type == "multiple-cascader-check" ? true : false,
  expandTrigger: "hover" as const
};

const inValue = ref([] as string[]);
const inContrastValue = ref([] as string[]);

const init = (options, data, arr?: string[]) => {
  if (!options) return;
  for (let index = 0; index < options.length; index++) {
    const element = options[index];
    const inArr: string[] = arr ? [...arr] : [];

    inArr.push(element.value);

    if (element.value == data) {
      inValue.value = inArr;
    }
    if (element.children && element.children?.length > 0) {
      init(element.children, data, arr || inArr);
    }
  }
};

const initContrast = (options, data, arr?: string[]) => {
  if (!options) return;
  for (let index = 0; index < options.length; index++) {
    const element = options[index];
    const inArr: string[] = arr ? [...arr] : [];

    inArr.push(element.value);

    if (element.value == data) {
      inContrastValue.value = inArr;
    }
    if (element.children && element.children?.length > 0) {
      initContrast(element.children, data, arr || inArr);
    }
  }
};

function findData(data) {
  if (props.item.displayProp) {
    return props.data[props.item.displayProp] || "--";
  }
  const prop = props.item.prop;
  if (!prop || !data) {
    return;
  }
  let text = "";
  const options: { label: string; value: number | string }[] = [];
  const _options = props.exOptions[prop] || props.item.options;
  for (let index = 0; index < _options.length; index++) {
    const element = _options[index];
    const { label, value } = element;
    options.push({ label, value });

    if (element.children?.length) {
      for (let ch_index = 0; ch_index < element.children.length; ch_index++) {
        const ch_element = element.children[ch_index];
        const { label, value } = ch_element;
        options.push({ label, value });
      }
    }
  }

  for (let I_index = 0; I_index < data.length; I_index++) {
    const row = data[I_index];
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.value == row) {
        text += option.label + `${I_index < data.length - 1 ? "，" : ""}`;
      }
    }
  }
  return text || "--";
}

let lock = false;
const _debounce = debounce(
  () => {
    lock = true;
  },
  500,
  { trailing: true }
);

watch(
  () => props.contrastData[String(props.item.prop)],
  data => {
    if (!props.item.prop) return;
    inContrastValue.value = [];
    if (Array.isArray(data)) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        initContrast(props.exOptions[props.item.prop], element, inContrastValue.value);
      }
    } else {
      initContrast(props.exOptions[props.item.prop], data);
    }

    _debounce();
  },
  { immediate: true, deep: true }
);

watch(
  () => props.data[String(props.item.prop)],
  data => {
    if (!props.item.prop) return;
    if (lock) return;
    inValue.value = [];
    if (Array.isArray(data)) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        init(props.exOptions[props.item.prop], element, inValue.value);
      }
    } else {
      init(props.exOptions[props.item.prop], data);
    }

    _debounce();
  },
  { immediate: true }
);

watch(
  () => inValue.value,
  data => {
    if (!props.item.prop) return;
    if (!lock) return;
    let _data: any;
    if (data) {
      if (props.item.type == "multiple-cascader-check" || props.item.type == "multiple-cascader") {
        if (!_data) _data = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          _data.push(element[element.length - 1]);
        }
      } else {
        _data = data[data.length - 1];
      }
    }
    props.data[props.item.prop] = _data;
    emits("change", { value: data, item: props.item });
  },
  { immediate: true }
);
</script>

<style lang="scss">
@import "../index.scss";
.el-cascader:has(.el-cascader__tags) {
  width: var(--el-input-width);
  line-height: var(--el-input-height);
  box-sizing: border-box;
  vertical-align: middle;
  position: relative;

  .el-input {
    position: absolute;
    .el-input__wrapper {
      box-shadow: none !important;
    }
    .el-input__inner {
      height: initial !important;
    }
  }
  .el-cascader__tags {
    padding: 1px 0 0;
    position: relative;
    top: 0;
    right: 0;
    transform: none;
    padding-right: 45px;
    min-height: calc(var(--el-component-base-size-default) - 1px);
    transition: 0.3s;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    transform: translate3d(0, 0, 0);
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    justify-content: flex-start;
    align-items: center;

    &:focus,
    &:hover {
      box-shadow: 0 0 0 1px var(--el-input-focus-border-color, var(--el-color-primary)) inset;
    }
    .el-tag {
      margin: 1px 0 1px 7px;
    }
    .el-cascader__search-input {
      padding: 0;
      margin: 0;
      height: inherit;
      min-width: 10px;
      width: 10px;
      margin-top: -2px;
      margin-left: 6px;
    }
  }
}

.is-error {
  .el-cascader:has(.el-cascader__tags) {
    .el-cascader__tags {
      box-shadow: 0 0 0 1px var(--el-color-danger) inset;
    }
  }
}
</style>
