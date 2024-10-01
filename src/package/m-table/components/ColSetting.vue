<template>
  <!-- 表配置 -->
  <client-only>
    <el-drawer
      title="表配置"
      v-model="drawerVisible"
      size="600px"
      @close="handleCloseDrawer"
      append-to-body
      :class="size == 'small' ? 'm-drawer m-drawer_small' : 'm-drawer'"
    >
      <section :id="'table-col-' + id" class="flex-col table-main" style="height: 100%">
        <div style="height: 1px; flex: 1">
          <el-table
            :data="settingColumnsData"
            :border="true"
            row-key="prop"
            default-expand-all
            :tree-props="{ children: 'childrenColumn' }"
          >
            <!-- 列名 -->
            <el-table-column prop="label" align="center" label="列名" width="110">
              <template #header><m-icon class="mr5" name="flag_line"></m-icon>列名</template>
              <template #default="{ row }">
                <div v-if="!row.fixed && row.isShow" class="flex-center drag-el">
                  <m-icon name="selector_vertical" style="font-size: 22px; width: 14px; transform: translateX(-3px)" />
                  <div class="flex1">{{ row.label }}</div>
                </div>
                <div v-else>
                  <div class="flex1">{{ row.label }}</div>
                </div>
              </template>
            </el-table-column>

            <!-- 条件 -->
            <el-table-column prop="searchCriteria" align="center" label="条件">
              <template #header><m-icon class="mr5" name="type_line"></m-icon>条件</template>
              <template #default="scope">
                <!-- 筛选 -->
                <el-select
                  v-if="isSelectType(scope.row, display)"
                  v-model="scope.row.searchCriteria"
                  placeholder="筛选条件"
                  multiple
                  clearable
                  :size="size"
                >
                  <!-- <template #prefix><m-icon class="mr5" name="filter_line"></m-icon></template> -->
                  <el-option
                    v-for="item in _exOptions[scope.row.prop]"
                    :key="item.label + item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>

                <!-- 时间 -->
                <div v-else-if="isTimeType(scope.row, display)" class="flex-center my-date-picker">
                  <el-date-picker
                    v-model="scope.row.searchCriteria[0]"
                    type="date"
                    placeholder="开始时间"
                    :prefix-icon="timeIcon"
                    value-format="YYYY-MM-DD"
                    :size="size"
                    :shortcuts="shortcuts"
                    :disabled-date="time => disabledStart(time, scope.row.searchCriteria[1], scope.row)"
                  />
                  <div class="ml5 mr5">/</div>
                  <el-date-picker
                    v-model="scope.row.searchCriteria[1]"
                    type="date"
                    placeholder="结束时间"
                    :prefix-icon="timeIcon"
                    value-format="YYYY-MM-DD"
                    :size="size"
                    :shortcuts="shortcuts"
                    :disabled-date="time => disabledEnd(time, scope.row.searchCriteria[0], scope.row)"
                  />
                </div>

                <!-- 搜索 -->
                <template
                  v-else-if="
                    (scope.row.useFilter != false && isInputType(scope.row, display)) ||
                    (scope.row.useFilter != false && !scope.row.cellConfig)
                  "
                >
                  <m-number
                    v-if="isNumberType(scope.row, display)"
                    v-model="scope.row.searchCriteria"
                    v-bind="{ ...scope.row?.cellConfig, display: false, controls: true }"
                  ></m-number>
                  <template v-else>
                    <el-input v-model="scope.row.searchCriteria" placeholder="搜索条件" :size="size">
                      <!-- <template #prefix><m-icon class="mr5" name="search_line"></m-icon></template> -->
                    </el-input>
                    <!-- !scope.row.useSenior -->
                    <m-button v-if="false" style="width: 100%" is="edit" @click="openSeniorFilter(scope.row)">
                      编辑高级搜索
                    </m-button>
                  </template>
                </template>

                <template v-else> 无条件 </template>
              </template>
            </el-table-column>

            <!-- 排序 -->
            <!-- <el-table-column prop="sortable" align="center" label="排序">
            <template #header><m-icon class="mr5" name="switch_vertical_line"></m-icon>排序</template>
            <template #default="scope">
              <el-switch v-model="scope.row.sortable"></el-switch>
            </template>
          </el-table-column> -->

            <!-- 固定 -->
            <el-table-column prop="fixed" align="center" label="固定" width="100">
              <template #header><m-icon class="mr5" name="pin_line"></m-icon>固定状态</template>
              <template #default="scope">
                <div
                  :class="['change_btn', scope.row.fixed == undefined ? '' : 'icon_highlight']"
                  @click="changeFixed(scope.row)"
                  title="点击更改固定方式"
                >
                  <m-icon name="pin_line" :class="['mr5']" />
                  <span>{{ setFixed(scope.row) }}</span>
                </div>
              </template>
            </el-table-column>

            <!-- 显示 -->
            <el-table-column prop="isShow" align="center" label="显示" width="100">
              <template #header><m-icon class="mr5" name="eye_line"></m-icon>显示状态</template>
              <template #default="scope">
                <div
                  :class="['change_btn', scope.row.isShow ? '' : 'icon_highlight--hide']"
                  @click="setView(scope.row)"
                  title="点击更改显示状态"
                >
                  <m-icon class="mr5" :name="scope.row.isShow ? 'eye_line' : 'eye_close_line'"></m-icon>
                  <span>{{ scope.row.isShow ? "显示" : "隐藏" }}</span>
                </div>
              </template>
            </el-table-column>

            <!-- 空 -->
            <template #empty>
              <div class="table-empty">
                <m-icon class="empty-icon" name="world_line"></m-icon>
                <div>暂无可配置列</div>
              </div>
            </template>
          </el-table>
        </div>
      </section>
      <template #footer>
        <div class="flex-center">
          <m-button plain type="primary" font="save_line" @click="FetchSaveAndFilter"> 保存配置 </m-button>
        </div>
      </template>
    </el-drawer>
  </client-only>
