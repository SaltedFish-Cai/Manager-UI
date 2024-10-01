<template>
  <template v-if="item.type == 'tabs-form'">
    <el-form-item :prop="item.prop" class="m-form-tabs-box" style="flex-direction: column">
      <!-- label -->
      <!-- <template #label v-if="item.label">
        <form-label :label="item.label" :tip="item.tip"></form-label>
      </template> -->

      <section class="tabs-form" :style="{ height: tabHeight + 'px' }">
        <!-- tabs -->
        <!-- :editable="!item.disabled" -->

        <el-tabs
          :id="'m-tab-' + id"
          ref="tabsFormRef"
          v-model="stepsIndex"
          class="m-form-tabs"
          type="border-card"
          :editable="!display"
          @tab-click="val => clickToChange(String(item.prop), val)"
        >
          <template v-if="!display" #addIcon>
            <m-button is="add" :disabled="item.disabled" size="small" class="add-tab" @click="addTabs"> 新增 </m-button>
          </template>
          <el-tab-pane v-for="(tab, tabIndex) in data[String(item.prop)]" :key="tab.name" :name="tab.name">
            <template #label>
              <div :class="['flex-center-start', 'tabs-item-title', tab.isError ? 'error-pane' : '']">
                <div class="tabs-item-title_text">{{ titleArr[tabIndex] }}</div>
                <m-icon
                  v-if="!display && !item.disabled"
                  class="hand remove-hand ml5"
                  name="close_circle_line"
                  link
                  @click="removeTab(tab)"
                />
              </div>
            </template>

            <!-- form -->
            <section class="tabs-form-body flat-style">
              <transition v-show="stepsIndex == tab.name" appear name="m-fade-in-transform" mode="out-in">
                <el-form
                  :model="tab"
                  :ref="el => setRuleTabsFormRef(el, tab)"
                  :rules="rules[String(item.prop)] || {}"
                  status-icon
                >
                  <!-- v-show 防闪烁 -->
                  <section
                    class="tabs-form-item"
                    v-show="stepsIndex == tab.name"
                    v-for="tabGroupItem in item.inMultipleConfig"
                    :key="tabGroupItem.unitName"
                  >
                    <!-- 标题 -->
                    <template v-if="tabGroupItem.unitName != 'default'">
                      <m-title>
                        {{ tabGroupItem.unitName }}
                        <el-tooltip v-if="tabGroupItem.unitTip" :content="tabGroupItem.unitTip" placement="right">
                          <m-icon name="question_line" class="form-title_label_icon"></m-icon>
                        </el-tooltip>
                      </m-title>
                    </template>

                    <el-row :gutter="10">
                      <template v-for="tabFormItem in tabGroupItem.configs" :key="String(tabFormItem.prop)">
                        <form-item
                          :item="tabFormItem"
                          :ruleFormRef="getRuleTabsFormRef(tab.name)"
                          :data="tab"
                          :contrastData="props.item.contrastKey ? contrastDataArr[tab[props.item.contrastKey]] : {}"
                          :labelWidth="labelWidth"
                          :labelPosition="labelPosition"
                          :display="display"
                          :size="size"
                        >
                          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                            <slot :name="slot" v-bind="scope"></slot>
                          </template>
                        </form-item>
                      </template>
                    </el-row>
                  </section>
                </el-form>
              </transition>
            </section>
          </el-tab-pane>
        </el-tabs>
      </section>
    </el-form-item>
  </template>
</template>
<script lang="ts" setup>
// _Import
import { ref, watch, nextTick, computed, onMounted } from "vue";
import lodashPkg from "lodash";
import { TabsItemPropType } from "../type";
import { random } from "../hooks/random";
// import formLabel from "./label.vue";
import formItem from "./basics-item.vue";
import { Obj } from "@/package/global";
import inBrowser from "@/package/tools/inBrowser";

const { debounce } = lodashPkg;

const props = defineProps<TabsItemPropType>();

const tabsFormRef = ref();
const stepsIndex = ref(0);
const ruleTabsFormRef: any = ref([]);
const ruleTabsFormRefKeys = [] as string[];
const tabHeight = ref(82);

const titleArr = computed(() => {
  return props.data[String(props.item.prop)].map(item =>
    props.item.titleKey ? item[String(props.item.titleKey)] || "信息" : props.item.label || "信息"
  );
});

const contrastDataArr = computed(() => {
  const { contrastData, item } = props;
  const arr: Obj = {};
  if (item && item.contrastUse && contrastData && contrastData[String(item.prop)]) {
    for (let index = 0; index < contrastData[String(item.prop)].length; index++) {
      const element = contrastData[String(item.prop)][index];
      arr[element[item.contrastUse]] = element;
    }
  }
  return arr;
});

const cleanLock = debounce(
  () => {
    setTabsHeight();
  },
  500,
  { trailing: true }
);

let lock = false;

// _Function 设置 Tabs Form Ref
function setRuleTabsFormRef(el: any, prop: Obj) {
  const data = { prop: prop, ref: el };
  if (ruleTabsFormRefKeys.indexOf(prop.name) == -1) {
    ruleTabsFormRef.value.push(data);
    ruleTabsFormRefKeys.push(prop.name);
  }
}

