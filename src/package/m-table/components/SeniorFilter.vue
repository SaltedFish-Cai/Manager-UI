<template>
  <m-dialog v-model="state.visible" title="高级搜索" @closed="closeMenu" size="l">
    <section class="filter-list" style="height: calc(100% - 90px)">
      <template v-for="(groupItem, groupItemIndex) in state.advancedFilter.relationshipGroup" :key="groupItem.groupName">
        <div class="group">
          <div class="flex-center-between mb10 border-bottom">
            <div class="flex1 group__title" style="text-align: left">{{ groupItem.groupName }} {{ groupItemIndex + 1 }}</div>
            <m-button v-if="groupItemIndex > 0" is="trash" size="small" @click="FilterFn.remove(groupItemIndex)"
              >删除当前组</m-button
            >
          </div>

          <template v-for="(item, itemIndex) in groupItem.group" :key="propItem.prop + groupItemIndex + itemIndex">
            <el-form
              :model="item"
              :ref="el => setAllFormRef(el, propItem.prop + groupItemIndex + itemIndex)"
              :rules="rulesArr[item.key]"
            >
              <section class="filter-item flex-center-start">
                <el-select v-if="false" v-model="item.fieldName" placeholder="请选择需要搜索的字段">
                  <el-option v-for="opt in settingColumnsComputed" :key="opt.Value" :label="opt.label" :value="opt.prop" />
                </el-select>
                <div v-else class="filter-item_name"># {{ propItem.label }}</div>

                <el-select
                  class="ml10 mr10"
                  style="width: 210px"
                  v-model="item.conditionalType"
                  placeholder="请选择关系类型"
                  @change="value => conditionalTypeChange(value, item.key)"
                >
                  <el-option
                    v-for="opt in seniorFilterOptions.LineConditional"
                    :key="opt.Value"
                    :label="opt.Description"
                    :value="opt.Value"
                  />
                </el-select>
                <el-form-item prop="fieldValue" style="width: 60% !important; margin-bottom: 0">
                  <el-input
                    v-model="item.fieldValue"
                    type="text"
                    placeholder="请输入搜索内容"
                    :disabled="item.conditionalType == 11"
                  ></el-input>
                </el-form-item>
                <m-button class="ml10" is="trash" @click="FilterFn.removeItem(groupItemIndex, itemIndex)">删除</m-button>
              </section>

              <div class="flex-center" v-if="itemIndex < groupItem.group.length - 1">
                条件与条件关系：
                <el-radio-group v-model="groupItem.groupLinkType">
                  <el-radio
                    v-for="opt in seniorFilterOptions.linkOptions"
                    :key="opt.SystemDictionaryIdentifier"
                    :label="opt.Value"
                    size="large"
                  >
                    {{ opt.Description }}
                  </el-radio>
                </el-radio-group>
              </div>
            </el-form>
          </template>

          <div class="flex-center mt20">
            <m-button font="add_circle_line" plain type="primary" @click="FilterFn.addFilter(groupItemIndex)">
              添加新条件
            </m-button>
          </div>
        </div>
        <div class="flex-center" v-if="groupItemIndex < state.advancedFilter.relationshipGroup.length - 1">
          组与组关系：
          <el-radio-group v-model="state.advancedFilter.relationshipGroupLinkType">
            <el-radio
              v-for="opt in seniorFilterOptions.linkOptions"
              :key="opt.SystemDictionaryIdentifier"
              :label="opt.Value"
              size="large"
            >
              {{ opt.Description }}
            </el-radio>
          </el-radio-group>
        </div>
      </template>
      <div class="flex-center mt10">
        <m-button class="mb10" font="flag_line" @click="FilterFn.addFilterGroup" plain type="primary"> 新增条件组 </m-button>
      </div>
    </section>

    <template #footer>
      <div class="flex-center">
        <m-button is="search" @click="submitTabsForm">确认搜索</m-button>
      </div>
    </template>
  </m-dialog>
</template>

<script lang="ts" setup>
// _Import
import { ref, reactive, watch, computed, nextTick } from "vue";
import { ElMessageBox } from "element-plus";
import { Obj } from "@/package/global";
import { SeniorFilterPropsType } from "../type";

// _Var
const props = defineProps<SeniorFilterPropsType>();

const emits = defineEmits(["update:modelValue", "callback", "saveAndFilter"]);

const ruleTabsFormRef: any = ref([]);
const ruleTabsFormRefKeys: any = [];
const setAllFormRef = (ref: any, name: string) => {
  if (ruleTabsFormRefKeys.indexOf(name) == -1) {
    ruleTabsFormRef.value.push(ref);
    ruleTabsFormRefKeys.push(name);
  }
};
const rulesArr = ref({} as Obj);
const rules = {
  fieldValue: [{ required: true, message: "请输入搜索内容", trigger: "change" }]
};
const state = reactive({
  visible: false,

  advancedFilter: {
    fieldName: "",
    relationshipGroupLinkType: "1",
    relationshipGroup: [] as Obj[]
  }
});

// _Computed 过滤Filter类型
const settingColumnsComputed = computed(() => {
  return props.settingColumns.filter(item => {
    const filterType = item.filterType || "input";
    return item.isShow && filterType == "input";
  });
});

