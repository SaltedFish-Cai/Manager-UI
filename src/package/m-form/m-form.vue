<template>
  <template v-if="initialization == 1">
    <el-form
      :id="id || 'default'"
      ref="ruleFormRef"
      :model="formData"
      :rules="useRules ? inRules['default'] : undefined"
      status-icon
      class="m-form"
      :class="[
        props.exClass,
        createSize == 'small' ? 'm-form_small' : createSize == 'large' ? 'm-form_large' : '',
        useTopTitle ? 'm-form_top-title' : ''
      ]"
    >
      <el-config-provider :locale="zhCn">
        <template v-for="itemConfigs in inMultipleConfig" :key="itemConfigs.unitName">
          <!-- Group组标题 -->

          <template v-if="itemConfigs.unitName != 'default'">
            <m-title>
              {{ itemConfigs.unitName }}
              <el-tooltip v-if="itemConfigs.unitTip" :content="itemConfigs.unitTip" placement="right">
                <m-icon name="question_line" class="form-title_label_icon"></m-icon>
              </el-tooltip>
            </m-title>
          </template>

          <!-- body -->
          <el-row :gutter="10">
            <template v-for="item in itemConfigs.configs" :key="String(item.prop)">
              <!-- tabs-item -->
              <el-col v-if="item.type == 'tabs-form'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <tabs-item
                  :ruleFormRef="ruleFormRef"
                  :id="id"
                  :ref="setRuleTabsFormRef"
                  :item="item"
                  :data="formData"
                  :contrastData="contrastData"
                  :rules="inRules"
                  :labelWidth="useTopTitle ? undefined : Number(labelWidth)"
                  :labelPosition="useTopTitle ? 'left' : labelPosition"
                  :display="props.display"
                  :size="createSize"
                >
                  <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                    <slot :name="slot" v-bind="scope"></slot>
                  </template>
                </tabs-item>
              </el-col>

              <!-- group 表 -->
              <el-col
                v-else-if="item.type == 'group'"
                :xs="item.spanStyle.xs"
                :sm="item.spanStyle.sm"
                :md="item.spanStyle.md"
                :lg="item.spanStyle.lg"
                :xl="item.spanStyle.xl"
              >
                <group-item
                  :ruleFormRef="ruleFormRef"
                  :item="item"
                  :data="formData"
                  :contrastData="contrastData"
                  :labelWidth="useTopTitle ? undefined : Number(labelWidth)"
                  :labelPosition="useTopTitle ? 'left' : labelPosition"
                  :display="props.display"
                  :size="createSize"
                >
                  <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                    <slot :name="slot" v-bind="scope"></slot>
                  </template>
                </group-item>
              </el-col>

              <!-- slot -->
              <el-col
                v-else-if="item.type == 'slot'"
                :xs="item.spanStyle.xs"
                :sm="item.spanStyle.sm"
                :md="item.spanStyle.md"
                :lg="item.spanStyle.lg"
                :xl="item.spanStyle.xl"
              >
                <!-- slot -->
                <el-form-item :prop="item.prop">
                  <!-- label -->
                  <template #label v-if="item.label">
                    <form-label
                      :label="item.label"
                      :tip="item.tip"
                      :labelWidth="useTopTitle ? undefined : Number(labelWidth)"
                      :labelPosition="useTopTitle ? 'left' : labelPosition"
                    ></form-label>
                  </template>
                  <slot :name="item.prop" :row="item" :data="formData" :size="createSize" />
                </el-form-item>
              </el-col>

              <!-- 标准表格 -->
              <form-item
                v-else
                :ruleFormRef="ruleFormRef"
                :item="item"
                :data="formData"
                :contrastData="contrastData"
                :alwaysContrast="alwaysContrast"
                :labelWidth="useTopTitle ? undefined : Number(labelWidth)"
                :labelPosition="useTopTitle ? 'left' : labelPosition"
                :display="props.display"
                :size="createSize"
              >
                <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                  <slot :name="slot" v-bind="scope"></slot>
                </template>
              </form-item>
            </template>
          </el-row>
        </template>
      </el-config-provider>
    </el-form>
  </template>
  <div v-else-if="initialization == -1" class="title-error">请检查配置或权限</div>
</template>

