<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-11 10:27:11
 * @ Modified by: Cai
 * @ Modified time: 2024-08-23 10:19:15
 * @ Description: page name: m-element-tag
 -->

<template>
  <el-tag
    class="m-tag"
    :class="[useTagsClick ? 'tag-hand' : '']"
    v-if="item.prop"
    :color="findBgColor(data)"
    :style="{ border: 'none', color: findTextColor(data) }"
    :size="item.size"
  >
    {{ findText(data) }}
  </el-tag>
</template>
<script lang="ts" setup>
import { MElementTagType, MElementTagOptionType } from "./index";

type Props = {
  item: MElementTagType;
  useTagsClick: boolean;
  data: boolean | number | string;
  exOptions?: { [x: string]: MElementTagOptionType[] };
};
const props = withDefaults(defineProps<Props>(), {
  useTagsClick: false,
  data: "",
  exOptions: () => ({})
});

function findText(row) {
  let text = "--";
  const item = props.item;
  if (item.prop && props.exOptions[item.prop]) {
    props.exOptions[item.prop].map(item => {
      if (item.value == row) {
        text = item.label;
      }
    });
  }
  return text;
}

function findBgColor(row) {
  let bgColor = "#fff";
  const item = props.item;
  if (item.prop && props.exOptions[item.prop]) {
    props.exOptions[item.prop].map(item => {
      if (item.value == row) {
        if (item.tagStyle?.bgColor) bgColor = item.tagStyle?.bgColor;
      }
    });
  }
  return bgColor;
}

function findTextColor(row) {
  let textColor = "#3c3c43";
  const item = props.item;
  if (item.prop && props.exOptions[item.prop]) {
    props.exOptions[item.prop].map(item => {
      if (item.value == row) {
        if (item.tagStyle?.textColor) textColor = item.tagStyle?.textColor;
      }
    });
  }
  return textColor;
}
</script>
<style lang="scss">
.m-tag + .m-tag {
  margin-left: 10px;
}
.el-tag.m-tag {
  padding: 0 18px;
}
.el-tag--small.m-tag {
  padding: 0 12px;
}
.tag-hand {
  &:hover {
    cursor: pointer;
  }
}
.el-tag {
  font-size: var(--el-font-base-size-default) !important;
}
</style>
