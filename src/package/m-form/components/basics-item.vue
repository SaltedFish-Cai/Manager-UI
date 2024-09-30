<template>
  <!-- transfer -->
  <el-col v-if="item.type == 'transfer'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    <el-form-item :prop="item.prop" :class="[display ? 'm-form-display' : '']">
      <template #label v-if="item.label && !noLabel">
        <form-label :label="item.label" :tip="item.tip" :labelWidth="labelWidth" :labelPosition="labelPosition" />
      </template>
      <!-- <div class="flex-center" style="width: 100%"> -->
      <transfer-item
        :item="{
          ...item,
          placeholder,
          disabled: item.disabled || disabledFn(data),
          size: props.size
        }"
        :data="data"
        :exOptions="exOptions"
        :contrastData="contrastData"
        :alwaysContrast="alwaysContrast"
      ></transfer-item>
      <!-- </div> -->
    </el-form-item>
  </el-col>

  <el-col
    v-else-if="item.prop"
    :xs="inItem.spanStyle.xs"
    :sm="inItem.spanStyle.sm"
    :md="inItem.spanStyle.md"
    :lg="inItem.spanStyle.lg"
    :xl="inItem.spanStyle.xl"
  >
    <el-form-item :prop="Array.isArray(item.prop) ? item.prop.join('-') : item.prop" :class="[display ? 'm-form-display' : '']">
      <!-- label -->

      <template #label v-if="item.label && !noLabel">
        <form-label :label="item.label" :tip="item.tip" :labelWidth="labelWidth" :labelPosition="labelPosition" />
      </template>

      <section class="flex-start-start flex-cell">
        <input-item
          v-if="item.type == 'input' || item.type == 'textarea'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
        />

        <number-item
          v-else-if="item.type == 'number'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
        />

        <select-item
          v-else-if="item.type == 'select' || item.type == 'multiple-select'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          :exOptions="exOptions"
          @change="changeEvent"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope"> <slot :name="slot" v-bind="scope"></slot> </template>
        </select-item>

        <select-item
          v-else-if="item.type == 'request-select' || item.type == 'multiple-request-select'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          :exOptions="onLineOptions"
          @remote-method="data => remoteMethod(data.query, data.prop, data.item, data.data)"
          @change="changeEvent"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope"> <slot :name="slot" v-bind="scope"></slot> </template>
        </select-item>

        <select-item
          v-else-if="item.type == 'online-select' || item.type == 'multiple-online-select'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          :exOptions="onLineOptions"
          @remote-method="data => remoteMethod(data.query, data.prop, data.item, data.data)"
          @change="changeEvent"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope"> <slot :name="slot" v-bind="scope"></slot> </template>
        </select-item>

        <cascader-item
          v-else-if="
            item.type == 'cascader' ||
            item.type == 'cascader-check' ||
            item.type == 'multiple-cascader-check' ||
            item.type == 'multiple-cascader'
          "
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          :exOptions="exOptions"
          @change="changeEvent"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope"> <slot :name="slot" v-bind="scope"></slot> </template>
        </cascader-item>

        <select-icon
          v-else-if="item.type == 'select-icon'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          @change="changeEvent"
        />

        <switch-item
          v-else-if="item.type == 'switch'"
          :item="{
            ...item,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          :exOptions="exOptions"
        />

        <check-box-item
          v-else-if="item.type == 'checkbox'"
          :item="{
            ...item,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          :exOptions="exOptions"
          @change="changeEvent"
        />

        <radio-item
          v-else-if="item.type == 'radio'"
          :item="{
            ...item,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          :exOptions="exOptions"
          @change="changeEvent"
        />

        <address-item
          v-else-if="item.type == 'address'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          @change="changeEvent"
        />

        <time-picker-item
          v-else-if="item.type == 'time-picker' || item.type == 'time-picker-group'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
        />

        <date-picker-item
          v-else-if="item.type == 'date-time-range' || item.type == 'date-picker' || item.type == 'date-picker-group'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
        />

        <month-picker-item
          v-else-if="item.type == 'month-picker' || item.type == 'month-picker-group'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
        />

        <year-picker-item
          v-else-if="item.type == 'year-picker'"
          :item="{
            ...item,
            placeholder,
            disabled: item.disabled || disabledFn(data),
            size: props.size
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
        />

        <file-item
          v-else-if="item.type == 'file'"
          :item="{
            ...item,
            placeholder,
            fileAttached: (exDependent?.fileData && exDependent?.fileData[item.prop]) || item.fileAttached,
            fileMultiple: (exDependent?.fileMultiple && exDependent?.fileMultiple[item.prop]) || item.fileMultiple,
            disabled: item.disabled || disabledFn(data)
          }"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          @change="changeEvent"
          @change-state="changeState"
        />

        <slot-item
          v-else-if="item.type == 'slot' || $slots[String(item.prop)]"
          :item="item"
          :data="data"
          :contrastData="contrastData"
          :alwaysContrast="alwaysContrast"
          :exOptions="exOptions"
          :labelWidth="labelWidth"
          :labelPosition="labelPosition"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope" :key="slot">
            <slot :name="slot" :row="scope.row"></slot>
          </template>
        </slot-item>
      </section>

      <div class="cell-slots" v-if="$slots[`cell-${item.prop}`]">
        <slot :name="'cell-' + item.prop" v-bind="{ data, item }"></slot>
      </div>
    </el-form-item>
  </el-col>
  <el-col
    v-else-if="item.type == 'null'"
    :xs="inItem.spanStyle.xs"
    :sm="inItem.spanStyle.sm"
    :md="inItem.spanStyle.md"
    :lg="inItem.spanStyle.lg"
    :xl="inItem.spanStyle.xl"
  >
    <div class="h26" />
  </el-col>
  <!-- docEditor -->
  <!-- <editor-item v-else-if="item.type == 'editor'" :item="item" :data="data"></editor-item> -->

  <!-- slot -->
  <!-- <template v-else-if="item.type == 'slot'">
    <slot :name="item.slotName" :row="item" />
  </template> -->

  <!-- <input-item v-else :item="item" :data="data" :labelWidth="labelWidth" :exFormatter="exFormatter" :exParser="exParser" /> -->