<script lang="tsx" setup>
// _Import
import { ref, Ref, reactive, defineEmits, watch, nextTick, computed, ComputedRef, provide } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import lodashPkg from "lodash";
import { OptionsTypes } from "@/package/typings/cell-options";
import { useBaseStore } from "../store/index";
import inBrowser from "@/package/tools/inBrowser";

import formLabel from "./components/label.vue";
import groupItem from "./components/group-item.vue";
import tabsItem from "./components/tabs-item.vue";
import formItem from "./components/basics-item.vue";

import { FormItemType, InFormItemType, ChildItemType, TabsFormType, MultipleConfigType, MFormProps } from "./type";
import { Obj } from "../global";

// _Var
const { debounce, cloneDeep, isEqual, isEmpty } = lodashPkg;

const props = withDefaults(defineProps<MFormProps>(), {
  contrastData: () => ({}),
  useRequired: true,
  labelWidth: 0,
  exOptions: () => ({}),
  exDependent: () => ({
    disabledRule: {},
    fileData: {},
    remoteMethod: {}
  }),
  freeLabel: true,
  display: false,
  useRules: true,
  useTopTitle: true
});

const emit = defineEmits(["cellBack", "onFormStateChange"]);

const initialization = ref(0);
const useRequired = ref(true);
const ruleFormRef = ref();
const inRules = reactive({});

const deepData = props.value && Object.keys(props.value).length > 0 ? cloneDeep(props.value) : props.data;
const formData: Ref<Obj> = ref(deepData || {});
const inConfigObj: Obj = {};

const ruleTabsFormRef: any = ref([]);
const setRuleTabsFormRef = el => ruleTabsFormRef.value.push(el);

const inMultipleConfigKeys: string[] = [];
const inMultipleConfig = reactive([] as MultipleConfigType[]);

const options: Ref<OptionsTypes> = ref({});
provide(
  "propOptions",
  computed(() => options.value)
);
const dependent: Ref<Obj> = ref({});
provide(
  "propDependent",
  computed(() => dependent.value)
);

const formState = ref("Pending");
provide("changeFormState", data => (formState.value = data));

const globalState = useBaseStore();
const _debounce = debounce(structure => setConfigData(structure), 200, { trailing: true });

let structure: FormItemType[] = [];
let baseFormData: Obj = {};
let inConfig = reactive(props.structure || []);

// _Computed createSize
const createSize: ComputedRef<"default" | "large" | "small"> = computed(() => globalState.getSize || "default");

// _Computed contrastData
const contrastData: ComputedRef<Obj> = computed(() => (!isEmpty(props.data) && !props.display ? props.contrastData : {}));

// _Function 初始化单行列数
function createSpanStyle() {
  let data = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };

  if (inBrowser) {
    const winWidth = window.outerWidth;
    const spanWidth = winWidth / 24;
    const boxWidth = window.document?.getElementById(props.id || "default");
    let maxSpan = 24 / 4;
    if (boxWidth && boxWidth.clientWidth) {
      maxSpan = boxWidth.clientWidth / spanWidth;
      if (winWidth - boxWidth.clientWidth > 50) {
        if (maxSpan < 7) {
          data = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
        } else if (maxSpan < 9) {
          data = { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };
        } else if (maxSpan < 13) {
          data = { xs: 24, sm: 12, md: 8, lg: 8, xl: 8 };
        }
      }
    }
  }

  if (props.span && props.span == 1) {
    data = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  } else if (props.span && props.span == 2) {
    data = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };
  } else if (props.span && props.span == 3) {
    data = { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 };
  }
  return data;
}

// _Function 设置单行列数
function setSpanStyle(span?: 1 | 2 | 3) {
  let data = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
  if (span == 1) {
    data = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  } else if (span == 2) {
    data = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };
  } else if (span == 3) {
    data = { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 };
  }
  return data;
}

// _Function  解析·校验规则
function setRule(item: ChildItemType | InFormItemType, type = "default") {
  // >-------------> 强制不使用校验 <------------<
  if (!props.useRequired || !useRequired.value) {
    inRules[type] = [];
    return;
  }
  const baseRules = item.display || item.disabled ? [] : [{ required: true, message: "必填项", trigger: "blur" }];
  // if (item.type == "select" || item.type == "multiple-select" || item.type == "number") {
  //   baseRules = [{ required: true, message: "必填项", trigger: "change" }];
  // }
  // const _rules = item?.isText == true ? [] : item.rules ? item.rules : [{ required: true, message: "必填项", trigger: "blur" }];
  const _rules = item.rules ? item.rules : baseRules;

  if (!inRules[type]) {
    inRules[type] = [];
  }
  const _prop = typeof item.prop == "string" ? item.prop : item.prop?.join("-");
  if (_prop) {
    const _baseRules = props.exRules || {};
    if (_baseRules[_prop]) {
      inRules[type][_prop] = [..._rules, ..._baseRules[_prop]];
    } else {
      inRules[type][_prop] = _rules;
    }
  }
}