</template>

<script setup lang="ts" name="ColSetting">
// _Import
import { ref, computed, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { format } from "../utils";
import { isSelectType, isTimeType, isInputType, isNumberType } from "../hooks/isType";

import timeIcon from "./Icon.vue";
import MNumber from "../../m-number/m-number.vue";

import { Obj } from "@/package/global";
import { SettingPropsType, ColumnProps } from "../type";

// _Var
const drawerVisible = ref<boolean>(false);
const emit = defineEmits(["saveAndFilter", "closeDrawer", "openSeniorFilter", "handleChangeDragEl", "handleChangeDragSort"]);
const props = withDefaults(defineProps<SettingPropsType>(), {
  exOptions: {}
});
const settingColumnsData = computed(() => props.settingColumns);

const shortcuts = [
  {
    text: "今天",
    value: new Date()
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "一周之前",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];

// _Computed
const _exOptions: Obj = computed(() => {
  const _outData: { [x: string]: { label: string; value: string }[] } = {};
  for (const key in props.exOptions) {
    if (Array.isArray(props.exOptions[key])) {
      _outData[key] = props.exOptions[key].map(item => {
        return {
          ...item,
          value: String(item.value)
        };
      });
    } else {
      const item = props.exOptions[key];
      _outData[key] = [];
      _outData[key].push({
        label: item.activeText || "on",
        value: item.activeValue || "true"
      });
      _outData[key].push({
        label: item.inActiveText || "off",
        value: item.inActiveValue || "false"
      });
    }
  }
  return _outData;
});

// _Function 配置初始化开始时间
function disabledStart(time: Date, endTime: Date, row) {
  const _time = format(time.toString(), "yyyy-MM-dd") + " 00:00:00";
  const _now = format(new Date().toString(), "yyyy-MM-dd") + " 00:00:00";
  const _startTime = format(endTime?.toString(), "yyyy-MM-dd") + " 23:59:59";

  if (row?.cellConfig?.useStartLimit) {
    return new Date(_time).getTime() >= new Date(_startTime).getTime() || new Date(_time).getTime() > new Date(_now).getTime();
  } else {
    return new Date(_time).getTime() >= new Date(_startTime).getTime();
  }
}

// _Function 配置初始化结束时间
function disabledEnd(time: Date, startTime: Date, row) {
  const _time = format(time.toString(), "yyyy-MM-dd") + " 23:59:59";
  const _now = format(new Date().toString(), "yyyy-MM-dd") + " 23:59:59";
  const _startTime = format(startTime?.toString(), "yyyy-MM-dd") + " 00:00:00";

  if (row?.cellConfig?.useEndLimit) {
    return new Date(_time).getTime() <= new Date(_startTime).getTime() || new Date(_time).getTime() > new Date(_now).getTime();
  } else {
    return new Date(_time).getTime() <= new Date(_startTime).getTime();
  }
}

// _Function Dialog关闭
function handleCloseDrawer() {
  emit("handleChangeDragEl", "table");
  emit("closeDrawer", { Col: settingColumnsData.value });
}

// _Function 保存并搜索
function FetchSaveAndFilter() {
  const array = settingColumnsData.value;
  const Filter: { fieldLabel?: string; fieldName: string; conditionalType: 0 | 1 | 3 | 5 | 6; fieldValue: string }[] = [];
  for (let index = 0; index < array.length; index++) {
    const element: ColumnProps & { searchCriteria?: any } = array[index];
    if (element.isShow && isTimeType(element, true) && element.prop && !!element.searchCriteria[0]) {
      Filter.push({
        fieldLabel: element.label + "-开始",
        fieldName: element.prop,
        conditionalType: 3,
        fieldValue: element.searchCriteria[0] + " 00:00:00"
      });
    }
    if (element.isShow && isTimeType(element, true) && element.prop && !!element.searchCriteria[1]) {
      Filter.push({
        fieldLabel: element.label + "-结束",
        fieldName: element.prop,
        conditionalType: 5,
        fieldValue: element.searchCriteria[1] + " 23:59:59"
      });
    }

    if (
      element.isShow &&
      element?.filterType == "time" &&
      element.searchCriteria[0] &&
      element.searchCriteria[1] &&
      element.searchCriteria[0] > element.searchCriteria[1]
    ) {
      return ElMessage.error(element.label + " 设置错误：开始时间-需小于-结束时间");
    }

    if (!isTimeType(element, true)) {
      const fieldValue = isSelectType(element, true)
        ? element.searchCriteria.join(",")
        : isNumberType(element, true)
        ? element.searchCriteria
        : String(element.searchCriteria).trim();

      if (element.isShow && element.prop && !!fieldValue) {
        Filter.push({
          fieldLabel: element.label,
          fieldName: element.prop,
          conditionalType: isSelectType(element, true) ? 6 : isNumberType(element, true) ? 0 : 1,
          fieldValue
        });
      }
    }
  }

  emit("saveAndFilter", { Filter, Col: settingColumnsData.value });
  changeColSetting(false);
}

// _Function 设置固定状态显示值
function setFixed(row: { fixed: "left" | "right" | undefined }) {
  let text = "无固定";
  switch (row.fixed) {
    case "left":
      text = "固定至左侧";
      break;
    case "right":
      text = "固定至右侧";
      break;
  }
  return text;
}

// _Function 设置固定状态
function changeFixed(row: { fixed: "left" | "right" | undefined }) {
  row.fixed = row.fixed == "left" ? "right" : row.fixed == "right" ? undefined : "left";
  reSetSort();
}

// _Function 设置是否显示
function setView(row: { isShow: boolean }) {
  row.isShow = !row.isShow;
  reSetSort();
}

// _Function 更新排序
function reSetSort() {
  const ColumnsData = settingColumnsData.value;
  const showArr = ColumnsData.filter(item => item.isShow);
  const LeftArr = showArr.filter(item => item.fixed == "left");
  const RightArr = showArr.filter(item => item.fixed == "right");
  const defaultArr = showArr.filter(item => item.fixed != "left" && item.fixed != "right");
  const hideArr = ColumnsData.filter(item => !item.isShow);
  emit("handleChangeDragSort", [...LeftArr, ...defaultArr, ...RightArr, ...hideArr]);
}

// _Function 打开高级搜索
function openSeniorFilter(item: Obj) {
  emit("openSeniorFilter", item);
}

// _Expose 打开表配置
function changeColSetting(value: boolean) {
  emit("handleChangeDragEl", "col");
  drawerVisible.value = value;
}

defineExpose({
  changeColSetting
});
</script>

<style scoped lang="scss">
.empty-icon {
  font-size: 30px;
}
.cursor-move {
  cursor: move;
}
.change_btn {
  cursor: pointer;
  &:hover {
    font-weight: bold;
    color: var(--el-color-primary);
    cursor: pointer;
  }
}
.icon_highlight {
  font-weight: bold;
  color: var(--el-color-primary);
}
.icon_highlight--show {
  color: var(--el-color-primary);
}
.icon_highlight--hide {
  color: var(--el-color-warning);
}
</style>

<style lang="scss">
.my-date-picker {
  .el-input__prefix {
    display: none;
  }
}
</style>
