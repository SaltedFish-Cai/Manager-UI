<script setup lang="ts">
import { useRoute } from "vitepress";
import { computed } from "vue";
import { useData } from "../composables/data";
import { useSidebar } from "../composables/sidebar";
import VPDocAside from "./VPDocAside.vue";
import VPDocFooter from "./VPDocFooter.vue";

const { theme } = useData();

const route = useRoute();
const { hasSidebar, hasAside, leftAside } = useSidebar();

const pageName = computed(() => route.path.replace(/[./]+/g, "_").replace(/_html$/, ""));
</script>

<template>
  <div class="VPDoc" :class="{ 'has-sidebar': hasSidebar, 'has-aside': hasAside }">
    <slot name="doc-top" />
    <div class="container">
      <div v-if="hasAside" class="aside" :class="{ 'left-aside': leftAside }">
        <div class="aside-container">
          <el-scrollbar>
            <div class="aside-content">
              <VPDocAside>
                <template #aside-top><slot name="aside-top" /></template>
                <template #aside-bottom><slot name="aside-bottom" /></template>
                <template #aside-outline-before><slot name="aside-outline-before" /></template>
                <template #aside-outline-after><slot name="aside-outline-after" /></template>
                <template #aside-ads-before><slot name="aside-ads-before" /></template>
                <template #aside-ads-after><slot name="aside-ads-after" /></template>
              </VPDocAside>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <div class="content">
        <div class="content-container">
          <slot name="doc-before" />
          <main class="main">
            <Content class="vp-doc" :class="[pageName, theme.externalLinkIcon && 'external-link-icon-enabled']" />
          </main>
          <VPDocFooter>
            <template #doc-footer-before><slot name="doc-footer-before" /></template>
          </VPDocFooter>
          <slot name="doc-after" />
        </div>
      </div>
    </div>
    <slot name="doc-bottom" />
  </div>
</template>

<style scoped lang="scss">
.VPDoc {
  padding: 0px 24px 0px;
  width: 100%;
}

.container {
  margin: 0 auto;
  width: calc(100% - 160px);
  display: flex;
  justify-content: center;
}
@media (min-width: 1280px) {
  .VPDoc .aside {
    display: block;
  }
}

.aside {
  position: relative;
  order: 2;
  flex-grow: 1;
  padding-left: 32px;
  width: 256px;
  max-width: 256px;
  display: none;
}

.left-aside {
  order: 1;
  padding-left: unset;
  padding-right: 32px;
}

.aside-container {
  position: fixed;
  top: 0;
  padding-top: 112px;
  width: 256px;
  height: 100vh;
  /* overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none; */
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px));
  padding-bottom: 62px;
}

.content {
  position: relative;
  margin: 0 auto;
  width: 1px;
  flex: 1;
  height: calc(100vh - 146px);
  padding-bottom: 0 !important;
}

@media (min-width: 960px) {
  .content {
    padding: 0 0 0;
    height: calc(100vh - 146px);
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
    margin: 0;
    min-width: 640px;
    padding: 0 0 0;
    height: calc(100vh - 99px);
  }
}

.content-container {
  margin: 0 55px;
}

.VPDoc.has-aside .content-container {
  max-width: 688px;
}
</style>
<style lang="scss">
.vp-doc {
  // div::not(.m-editor) {
  h1 {
    margin-top: 30px;
    letter-spacing: -0.02em;
    line-height: 40px;
    font-size: 28px;
    letter-spacing: 2px;
    // &::after {
    //   display: inline;
    //   width: 120px;
    //   height: 1em;
    //   margin-right: 8px;
    //   content: "🥳🥳🥳";
    // }
  }
  h2 {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: bold;
    color: var(--vp-c-text-1);
    margin: 48px 0 16px;
    border-top: 1px solid var(--vp-c-divider);
    padding-top: 24px;
    letter-spacing: -0.02em;
    line-height: 32px;
    font-size: 24px;
    &::before {
      display: block;
      width: 7px;
      height: 1em;
      margin-right: 8px;
      content: "";
      background-color: var(--el-color-primary);
    }
  }
  h3 {
    display: inline-block;
    margin-top: 20px;
    border-bottom: 3px solid var(--el-color-primary);
    margin: 0 0 0 15px;
    letter-spacing: -0.01em;
    line-height: 28px;
    font-size: 20px;
  }
  h2,
  h3,
  h4,
  h5 {
    code {
      color: var(--el-color-primary);
    }
  }
  p,
  summary {
    margin: 16px 0;
  }

  // }
  .m-table-styles {
    table {
      display: table;
      margin: 0;
      overflow-x: auto;
      border-collapse: initial;
    }
    tr:nth-child(2n) {
      background-color: var(--el-table-tr-bg-color);
    }
    th {
      border: none;
    }
    td {
      border: none;
    }
  }
}

.vp-doc .m-editor {
  h1 {
    margin: 0px;
    letter-spacing: initial;
    line-height: initial;
    font-size: 32px;
    &::after {
      display: none;
    }
  }
  h2 {
    margin-top: 0px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: bold;
    color: var(--vp-c-text-1);
    margin: 0;
    border-top: none;
    padding-top: 0;
    letter-spacing: 0;
    line-height: initial;
    font-size: 24px;
    &::before {
      display: none;
    }
  }
  h3 {
    display: inline-block;
    margin-top: 0;
    border-bottom: none;
    margin: 0;
    letter-spacing: 0;
    line-height: initial;
    font-size: 19px;
  }
  h4 {
    font-size: 16px;
  }
  h5 {
    font-size: 14px;
  }
  h2,
  h3,
  h4,
  h5 {
    margin: 0;
    code {
      color: var(--el-color-primary);
    }
  }
  p,
  summary {
    margin: initial;
  }
}
</style>