// _Function  解析·多form情况
function setMultipleConfig(configItem: TabsFormType, spanStyle) {
  const _groupName = configItem.unitName || "default";

  const _index = inMultipleConfigKeys.indexOf(_groupName);

  // >-------------> 处理 表格 的 group 组 <------------<
  if (configItem.tabsFormConfig?.length) {
    const inMultipleTabsConfigKeys: string[] = [];
    configItem.inMultipleConfig = [];
    // const { exClassName } = getFormBoxInfo();

    let _prop = "";
    if (configItem.prop) {
      _prop = Array.isArray(configItem.prop) ? configItem.prop.join("-") : configItem.prop;
    }

    configItem.tabsFormConfig.map(value => {
      const _spanStyle = value.span != undefined ? setSpanStyle(value.span) : spanStyle;
      const item: InFormItemType = { ...value, spanStyle: _spanStyle };

      item.display = item.display != undefined ? item.display : props.display;
      item.disabled = item.disabled == undefined ? configItem.disabled : item.disabled;
      item.placeholder = item.disabled ? " " : item.placeholder;

      setRule(item, _prop);

      const _tabsGroupName = item.unitName || "default";
      const _tabsIndex = inMultipleTabsConfigKeys.indexOf(_tabsGroupName);
      if (Array.isArray(configItem.inMultipleConfig)) {
        if (_tabsIndex >= 0) {
          configItem.inMultipleConfig[_tabsIndex].configs.push(item);
        } else {
          inMultipleTabsConfigKeys.push(_tabsGroupName);
          configItem.inMultipleConfig.push({
            unitName: _tabsGroupName,
            unitTip: String(item.unitTip || ""),
            configs: [item]
          });
        }
      }
    });
  }

  if (_index >= 0) {
    inMultipleConfig[_index].configs.push(configItem);
  } else {
    inMultipleConfigKeys.push(_groupName);
    inMultipleConfig.push({
      unitName: _groupName,
      unitTip: String(configItem.unitTip || ""),
      configs: [configItem]
    });
  }
}

// _Function 开始结构处理
function init() {
  nextTick(() => {
    inMultipleConfigKeys.length = 0;
    inMultipleConfig.length = 0;
    const spanStyle = createSpanStyle();
    // const { exClassName } = getFormBoxInfo();

    inConfig.map((value: FormItemType) => {
      const _spanStyle = value.span != undefined ? setSpanStyle(value.span) : spanStyle;
      const item: InFormItemType = { ...value, spanStyle: _spanStyle };
      const _prop = Array.isArray(item.prop) ? item.prop.join("-") : item.prop;
      if (_prop) inConfigObj[_prop] = item;

      if (props.disabled) {
        item.disabled = true;
      }
      if (item.disabled) {
        item.placeholder = " ";
      }

      item.display = item.display != undefined ? item.display : props.display;

      if (props.display) {
        useRequired.value = false;
      } else {
        useRequired.value = true;
      }

      // setExRoles(item);
      if (item.type == "group" && item?.groupFormConfig?.length) {
        for (let index = 0; index < item.groupFormConfig.length; index++) {
          const el = item.groupFormConfig[index];
          const _spanStyle = el.span != undefined ? setSpanStyle(el.span) : spanStyle;

          item.groupFormConfig[index] = {
            ...item.groupFormConfig[index],
            spanStyle: _spanStyle,
            disabled: item.disabled || el.disabled,
            display: item.display || el.display
          };

          setRule(item.groupFormConfig[index]);
        }
      }

      // setClassName(item, exClassName);

      setRule(item);

      setMultipleConfig(item, spanStyle);
    });
  });
}

// _Function 暴露表单校验方法
function checkFormEdit(FormData) {
  if (isEqual(baseFormData, FormData)) {
    return false;
  }
  return true;
}