// _Function 获取 Tabs Form Ref
function getRuleTabsFormRef(name) {
  const index = ruleTabsFormRefKeys.findIndex(item => item == name);
  if (index > -1) {
    return ruleTabsFormRef.value[index].ref;
  }
  return {};
}

// _Vue onMounted
onMounted(() => {
  nextTick(() => {
    setTabsHeight();
  });
});

// _Function 设置tabs的高度
function setTabsHeight() {
  if (!inBrowser) return;
  setTimeout(() => {
    const el = window.document.getElementById("m-tab-" + props.id);
    if (el && el.offsetHeight) {
      tabHeight.value = el.offsetHeight;
    }
  }, 500);
}

// _Function 点击Tabs
function clickToChange(prop: string, value: Obj) {
  stepsIndex.value = value.props.name || 0;
}

// _Function 新增Tabs
function addTabs() {
  props.data[String(props.item.prop)].push({
    name: random() || Date.now()
  });

  stepsIndex.value = props.data[String(props.item.prop)][props.data[String(props.item.prop)].length - 1].name;
  nextTick(() => {
    setTabsHeight();
  });
}

// _Function 删除Tabs
function removeTab(row: Obj) {
  const data = props.data[String(props.item.prop)];
  const index = data.findIndex(item => item.name == row.name);
  props.data[String(props.item.prop)].splice(index, 1);
  setTimeout(() => {
    nextTick(() => {
      stepsIndex.value = props.data[String(props.item.prop)][0].name;
    });
  }, 10);
}

// _Expose 暴露表单校验方法
const submitTabsForm = async () => {
  const _ruleTabsFormRef = ruleTabsFormRef.value;

  if (_ruleTabsFormRef.length == 0) {
    return undefined;
  }
  let formResult = true;
  for (let index = 0; index < _ruleTabsFormRef.length; index++) {
    const element = _ruleTabsFormRef[index];
    await element?.ref?.validate((valid: boolean) => {
      if (!valid) {
        formResult = false;
        element.prop.isError = true;
        if (!lock) {
          stepsIndex.value = element.prop.name;
          lock = true;
        }
      } else {
        element.prop.isError = false;
      }
    });
  }
  lock = false;

  return formResult;
};

defineExpose({ submitTabsForm });

// _Watch data
watch(
  () => props.data[String(props.item.prop)],
  data => {
    if (data?.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const formData = data[index];
        data[index] = {
          ...formData,
          name: random() || Date.now(),
          isError: false
        };
      }
      stepsIndex.value = data[0]?.name;
      cleanLock();
    } else {
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
@import "../index.scss";

/* fade-in-transform */
.m-fade-in-transform-leave-active,
.m-fade-in-transform-enter-active {
  transition: all 0.6s;
}
.m-fade-in-transform-enter-from {
  opacity: 0;
  transition: all 0.6s;
  transform: translateX(-10px);
}
.m-fade-in-transform-leave-to {
  opacity: 0;
  transition: all 0s;
  transform: translateX(0);
}
.tabs-form {
  position: relative;

  // .add-tab {
  // }
  // .tabs-form-item {
  //   border-bottom: 1px solid var(--el-border-color-light);
  //   margin-bottom: 10px;
  //   &:last-child {
  //     border-bottom: none;
  //     margin-bottom: 0px;
  //   }

  //   // .title_label {
  //   //   padding-top: 10px;
  //   //   border-top: 1px solid var(--el-border-color-light);
  //   // }
  //   // &:first-child {
  //   //   .title_label {
  //   //     padding-top: 0;
  //   //     border-top: none;
  //   //   }
  //   // }
  // }

  width: 100%;

  // &-tabs {
  //   // padding: 0 20px;
  //   // padding-top: 10px;
  // }
  &-body {
    width: 100%;
    padding: 0;
    padding-bottom: 0;
    margin: 0;
    border-top: none !important;

    // box-shadow: 0px 5px 7px #c2c5ca
  }
  .tabs-item-title {
    padding: 0 15px;
    .tabs-item-title_text {
      max-width: 155px;
      overflow: hidden;
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .remove-hand {
      display: none;
    }
    &:hover {
      .remove-hand {
        display: block;
        &:hover {
          color: var(--el-color-danger);
        }
      }
    }
  }
}
.error-pane {
  font-weight: bold;
  color: red !important;
}
</style>
<style lang="scss">
.m-form-tabs-box {
  .el-tabs__content {
    width: initial !important;
  }
  .m-form-tabs {
    .el-tabs__header {
      position: relative;
      height: 2.6em;
      padding: 0 !important;
      margin: 0 !important;
      font-size: 14px;
      .el-tabs__item {
        height: 2.6em;
        padding: 0 !important;
        font-size: 14px;
        .is-icon-close {
          display: none;
        }
      }
      .el-tabs__new-tab {
        position: absolute;
        top: 50%;
        right: 10px;
        width: initial;
        margin: 0;
        transform: translateY(-50%);
      }
    }
    .el-tabs__nav-wrap {
      width: calc(100% - 85px) !important;
    }
    .tabs-form-body {
      width: 100% !important;
    }
    .el-tabs__content {
      width: initial !important;
      height: inherit;
      padding: 10px;
      border-top: 0;
      transform: translateY(-1px);
    }
  }
}
</style>
