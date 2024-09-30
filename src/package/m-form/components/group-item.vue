<template>
  <template v-if="item.type == 'group'">
    <el-form-item :prop="item.prop" :class="[display ? 'm-form-display' : '']">
      <!-- label -->
      <template #label v-if="item.label">
        <form-label :label="item.label" :tip="item.tip" :labelWidth="labelWidth" :labelPosition="labelPosition" />
      </template>

      <div class="flex-col">
        <!-- group -->
        <el-radio-group v-model="data[item.prop]" :size="size" v-if="!display" :disabled="item.disabled">
          <el-radio-button
            :label="radio.value"
            v-for="radio in exOptions[item.prop] || item.groupFormConfig"
            :key="String(radio.value)"
          >
            {{ radio.label }}
          </el-radio-button>
        </el-radio-group>
        <template v-else>
          <div class="group-display">
            {{ findData(data[item.prop]) || "--" }}
            <template v-if="findData(data[item.prop])">
              <!-- <el-form-item :prop="item.prop" style="flex-direction: column"> -->
              <template v-for="groupItem in exOptions[item.prop] || item.groupFormConfig" :key="groupItem.label">
                <template v-if="data && data[item.prop] == groupItem.value && groupItem.type != 'null'">
                  (
                  <el-row :gutter="10" v-if="display">
                    <form-item
                      :ruleFormRef="ruleFormRef"
                      :item="{ ...groupItem, spanStyle: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 } }"
                      :data="data"
                      :labelWidth="labelWidth"
                      :labelPosition="labelPosition"
                      :display="display"
                      :size="size"
                      noLabel
                    >
                      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                        <slot :name="slot" v-bind="scope"></slot>
                      </template>
                    </form-item>
                  </el-row>
                  )
                </template>
              </template>
              <!-- </el-form-item> -->
            </template>
          </div>
        </template>

        <el-row :gutter="10" v-if="!display" class="group-item">
          <!-- <el-form-item :prop="item.prop" style="flex-direction: column"> -->
          <template v-for="groupItem in exOptions[item.prop] || item.groupFormConfig" :key="groupItem.label">
            <template v-if="data && data[item.prop] == groupItem.value && groupItem.type != 'null'">
              <form-item
                class="mt5"
                :ruleFormRef="ruleFormRef"
                :item="{
                  ...groupItem,
                  label: groupItem?.childLabel || groupItem?.label,
                  spanStyle: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }
                }"
                :data="data"
                :labelWidth="labelWidth"
                :labelPosition="labelPosition"
                :display="display"
                :size="size"
                noLabel
              >
                <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                  <slot :name="slot" v-bind="scope"></slot>
                </template>
              </form-item>
            </template>
          </template>
          <!-- </el-form-item> -->
        </el-row>
      </div>
    </el-form-item>
  </template>
</template>
<script lang="tsx" setup>
// _Import
import { inject, computed } from "vue";
import formLabel from "./label.vue";
import formItem from "./basics-item.vue";
import { groupItemPropsType } from "../type";

// _Var
const props = withDefaults(defineProps<groupItemPropsType>(), {
  data: () => ({})
});

const display = computed(() => props.display || props.item.display || false);
const exOptions: any = inject("propOptions");

// _Function 查找数据
function findData(data) {
  if (!props.item.prop) return "--";
  const prop = Array.isArray(props.item.prop) ? props.item.prop.join("-") : props.item.prop;
  const groupFormConfig = exOptions.value[prop] || props.item.groupFormConfig;
  if (!prop || data == undefined || !groupFormConfig) {
    return;
  }
  let text = "";
  for (let index = 0; index < groupFormConfig.length; index++) {
    const option = groupFormConfig[index];
    if (option.value == data) {
      text += option.label;
    }
  }
  return text || "--";
}
</script>
<style lang="scss" scoped>
.flex-col {
  width: 100%;
}
</style>