// _Function 外置数据
function setConfigData(config) {
  if (config?.length > 0) {
    inConfig = cloneDeep(config);
    init();
    initialization.value = 1;
    // const baseStore = useBaseStore();
    // if (baseStore.getToken) {
    //   initialization.value = 1;
    //   nextTick(() => {
    //     init();
    //   });
    // } else {
    //   initialization.value = -1;
    // }
  }
  if (!inConfig.length) {
    initialization.value = -1;
  }
  // structure.length = 0;
}

// _Expose 提交表单
async function submitForm(step?: "check", type?: "new") {
  const _ruleFormRef = ruleFormRef.value;
  const _ruleTabsFormRef = ruleTabsFormRef.value;
  let formResult = true;
  await _ruleFormRef.validate((valid: boolean) => {
    if (!valid) {
      formResult = false;
    }
  });
  if (formResult) {
    for (let index = 0; index < _ruleTabsFormRef.length; index++) {
      const element = _ruleTabsFormRef[index];
      const _await = await element?.submitTabsForm();
      if (_await != "undefined" && _await != undefined) {
        formResult = _await;
      }
    }
  }
  if (formResult) {
    const deepData = cloneDeep(formData.value) || {};
    const FormData = deepData;
    const _configs = props.structure || [];
    for (let index = 0; index < _configs.length; index++) {
      const element = _configs[index];
      if (element.type == "address") {
        const _prop = typeof element.prop == "string" ? element.prop : element.prop?.join("-") || "";
        delete FormData[_prop];
      } else if (type == "new" && element.type == "tabs-form" && element.prop && FormData[element.prop]) {
        FormData[element.prop] = FormData[element.prop].map(item => {
          delete item.name;
          delete item.isError;
          return item;
        });
      }
    }

    if (step == "check" && !checkFormEdit(FormData)) return null;

    return FormData;
  } else {
    return false;
  }
}

// _Expose 为tabs-from取值优化
async function getSubmitForm(step?: "check") {
  return submitForm(step, "new");
}

// _Expose 清空表单内容
async function cleanAll() {
  formData.value = {};
  ruleFormRef.value?.resetFields();
  ruleFormRef.value.clearValidate();
}

// _Expose 重置结构配置
function resetStructure(key, data) {
  if (!structure.length) {
    structure = cloneDeep(props.structure);
  }

  const _index = structure.findIndex(item => item.prop == key);
  if (_index > -1) {
    structure[_index] = { ...structure[_index], ...data };
    _debounce(structure);
  }
}

defineExpose({ submitForm, getSubmitForm, cleanAll, resetStructure });

// _Watch 外置数据
watch(
  () => props.data,
  value => {
    if (value && Object.keys(value).length > 0) {
      formData.value = value;
      if (Object.keys(baseFormData).length > 0) return;
      const JsonValue = JSON.parse(JSON.stringify(value));
      baseFormData = cloneDeep(JsonValue);
    }
  },
  { immediate: true, deep: true }
);

// _Watch 外置数据
watch(
  () => props.value,
  value => {
    if (value) {
      window.log.error("value数据赋值的使用暂未稳定，请勿使用！");
      // ruleFormRef.value?.resetFields();
      // formData.value = lodash.cloneDeep(value);
      // baseFormData = lodash.cloneDeep(value);
    }

    // if (!value) return;
    // let nullValue = true;
    // const _formData = lodash.cloneDeep(formData.value);
    // ruleFormRef.value?.resetFields();
    // for (const key in _formData) {
    //   const value = _formData[key] != null && typeof _formData[key] == "object" ? _formData[key].length : _formData[key];
    //   if (!!value) nullValue = false;
    // }
    // if (nullValue) {
    //   const defaultData = lodash.cloneDeep(_formData);
    //   const deepData = { ...defaultData, ...value };
    //   formData.value = deepData;
    //   return;
    // } else {
    //   console.warn(
    //     `为减少数据的错误赋值，不推荐直接更改data数据。(https://dms-qas.bbraun.cn/DocumentToDms/document/demo/solution/form-bind-data/readme.html)`
    //   );
    // }
    // for (const key in _formData) {
    //   if (inConfigObj[key] && inConfigObj[key].type == "slot" && value[key] && _formData[key] != value[key]) {
    //     _formData[key] = value[key];
    //   }
    // }
    // const deepData = { ...value, ..._formData };
    // formData.value = deepData;
  },
  { immediate: true }
);

