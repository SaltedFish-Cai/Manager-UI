<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 16:08:31
 * @ Modified by: Cai
 * @ Modified time: 2024-08-30 14:37:28
 * @ Description: page name: m-element-icon
 -->

<template>
  <template v-if="item.prop">
    <m-button
      v-if="!item.display"
      is="go"
      :font="selectItem"
      :disabled="item.disabled"
      type="default"
      @click="dialogVisible = true"
      class="m-icon-btn"
    >
      {{ !item?.disabled && item?.placeholder ? item?.placeholder : "点击更改图标" }}
    </m-button>
    <div v-else class="view-icon">
      <m-icon v-if="selectItem" :name="selectItem"></m-icon>
      <div v-else>--</div>
    </div>
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
      <m-icon v-if="selectContrastItem" :name="selectContrastItem"></m-icon>
    </div>
  </template>
  <div v-else>--</div>

  <m-dialog v-model="dialogVisible" title="Icon 选择" size="s" height="auto">
    <m-icon-select class="pt10" @change="iconChange" :defaultIcon="selectItem"> </m-icon-select>

    <template #footer>
      <div class="flex-center">
        <m-button is="save" @click="saveIcon"> 确认选择 </m-button>
      </div>
    </template>
  </m-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { MElementIconType } from "./index";
import lodashPkg from "lodash";
import mIconSelect from "../../m-icon-select/index.vue";

const { isEqual } = lodashPkg;

type Props = {
  item: MElementIconType;
  data: {};
  contrastData?: {};
  alwaysContrast?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({})
});

const emit = defineEmits(["change"]);

const selectItem = ref("");
const selectContrastItem = ref("");
const dialogVisible = ref(false);

function iconChange(name) {
  selectItem.value = name;
}

function saveIcon() {
  if (!props.item.prop) return;
  props.data[props.item.prop] = selectItem.value;
  dialogVisible.value = false;
  emit("change", { value: name, item: props.item });
}

watch(
  () => props.data[String(props.item.prop)],
  data => {
    if (!props.item.prop) return;
    selectItem.value = data;
  },
  { immediate: true }
);

watch(
  () => props.contrastData[String(props.item.prop)],
  data => {
    if (!props.item.prop) return;
    selectContrastItem.value = data;
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
@import "../index.scss";
.view-icon {
  font-size: 24px;
}
</style>

<style lang="scss">
// .m-icon-btn {
//   padding: 8px 11px;
//   height: max-content;
// }
</style>
