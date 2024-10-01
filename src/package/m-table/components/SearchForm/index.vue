<template>
  <div v-if="columns.length" :class="['table-search', 'mb10', flat ? '' : 'search-form-card']">
    <el-form ref="formRef" :model="searchParam">
      <el-row :gutter="10" ref="gridRef" :collapsed="collapsed">
        <!-- v-bind="getResponsive(item)" -->
        <el-col
          v-for="(item, index) in columns"
          :key="item.prop"
          :index="index"
          :xs="spanStyle.xs"
          :sm="spanStyle.sm"
          :md="spanStyle.md"
          :lg="spanStyle.lg"
          :xl="spanStyle.xl"
        >
          <el-form-item :label="`${item.label} :`">
            <SearchFormItem :column="item" :search-param="searchParam" />
          </el-form-item>
        </el-col>
        <div class="operation">
          <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
          <el-button :icon="Delete" @click="searchReset">重置</el-button>
          <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="collapsed = !collapsed">
            {{ collapsed ? "展开" : "合并" }}
            <el-icon class="el-icon--right">
              <component :is="collapsed ? ArrowDown : ArrowUp"></component>
            </el-icon>
          </el-button>
        </div>
      </el-row>
    </el-form>
  </div>
</template>
<script setup lang="ts" name="SearchForm">
// _Import
import { computed, ref } from "vue";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import SearchFormItem from "./components/SearchFormItem.vue";
import { MTableSearchType } from "../../type";
import inBrowser from "@/package/tools/inBrowser";

// _Var
const props = withDefaults(defineProps<MTableSearchType>(), {
  columns: () => [],
  searchParam: () => ({})
});
const collapsed = ref(true);
const gridRef = ref();

// _Computed 设置单行列数
const spanStyle = computed(() => {
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

  if (props.searchSpan && props.searchSpan == 1) {
    data = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  } else if (props.searchSpan && props.searchSpan == 2) {
    data = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };
  } else if (props.searchSpan && props.searchSpan == 3) {
    data = { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 };
  }

  return data;
});

// _Computed
const breakPoint = computed(() => gridRef.value?.breakPoint);

// 获取响应式设置
// const getResponsive = (item: ColumnProps) => {
//   return {
//     span: item.search?.span,
//     offset: item.search?.offset ?? 0,
//     xs: item.search?.xs,
//     sm: item.search?.sm,
//     md: item.search?.md,
//     lg: item.search?.lg,
//     xl: item.search?.xl
//   };
// };

// _Computed 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  const show = false;
  props.columns.reduce((prev, current) => {
    prev +=
      (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0);
    // if (typeof props.searchCol !== "number") {
    //   if (prev >= props.searchCol[breakPoint.value]) show = true;
    // } else {
    //   if (prev >= props.searchCol) show = true;
    // }
    return prev;
  }, 0);
  return show;
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