// _Watch formData默认数据
watch(
  () => formData.value,
  value => {
    emit("cellBack", value);
  },
  { deep: true }
);

// _Watch 结构配置
watch(
  () => props.structure,
  data => {
    setConfigData(data);
  },
  { immediate: true, deep: true }
);

// _Watch display模式
watch(
  () => props.display,
  () => {
    setConfigData(props.structure);
  }
);

// _Watch exOptions外置选项
watch(
  () => props.exOptions,
  (data: OptionsTypes) => {
    const _data = {};
    for (const key in data) {
      const item = data[key];
      if (Array.isArray(item)) {
        _data[key] = item.map(item => ({ ...item, value: item.value }));
      } else {
        _data[key] = item;
      }
    }
    options.value = data;
  },
  { immediate: true, deep: true }
);

// _Watch exDependent外置依赖
watch(
  () => props.exDependent,
  data => {
    const { fileData, disabledRule } = data;
    if (Object.keys(dependent.value).length === 0) {
      dependent.value = data;
    } else {
      dependent.value = { ...dependent.value, fileData, disabledRule };
    }
  },
  { immediate: true, deep: true }
);

// _Watch formState
watch(
  () => formState.value,
  data => {
    emit("onFormStateChange", data);
  }
);

// 解析·根据角色配置disable
// const setExRoles = (item: InFormItemType) => {
//   if (String(props.roles) != "undefined") {
//     const _roles = props.roles || [];
//     if (String(item.disabled) == "undefined") {
//       item.disabled = true;
//     }

//     if (item.prop) {
//       const _prop = typeof item.prop == "string" ? item.prop : item.prop.join("-");
//       if (_roles.indexOf(_prop) >= 0) {
//         item.disabled = false;
//       }
//     }
//   }

//   // if (String(item.isEdit) == 'undefined' && formData.value[item.prop]) {
//   //   item.isEdit = true
//   // }
// };

// --------------------------------------------------------------------  获取页面宽高自动选择class
// function getFormBoxInfo() {
//   let exClassName = "span_item_all";
//   let tabSize = 1;
//   const el = document.getElementById(props.id || "default");
//   const scrollWidth = props.width || el?.scrollWidth || 0;
//   if (scrollWidth > 0) {
//     tabSize = 1;
//     if (scrollWidth / 4 > 300) {
//       exClassName = "span_item_four";
//       tabSize = 3;
//     } else if (scrollWidth / 3 > 300) {
//       exClassName = "span_item_three";
//       tabSize = 3;
//     } else if (scrollWidth / 2 > 300) {
//       exClassName = "span_item_two";
//       tabSize = 2;
//     } else {
//       exClassName = "span_item_all";
//       tabSize = 1;
//     }
//   }
//   return { scrollWidth, exClassName, tabSize };
// }
// // --------------------------------------------------------------------  解析·className
// const setClassName = (item: InFormItemType & { className?: string }, exClassName?: string) => {
//   const spanAll = ["tabs-form", "group"];
//   const spanAllCenter = ["transfer", "editor"];
//   const _class = item.disabled ? " item_disabled" : "";
//   const type = item.type || "";
//   if (props.span == 4 || item.span == 4) {
//     item.className = "span_item_four" + _class;
//   } else if (props.span == 3 || item.span == 3) {
//     item.className = "span_item_three" + _class;
//   } else if (props.span == 2 || item.span == 2) {
//     item.className = "span_item_two" + _class;
//   } else if (props.span == 1 || item.span == 1) {
//     item.className = "span_item_all" + _class;
//   } else if (props.span == 0 || item.span == 0) {
//     item.className = "" + _class;
//   } else if (item.span == -1) {
//     item.className = "span_item_all-center" + _class;
//   } else if (spanAll.lastIndexOf(type) >= 0) {
//     item.className = "span_item_all";
//   } else if (spanAllCenter.lastIndexOf(type) >= 0) {
//     item.className = "span_item_all-center";
//   } else {
//     // >-------------> 自动判断列数 <------------<
//     item.className = exClassName + _class;
//   }
// };
</script>

<style lang="scss">
@import "./index.scss";
@import "../../../src/styles/mp.scss";
@import "../../../src/styles/flex.scss";
.title-error {
  padding: 10px;
  font-size: 14px;
  color: var(--el-color-info);
  text-align: center;
}
</style>