// _Function 选择关系类型回调
function conditionalTypeChange(value, key) {
  if (value == 11) {
    rulesArr.value[key] = [];
  } else {
    rulesArr.value[key] = rules;
  }
  const _ruleTabsFormRef: any = ruleTabsFormRef.value;
  for (let index = 0; index < _ruleTabsFormRef.length; index++) {
    const element = _ruleTabsFormRef[index];
    element.clearValidate();
  }
}

const FilterFn = {
  // _Function 添加组
  addFilterGroup() {
    const key = Number(new Date());
    const upData = {
      groupName: `搜索条件组`,
      group: [{ fieldValue: "", conditionalType: "0", key }],
      groupLinkType: "1"
    };
    state.advancedFilter.relationshipGroup.push(upData);
    rulesArr.value[key] = rules;
    // state.ItemList.push({ fieldName: props.propItem.prop, fieldValue: "", LinkNextType: "0", conditionalType: "0" });
  },

  // _Function 提交搜索条件
  addFilter(index: number) {
    const key = Number(new Date());
    state.advancedFilter.relationshipGroup[index].group.push({
      fieldValue: "",
      conditionalType: "0",
      key
    });
    rulesArr.value[key] = rules;
  },

  // _Function 删除组
  remove(pIndex: number, tip = true) {
    if (tip) {
      ElMessageBox.confirm("是否删除当前条件组?", "温馨提示", {
        type: "error",
        confirmButtonText: "确认删除"
      }).then(() => {
        state.advancedFilter.relationshipGroup.splice(pIndex, 1);
      });
    } else {
      state.advancedFilter.relationshipGroup.splice(pIndex, 1);
    }
  },

  // _Function 删除搜索条件
  removeItem(pIndex: number, index: number) {
    const item = state.advancedFilter.relationshipGroup[pIndex].group[index];
    delete rulesArr.value[item.key];

    state.advancedFilter.relationshipGroup[pIndex].group.splice(index, 1);
    if (!state.advancedFilter.relationshipGroup[pIndex].group.length) {
      FilterFn.remove(pIndex, false);
    }
  }
};

// _Function 暴露表单校验方法
async function submitTabsForm() {
  const _ruleTabsFormRef: any = ruleTabsFormRef.value;
  if (_ruleTabsFormRef.length == 0) {
    return undefined;
  }
  let formResult = true;
  for (let index = 0; index < _ruleTabsFormRef.length; index++) {
    const element = _ruleTabsFormRef[index];
    if (!element) formResult = false;
    else {
      await element?.validate((valid: boolean) => {
        if (!valid) formResult = false;
      });
    }
  }
  if (!formResult) return;
  state.advancedFilter.fieldName = props.propItem.prop;

  for (let index = 0; index < state.advancedFilter.relationshipGroup.length; index++) {
    const _item = state.advancedFilter.relationshipGroup[index];
    for (let index = 0; index < _item.group.length; index++) {
      const its = _item.group[index];
      if (its.conditionalType == 11) its.fieldValue = "";
    }
  }

  const _advancedFilter = {
    ...state.advancedFilter,
    label: props.propItem.label,
    props: props.propItem.prop
  };
  state.advancedFilter = {
    fieldName: "",
    relationshipGroupLinkType: "0",
    relationshipGroup: [] as Obj[]
  };
  emits("saveAndFilter", { AdvancedFilter: _advancedFilter });
  emits("update:modelValue", false);
}

// _Function 窗口关闭回调
function closeMenu() {
  emits("update:modelValue", false);
  nextTick(() => {
    ruleTabsFormRef.value.length = 0;
    ruleTabsFormRefKeys.length = 0;
  });
}

// _Watch modelValue
watch(
  () => props.modelValue,
  visible => {
    state.visible = visible;

    if (visible) {
      const { AdvancedFilter } = props.tableQuery;
      const propItem = props.propItem;
      const item = AdvancedFilter.find(item => item.fieldName == propItem.prop);
      if (!item) {
        FilterFn.addFilterGroup();
      } else {
        for (let index = 0; index < item.relationshipGroup.length; index++) {
          const _item = item.relationshipGroup[index];
          for (let index = 0; index < _item.group.length; index++) {
            const its = _item.group[index];
            rulesArr.value[its.key] = its.conditionalType == 11 ? [] : rules;
          }
        }
        state.advancedFilter = item;
      }
    } else {
      state.advancedFilter = {
        fieldName: "",
        relationshipGroupLinkType: "0",
        relationshipGroup: [] as Obj[]
      };
      rulesArr.value = {};
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.filter-list {
  .group {
    box-sizing: border-box;
    padding: 15px;
    overflow-x: hidden;
    background-color: var(--el-bg-color);
    background-color: var(--el-bg-color-page);
    border: 1px solid var(--el-border-color-light);
    border-radius: 6px;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    .group__title {
      position: relative;
      height: 1.7em;
      padding-left: 12px;
      font-size: 15px;
      color: var(--el-color-primary);
      &::before {
        position: absolute;
        top: 3.5px;
        left: 0;
        display: block;
        width: 4px;
        height: 15px;
        content: "";
        background-color: var(--el-color-primary);
      }
    }
  }
  .filter-item {
    margin-bottom: 10px;
    color: var(--el-menu-text-color);
    .filter-item_name {
      width: 210px;
      font-size: 15px;
      font-weight: bold;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