</template>

<script lang="ts" setup>
// _Import
import { ref, computed, nextTick, inject } from "vue";
import formLabel from "./label.vue";

import inputItem from "../../m-elements/input/index.vue";
import numberItem from "../../m-elements/number/index.vue";
import selectItem from "../../m-elements/select/index.vue";
import cascaderItem from "../../m-elements/cascader/index.vue";
import selectIcon from "../../m-elements/icon/index.vue";
import switchItem from "../../m-elements/switch/index.vue";
import checkBoxItem from "../../m-elements/checkbox/index.vue";
import radioItem from "../../m-elements/radio/index.vue";
import timePickerItem from "../../m-elements/time/time.vue";
import datePickerItem from "../../m-elements/time/date.vue";
import monthPickerItem from "../../m-elements/time/month.vue";
import yearPickerItem from "../../m-elements/time/year.vue";
import fileItem from "../../m-elements/file/index.vue";
import addressItem from "../../m-elements/address/index.vue";
import transferItem from "../../m-elements/transfer/index.vue";

import slotItem from "./items/slot.vue";

import { basicsItemPropsType } from "../type";

// _Var
const props = defineProps<basicsItemPropsType>();
const onLineOptions = ref({});

let placeholder = props.item?.placeholder;
if (!placeholder) {
  const item = props.item;
  if (item.type == "input" || item.type == "textarea" || item.type == "number") {
    placeholder = "请输入" + item.label;
  } else if (
    item.type == "select" ||
    item.type == "multiple-select" ||
    item.type == "cascader" ||
    item.type == "cascader-check" ||
    item.type == "multiple-cascader-check" ||
    item.type == "multiple-cascader" ||
    item.type == "online-select" ||
    item.type == "multiple-online-select" ||
    item.type == "request-select" ||
    item.type == "multiple-request-select" ||
    item.type == "time-picker" ||
    item.type == "time-picker-group" ||
    item.type == "month-picker" ||
    item.type == "month-picker-group" ||
    item.type == "year-picker" ||
    item.type == "date-time-range" ||
    item.type == "date-picker" ||
    item.type == "date-picker-group" ||
    item.type == "address"
  ) {
    placeholder = "请选择" + item.label;
  }
}
const inItem = ref({ ...props.item, placeholder });

const changeFormState: any = inject("changeFormState");
const exDependent: any = inject("propDependent");
const exOptions: any = inject("propOptions");

// _Computed 监听Display状态
const display = computed(() => {
  return props.display || props.item.display || false;
});

// _Function 执行外部disabled方法
function disabledFn(data) {
  if (!props.item.prop || !exDependent?.value?.disabledRule) return false;

  const prop = Array.isArray(props.item.prop) ? props.item.prop.join("-") : props.item.prop;
  const disabledRule = exDependent?.value?.disabledRule;

  return disabledRule[prop] && disabledRule[prop](data);
}

// _Function 检验单个字段
function changeEvent({ item }) {
  nextTick(() => {
    props.ruleFormRef.validateField(item.prop);
  });
}

// _Function 变更formState状态
function changeState(data: "Pending" | "Working") {
  changeFormState(data);
}

// _Function 执行传入方法
async function remoteMethod(query, prop, item, data) {
  // if (item.display || item.disabled) return;
  if (exDependent?.value.remoteMethod && exDependent?.value?.remoteMethod[item.prop]) {
    const _fn = exDependent?.value?.remoteMethod[item.prop];
    if (_fn) {
      const options = await _fn(query || data[prop], prop, item, data);
      onLineOptions.value[prop] = options.length ? options : [];
    }
    return;
  }
  return window.log.error("使用 online-select 时，必须添加 exDependent.remoteMethod 属性");
}
</script>

<style lang="scss" scoped>
.flex-cell {
  width: 100%;
  word-break: break-all;
}
.cell-slots {
  font-size: 14px;
  line-height: 1.5em;
  word-break: break-all;
  padding-top: 5px;
}

.h26 {
  height: 26px;
}
</style>

<style lang="scss">
// .span_item_all-center {
//   width: 100%;
//   .el-form-item {
//     margin-bottom: 18px !important;
//     &__content {
//       display: flex;
//       justify-content: center;
//     }
//   }
// }
</style>
