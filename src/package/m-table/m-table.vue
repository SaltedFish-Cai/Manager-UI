<template>
  <div
    class="m-table-styles"
    :class="[
      createSize == 'small' ? 'm-table-styles_small' : createSize == 'large' ? 'm-table-styles_large' : '',
      showOverflowTooltip ? '' : 'un-use-tooltip',
      useScrollTop ? 'm-table-use-scroll-top' : ''
    ]"
    v-if="initialization == 1"
  >
    <img class="m-table-styles_load" src="../imgs/load.png" @load="createObserver" />
    <client-only>
      <el-config-provider :locale="zhCn">
        <!-- 查询表单 -->
        <SearchForm
          v-if="false"
          :id="id"
          :search="searchAction"
          :searchReset="searchReset"
          :search-param="searchParam"
          :columns="searchColumns"
          :search-span="searchSpan"
          v-show="isShowSearch"
          :flat="flat"
        />

        <!-- 表格内容 -->
        <div :class="['table-main', flat ? '' : 'use-card-style']">
          <!-- 表格头部 操作按钮 -->
          <div class="table-flex table-flex-header">
            <div class="table-flex-lf">
              <slot name="HeaderLeft" :selectedListIds="selectedListIds" :selectedList="selectedList" />
            </div>
            <div class="table-flex-ct">
              <slot name="HeaderCenter" :selectedListIds="selectedListIds" :selectedList="selectedList" />
            </div>
            <div :class="[embeddedToolButton ? 'table-flex-ri-embedded' : 'table-flex-ri']" v-if="showToolButton">
              <slot name="ToolButton">
                <div class="flex-center-end">
                  <slot name="ToolButtonInline"></slot>

                  <m-button v-if="props.exportApi" is="export" @click="props.exportApi"> 导出报表 </m-button>
                  <m-button font="reset_line" type="default" @click="getTableList()">刷新</m-button>
                  <m-button font="filter_line" :plain="false" type="primary" @click="changeColSetting(true)">筛选</m-button>
                </div>
              </slot>
            </div>
          </div>
          <slot name="HeaderAfter" />

          <!-- 普通搜索结果展示 -->
          <section v-if="Query.length" class="flex mb10 table-query">
            <div class="table-title-label mr10">搜索条件 :</div>
            <div class="mr10 query_item" v-for="(item, index) in Query" :key="item.label + item.value">
              <span class="icon_highlight mr5">#{{ index + 1 }}</span>
              <span>{{ item.label }} :</span>

              <template
                v-for="(relationshipItem, relationshipIndex) in item.relationshipGroup"
                :key="'relationshipItem' + relationshipIndex"
              >
                <span class="flex-center query_item_box query_item_box2">
                  <div>{{ relationshipItem.value }}</div>
                  <m-icon
                    class="ml5 hand remove-icon"
                    name="close_circle_line"
                    @click="handleRemoveQuery(relationshipItem)"
                  ></m-icon>
                </span>
              </template>
            </div>

            <m-button is="trash" size="small" @click="handleCleanAllQuery">清空</m-button>
          </section>

          <!-- 高级搜索结果展示 -->
          <section v-if="AdvancedQuery.length" class="flex mb10 table-query">
            <div class="table-title-label mr10">高级搜索 :</div>
            <div class="mr10 query_item" v-for="(item, index) in AdvancedQuery" :key="item.label + item.value">
              <span class="icon_highlight mr5">#{{ index + 1 }}</span>
              <span>{{ item.label }} :</span>

              <template
                v-for="(relationshipItem, relationshipIndex) in item.relationshipGroup"
                :key="'relationshipItem' + relationshipIndex"
              >
                <span class="flex-center query_item_box">
                  <template
                    v-for="(groupItem, groupItemIndex) in relationshipItem.group"
                    :key="groupItem.conditionalType + groupItem.value"
                  >
                    <span class="query_item_text flex-center">
                      <span class="query_item_text_relationship_link">
                        &lt;{{ setConditionalType(groupItem.conditionalType) }}&gt;
                      </span>
                      <span class="query_item_text_relationship_link_value">{{ groupItem.fieldValue }}</span>
                      <!-- <el-icon class="ml5 hand" @click="handleRemoveQuery(item)"><CircleClose /></el-icon> -->
                    </span>

                    <span class="query_item_text_group_link" v-if="groupItemIndex < relationshipItem.group.length - 1">
                      &lt;{{ setRelationshipGroupLinkType(relationshipItem.groupLinkType) }}&gt;
                    </span>
                  </template>
                </span>
                <span class="query_item_text_group_link" v-if="relationshipIndex < item.relationshipGroup.length - 1">
                  &lt;{{ setRelationshipGroupLinkType(item.relationshipGroupLinkType) }}&gt;
                </span>
              </template>
              <m-icon class="ml5 hand remove-icon" name="close_circle_line" @click="handleRemoveSeniorQuery(item)"></m-icon>
            </div>

            <m-button is="trash" size="small" @click="handleCleanAllSeniorQuery">清空</m-button>
          </section>

          <!-- 表格主体 -->
          <div class="table_body" v-resize:300="tableResize">
            <div v-if="tableLoad" class="loading"><m-icon class="loading_font" name="loading_line"></m-icon></div>

            <!-- 表格主体 -->
            <el-table
              :style="[{ zoom: tableGlobalZoom }]"
              :id="id || 'default-table'"
              ref="tableRef"
              v-bind="$attrs"
              :data="useRelData ? selectedList : tableData"
              :row-key="rowKey"
              :summary-method="getSummaries"
              :expand-row-keys="expandRowKeys"
              @select="handleChangeBack"
              @select-all="handleCellClickAll"
              @header-dragend="handleHeaderDragend"
              :show-summary="showSummary"
              scrollbar-always-on
              border
            >
              <!-- :class="isSelectionColumn ? 'useSelection' : ''" -->
              <!-- @cell-click="handleCellClick" -->
              <!-- @sort-change="handleSortChange" -->

              <!-- 默认插槽 -->
              <slot></slot>
              <el-table-column
                v-if="!useSelectionTable && showTableIndex"
                type="index"
                label="#"
                :width="45"
                align="center"
                fixed="left"
              />

              <template v-for="item in tableColumns" :key="item">
                <template v-if="item.type == 'expand'">
                  <el-table-column v-bind="item" :width="empowerWidth" :min-width="empowerWidth" fixed="right">
                    <template #default="scope">
                      <div
                        class="custom-expand"
                        :class="expandRowVisible[scope.$index] ? 'show-expand' : 'hide-expand'"
                        :style="{ width: empowerBodyWidth }"
                      >
                        <slot name="Expand" :row="scope.row" :index="scope.$index"></slot>
                      </div>
                    </template>
                  </el-table-column>
                </template>

                <!-- # -->
                <el-table-column
                  v-if="item.type == 'index' && useSelectionTable"
                  type="index"
                  label="#"
                  :width="45"
                  :align="item.align ?? 'center'"
                  fixed="left"
                />

                <!-- 选项 -->
                <el-table-column
                  v-if="(item.type == 'selection' || item.type == 'radio') && !isTableSelectAll"
                  v-bind="item"
                  :width="45"
                  :align="item.align ?? 'center'"
                  :reserve-selection="item.type == 'selection' || item.type == 'radio'"
                  fixed="left"
                  :selectable="filterSelectRow"
                >
                  <template #default="{ row }">
                    <div class="flex-center" v-if="item.type == 'radio'">
                      <div
                        class="m-table-radio hand"
                        :class="[row.selected ? 'm-table-radio_action' : '']"
                        @click="handleRadioChecked(row)"
                      />
                    </div>
                    <div class="flex-center" v-if="row?.children?.length">
                      <el-checkbox
                        :indeterminate="row.indeterminate"
                        :model-value="row.selected"
                        @change="handleChangeChecked(row)"
                      />
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  :width="45"
                  :align="item.align ?? 'center'"
                  fixed="left"
                  v-if="item.type == 'selection' && isTableSelectAll"
                >
                  <template #default="{}">
                    <div class="flex-center">
                      <el-checkbox disabled :checked="checkedSelectedIcon" />
                    </div>
                  </template>
                </el-table-column>

                <!-- Children展开全部 -->
                <el-table-column
                  v-if="item.type == 'row'"
                  :width="45"
                  class-name="text-center"
                  :reserve-selection="item.type == 'row'"
                  fixed="left"
                >
                  <template #header>
                    <el-button
                      :icon="expandRowVisible.length ? Open : TurnOff"
                      :style="['font-size:22px', expandRowVisible.length ? 'color:var(--el-color-primary)' : '']"
                      link
                      v-if="structure.length"
                      @click="setChildrenRowKeysAll"
                    />
                  </template>
                  <template #default="{ row }">
                    <div class="flex-center">
                      <m-icon
                        v-if="row?.children?.length"
                        class="expand-icon"
                        :class="[row.childrenVisible ? 'expand-icon-action' : '']"
                        name="right_line"
                        @click="setChildrenRowKey(row)"
                      />
                    </div>
                  </template>
                </el-table-column>

                <!-- 向下展开 -->
                <!-- expand 支持 tsx 语法 && 作用域插槽 (tsx > slot) -->
                <template v-if="item.type == 'expand'">
                  <el-table-column :width="45" fixed="left">
                    <template #header>
                      <el-button
                        :icon="expandRowVisible.length ? Open : TurnOff"
                        :style="['font-size:22px', expandRowVisible.length ? 'color:var(--el-color-primary)' : '']"
                        link
                        v-if="structure.length && showExpandAll"
                        @click="setExpandRowKeysAll()"
                      />
                    </template>
                    <template #default="scope">
                      <div class="flex-center">
                        <m-icon
                          class="expand-icon"
                          :class="[expandRowVisible[scope.$index] ? 'expand-icon-action' : '']"
                          name="right_line"
                          @click="setExpandRowKey(scope.$index, scope.row)"
                        />
                      </div>
                    </template>
                  </el-table-column>
                </template>

                <!-- Cell -->
                <template v-if="item.cellConfig && item.prop && item.isShow && item.cellConfig.type != 'tag'">
                  <header-item
                    :id="id"
                    :tableRef="tableRef"
                    :orderProp="orderProp"
                    :tableQuery="tableQuery"
                    :item="{
                      ...item,
                      filterType: item.cellConfig.type,
                      cellConfig: { ...item.cellConfig, display: item.cellConfig.display || props.display }
                    }"
                    :length="tableColumns.filter(item => item.isShow).length"
                    :exOptions="exOptions"
                    :listeners="$"
                    :size="createSize"
                    @handle-sort-change="handleSortChange"
                    @save-and-filter="handleColSetting"
                    @handle-cell-click="handleCellClick"
                    @handle-remove-query="handleRemoveQuery"
                    @open-senior-filter="openSeniorFilter"
                  >
                    <template #default="{ row }">
                      <cell-input
                        v-if="item.cellConfig.type == 'input' || item.cellConfig.type == 'textarea'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exFormatter="exFormatter"
                        :exParser="exParser"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                      />

                      <cell-number
                        v-else-if="item.cellConfig.type == 'number'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                      />

                      <cell-select
                        v-else-if="item.cellConfig.type == 'select' || item.cellConfig.type == 'multiple-select'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                        :exOptions="exOptions"
                      >
                        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                          <slot :name="slot" v-bind="scope"></slot>
                        </template>
                      </cell-select>

                      <!-- <cell-tag v-else-if="item.cellConfig.type == 'tag'" :item="item" :exOptions="exOptions" /> -->

                      <cell-request-select
                        v-else-if="item.cellConfig.type == 'request-select' || item.cellConfig.type == 'multiple-request-select'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                        :exOptions="exOptions"
                        :remoteMethod="remoteMethod"
                        :onlineSelectChange="onlineSelectChange"
                      >
                        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                          <slot :name="slot" v-bind="scope"></slot>
                        </template>
                      </cell-request-select>

                      <cell-online-select
                        v-else-if="item.cellConfig.type == 'online-select' || item.cellConfig.type == 'multiple-online-select'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                        :exOptions="exOptions"
                        :remoteMethod="remoteMethod"
                        :onlineSelectChange="onlineSelectChange"
                      >
                        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                          <slot :name="slot" v-bind="scope"></slot>
                        </template>
                      </cell-online-select>

                      <cell-switch
                        v-else-if="item.cellConfig.type == 'switch'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                        :exOptions="exOptions"
                      />

                      <cell-radio
                        v-else-if="item.cellConfig.type == 'radio'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                        :exOptions="exOptions"
                      />

                      <cell-check-box
                        v-else-if="item.cellConfig.type == 'checkbox'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                        :exOptions="exOptions"
                      />

                      <cell-cascader
                        v-else-if="
                          item.cellConfig.type == 'cascader' ||
                          item.cellConfig.type == 'cascader-check' ||
                          item.cellConfig.type == 'multiple-cascader-check' ||
                          item.cellConfig.type == 'multiple-cascader'
                        "
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                        :exOptions="exOptions"
                      />

                      <cell-time
                        v-else-if="
                          item.cellConfig.type == 'date-picker-group' ||
                          item.cellConfig.type == 'date-picker' ||
                          item.cellConfig.type == 'date-time-range' ||
                          item.cellConfig.type == 'month-picker-group' ||
                          item.cellConfig.type == 'month-picker' ||
                          item.cellConfig.type == 'time-picker-group' ||
                          item.cellConfig.type == 'time-picker' ||
                          item.cellConfig.type == 'year-picker'
                        "
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                      />

                      <cell-icon
                        v-else-if="item.cellConfig.type == 'select-icon'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, size: createSize, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                      />

                      <cell-file
                        v-else-if="item.cellConfig.type == 'file'"
                        :item="{
                          ...item,
                          cellConfig: { ...item.cellConfig, display: item.cellConfig.display || props.display }
                        }"
                        :row="row"
                        :exDisabled="exDisabled"
                        :exDisplay="exDisplay"
                        :exFileData="exFileData"
                      />
                      <div v-if="row['errorMessage']" class="element-error-message">{{ row["errorMessage"][item.prop] }}</div>
                    </template>
                  </header-item>
                </template>

                <!-- other 循环递归 -->
                <TableColumn
                  :id="id"
                  :tableRef="tableRef"
                  :orderProp="orderProp"
                  :tableQuery="tableQuery"
                  v-else-if="(!item.type && item.prop && item.isShow) || item.childrenColumn"
                  :column="{ ...item, filterType: item.cellConfig?.type == 'tag' ? 'select' : item.filterType }"
                  :length="tableColumns.filter(item => item.isShow).length"
                  :exOptions="exOptions"
                  :listeners="$"
                  :exTargetTag="exTargetTag"
                  :size="createSize"
                  :operationSize="operationSize"
                  :showOverflowTooltip="showOverflowTooltip"
                  @handle-sort-change="handleSortChange"
                  @save-and-filter="handleColSetting"
                  @handle-cell-click="handleCellClick"
                  @handle-remove-query="handleRemoveQuery"
                  @open-senior-filter="openSeniorFilter"
                >
                  <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                    <slot :name="slot" :row="scope.row" :index="scope.$index" :size="createSize"></slot>
                  </template>
                </TableColumn>
              </template>
              <!-- 插入表格最后一行之后的插槽 -->
              <template #append>
                <slot name="BodyAppend"> </slot>
              </template>

              <!-- 表格无数据情况 -->
              <template #empty>
                <div class="table-empty">
                  <slot name="Empty">
                    <m-icon class="empty-icon" name="world_line"></m-icon>
                    <div>暂无数据</div>
                  </slot>
                </div>
              </template>
            </el-table>
          </div>

          <!-- 分页组件 -->
          <div class="table-flex table-flex-footer" :style="{ height: $slots['FooterCenter'] ? '24px' : '' }">
            <div class="table-flex-lf">
              <slot name="FooterLeft">
                <div class="is-selected" v-if="isSelectionColumn">
                  <div class="flex-center">
                    <el-button
                      class="mr10"
                      v-if="props.showSelectAll"
                      type="primary"
                      size="small"
                      plain
                      @click="handleSelectAllOrCancel"
                    >
                      {{ !isTableSelectAll ? "一键全选" : "取消全选" }}
                    </el-button>
                    <div class="flex-center">
                      <el-button
                        class="mr10"
                        size="small"
                        plain
                        v-if="!isTableSelectAll && !isExpand && !isChildren"
                        @click="useRelData = !useRelData"
                      >
                        {{ useRelData ? "切换至全部" : "切换至已选择" }}
                      </el-button>
                      <span v-if="!isTableSelectAll">
                        已选择 <span class="bold-text ml3 mr3">{{ selectedList.length }}</span> 条
                      </span>
                      <span v-else>
                        <span v-if="checkedSelectedIcon">
                          已选择
                          <span class="bold-text ml3 mr3">{{ isTableSelectAll ? pageable.total : selectedList.length }}</span>
                          条
                        </span>
                        <span v-else>已选择 <span class="bold-text ml3 mr3">全部</span></span>
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else></div>
              </slot>
            </div>

            <div v-if="$slots['FooterCenter']" class="table-flex-ct flex-center">
              <slot name="FooterCenter" :selectedListIds="selectedListIds" :selectedList="selectedList"></slot>
            </div>
            <div class="table-flex-ri width-int">
              <div>
                <slot name="paginationLeft"></slot>
              </div>

              <slot name="Pagination">
                <Pagination
                  v-if="showPagination"
                  :pageable="pageable"
                  :exPagination="exPagination"
                  :handle-size-change="handleSizeChange"
                  :handle-current-change="handleCurrentChange"
                  :useFooterCenter="useFooterCenter"
                />
              </slot>
            </div>
          </div>
        </div>

        <!-- 表配置 -->
        <ColSetting
          v-if="showToolButton"
          ref="colRef"
          v-model:settingColumns="settingColumns"
          :id="props.id"
          :exOptions="exOptions"
          :size="createSize"
          :display="props.display"
          @save-and-filter="handleColSetting"
          @close-drawer="handleCloseDrawer"
          @open-senior-filter="openSeniorFilter"
          @handle-change-drag-el="handleChangeDragEl"
          @handle-change-drag-sort="handleChangeDragSort"
        />

        <!-- 高级搜索 -->
        <SeniorFilter
          ref="seniorRef"
          v-model="seniorFilterData.visible"
          :table-query="tableQuery"
          :settingColumns="settingColumns"
          :senior-filter-options="seniorFilterOptions"
          :propItem="seniorFilterData.propItem"
          @save-and-filter="handleSeniorSetting"
        />
      </el-config-provider>
    </client-only>
  </div>
  <div v-else-if="initialization == -1" class="title-error">请检查配置或权限</div>
</template>

<script setup lang="ts" name="mTableComponent">
// _Import
import { ref, Ref, watch, computed, ComputedRef, onBeforeMount, useSlots } from "vue";
import { ElTable } from "element-plus";
import { exRoleType } from "./type";
import { useBaseStore } from "../store/index";
import { Open, TurnOff } from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useTagsStore } from "./hooks/tags-store";
import inBrowser from "@/package/tools/inBrowser";

import { useTable } from "./hooks/useTable";
import { useSelection } from "./hooks/useSelection";
import { useExpand } from "./hooks/useExpand";
import { useDictionary } from "./hooks/useDictionary";
import { useRef } from "./hooks/useRef";
import { useFilter } from "./hooks/useFilter";

import SearchForm from "./components/SearchForm/index.vue";
import Pagination from "./components/Pagination.vue";
import ColSetting from "./components/ColSetting.vue";
import TableColumn from "./components/TableColumn.vue";
import SeniorFilter from "./components/SeniorFilter.vue";
import HeaderItem from "./components/header-item.vue";

import CellInput from "./components/cell/input.vue";
import CellNumber from "./components/cell/number.vue";
import CellSelect from "./components/cell/select.vue";
// import CellTag from "./components/cell/tag.vue";
import CellRequestSelect from "./components/cell/request-select.vue";
import CellOnlineSelect from "./components/cell/online-select.vue";
import CellSwitch from "./components/cell/switch.vue";
import CellRadio from "./components/cell/radio.vue";
import CellCheckBox from "./components/cell/checkbox.vue";
import CellCascader from "./components/cell/cascader.vue";
import CellTime from "./components/cell/time.vue";
import CellIcon from "./components/cell/icon.vue";
import CellFile from "./components/cell/file.vue";
import { Obj } from "@/package/global";
import { MTableType } from "./type";
// import printJS from "print-js";

// _Var
const props = withDefaults(defineProps<MTableType>(), {
  id: "default-table",
  rowKey: "id",
  requestAuto: true,
  expandAuto: true,

  structure: () => [],
  showPagination: true,
  showToolButton: true,
  embeddedToolButton: false,
  showExpandAll: true,
  showSelectAll: false,
  showSummary: false,
  showTableIndex: true,
  showOverflowTooltip: true,
  display: false,
  operationSize: 3,
  exOptions: () => ({}),
  exDependent: () => ({
    requestFunction: {},
    disabledRule: {},
    submitRule: {},
    inputParser: {},
    inputFormatter: {},
    targetTag: {},
    fileData: {}
  }),
  exPagination: () => ({
    pageNum: 1,
    pageSize: 20,
    pageSizes: [20, 50, 100, 150]
  }),
  summaryConfig: () => ({
    sumText: "合计",
    unitText: ""
  })
});

const emits = defineEmits(["selectRowBack", "selectRowAllBack", "expandRowBack", "expandRowAllBack"]);

const tableRef = ref<InstanceType<typeof ElTable>>();
const useRelData = ref(false);
const colRef = ref();
const seniorRef = ref();
const initialization = ref(0);
const exDisabled = ref({} as Obj);
const exDisplay = ref({} as Obj);
const exRole: Ref<exRoleType> = ref({});
const exFunction = ref({} as Obj);
const exFormatter = ref({} as Obj);
const exParser = ref({} as Obj);
const exTargetTag = ref({} as Obj);
const exFileData = ref({} as Obj);
const useFooterCenter = ref(false);
const useScrollTop = ref(false);

// _Message 选项方法
const {
  isTableSelectAll,
  selectedListIds,
  selectedList,
  setTableSelected,
  handleChangeChecked,
  handleRadioChecked,
  handleChangeBack,
  handleCellClick,
  getSelectAllOrCancel,
  handleSelectAllOrCancel,
  cleanSelectAllOrCancel,
  handleCellClickAll,
  setSelectedList
} = useSelection(tableRef, props.rowKey, emits, props.filterSelectRow);

// _Message 下拉外置数据方法
const {
  expandRowKeys,
  expandRowVisible,
  empowerWidth,
  empowerBodyWidth,
  setExpandRowKey,
  setChildrenRowKey,
  setExpandRowKeysAll,
  setChildrenRowKeysAll,
  initExpandRowKeys,
  setExpandBody,
  initChildrenRowKeys
} = useExpand(props.id, tableRef, emits, props.rowKey, props.expandAuto);

// _Message useTable 主表方法
const {
  tableData,
  flatTableData,
  pageable,
  searchParam,
  // searchInitParam,
  // totalParam
  tableQuery,
  tableLoad,
  useSelectionTable,
  orderProp,
  tableGlobalZoom,

  enumMap,

  initColumns,
  createObserver,
  tableColumns,
  settingColumns,
  searchColumns,

  // flatColumns

  isShowSearch,
  isSelectionColumn,
  isExpand,
  isChildren,

  getTableList,

  getSubmitTableList,

  setTableList,
  setTableRow,
  setListState,
  setExOptionEnumMap,

  searchAction,
  searchReset,

  handleSizeChange,
  handleCurrentChange,

  reSizeWidth,

  handleSortChange,

  handleCloseDrawer,
  handleColSetting,
  handleChangeDragEl,
  handleChangeDragSort,
  handleHeaderDragend,

  remoteMethod,
  onlineSelectChange,
  getSummaries,

  callbackColSetting,

  getGlobalConfig,
  setGlobalConfig,
  tableResize
} = useTable(
  tableRef,
  props.id,
  props.rowKey,
  props.requestApi,
  props.requestAuto,
  props.requestError,
  props.showPagination,
  props.showToolButton,
  exDisabled,
  exDisplay,
  exRole,
  exFunction,
  props.exPagination.pageNum,
  props.exPagination.pageSize,
  props.exPagination.pageSizes,
  useScrollTop,
  setTableSelected,
  getSelectAllOrCancel,
  initExpandRowKeys,
  setExpandBody,
  initChildrenRowKeys,
  props.summaryConfig,
  props.summaryFunction
);

// _Message 字典方法
const { seniorFilterOptions, seniorFilterData, openSeniorFilter, setConditionalType, setRelationshipGroupLinkType } =
  useDictionary();

// _Message 源对象方法
const { clearSelection, changeColSetting } = useRef(tableRef, colRef, cleanSelectAllOrCancel);

// _Message 过滤方法
const {
  handleSeniorSetting,
  handleQueryChange,
  handleAdvancedQueryChange,
  handleRemoveQuery,
  handleRemoveSeniorQuery,
  handleCleanAllQuery,
  handleCleanAllSeniorQuery
} = useFilter(tableQuery, enumMap, getTableList, settingColumns, callbackColSetting);

// _Computed
const Query = computed(handleQueryChange);
const AdvancedQuery = computed(handleAdvancedQueryChange);
const checkedSelectedIcon = computed(() => !props.filterSelectRow);
const globalState = useBaseStore();
const createSize: ComputedRef<"default" | "large" | "small"> = computed(() => {
  return globalState.getSize || "default";
});

// _Vue onBeforeMount
onBeforeMount(() => {
  if (inBrowser) {
    window.setManagerTableGlobalConfig = setGlobalConfig;
    window.getManagerTableGlobalConfig = getGlobalConfig;
  }

  const slots = useSlots();
  const slotKey = Object.keys(slots);
  const OldSlotKeys = [
    "tableHeader",
    "tableHeaderCenter",
    "tableHeaderRight",
    "toolButtonInline",
    "tableHeaderAll",
    "append",
    "empty",
    "expand",
    "pagination",
    "tableBottomLeft",
    "tableBottomCenter"
  ];
  const NewSlotKeys = [
    "HeaderLeft",
    "HeaderCenter",
    "ToolButton",
    "ToolButtonInline",
    "HeaderAfter",
    "BodyAppend",
    "Empty",
    "Expand",
    "Pagination",
    "FooterLeft",
    "FooterCenter"
  ];
  useFooterCenter.value = slotKey.indexOf("FooterCenter") > -1;
  for (let index = 0; index < slotKey.length; index++) {
    const element = slotKey[index];
    if (OldSlotKeys.indexOf(element) > -1) {
      window.log.error(`存在错误的命名插槽，请更新 ${OldSlotKeys[index]} 为 ${NewSlotKeys[index]}`);
    }
  }
});

// _Expose
defineExpose({
  element: tableRef,
  getTableList,
  setTableList,
  setTableRow,
  setListState,
  setSelectedList,
  clearSelection,
  handleSelectAllOrCancel,
  getSelectAllOrCancel,
  searchReset,
  getSubmitTableList,

  setExpandRowKey,
  setExpandRowKeysAll,

  getGlobalConfig,
  setGlobalConfig,

  reSizeWidth,
  onlineSelectChange,

  tableData,
  flatTableData,
  searchParam,
  tableQuery,
  pageable,
  enumMap,
  selectedList,
  selectedListIds,
  isTableSelectAll
});

// _Watch exOptions
watch(
  () => props.exOptions,
  data => {
    for (const key in data) {
      const opts = data[key];
      if (Array.isArray(opts)) {
        const tagsStore: any = useTagsStore();
        for (let index = 0; index < opts.length; index++) {
          const element: any = opts[index];
          if (!element.tagStyle) element.tagStyle = { bgColor: "#00aa90", color: "#fff" };
          if (tagsStore) {
            const color = tagsStore.getTagMaps(props.id, key, element.value) || element.tagStyle?.bgColor || "";
            element.tagStyle.bgColor = color;
          }
        }
      }
    }
    setExOptionEnumMap(data);
  },
  { deep: true, immediate: true }
);

// _Watch structure
function setConfig(data) {
  if (data && data.length) {
    initColumns(data);
  }
  if (tableColumns.value.length == 0) {
    initialization.value = -1;
  } else {
    initialization.value = 1;
  }
}
watch(() => props.structure, setConfig, { immediate: true });

// _Watch exDependent
watch(
  () => props.exDependent,
  data => {
    if (data.requestFunction) exFunction.value = data.requestFunction;
    if (data.disabledRule) exDisabled.value = data.disabledRule;
    if (data.displayRule) exDisplay.value = data.displayRule;
    if (data.submitRule) exRole.value = data.submitRule;
    if (data.inputParser) exParser.value = data.inputParser;
    if (data.inputFormatter) exFormatter.value = data.inputFormatter;
    if (data.targetTag) exTargetTag.value = data.targetTag;
    if (data.fileData) exFileData.value = data.fileData;
  },
  { deep: true, immediate: true }
);

/**
// 🙅‍♀️ 不需要打印可以把以下方法删除，打印功能目前存在很多 bug（目前数据处理比较复杂 209-246 行）
// 处理打印数据（把后台返回的值根据 enum 做转换）
const printData = computed(() => {
  const printDataList = JSON.parse(JSON.stringify(selectedList.value.length ? selectedList.value : tableData.value));
  // 找出需要转换数据的列（有 enum || 多级 prop && 需要根据 enum 格式化）
  const needTransformCol = flatColumns.value!.filter(
    item => (item.enum || (item.prop && item.prop.split(".").length > 1)) && item.isFilterEnum
  );
  needTransformCol.forEach(colItem => {
    printDataList.forEach((tableItem: { [key: string]: any }) => {
      tableItem[handleProp(colItem.prop!)] =
        colItem.prop!.split(".").length > 1 && !colItem.enum
          ? formatValue(handleRowAccordingToProp(tableItem, colItem.prop!))
          : filterEnum(handleRowAccordingToProp(tableItem, colItem.prop!), enumMap.value.get(colItem.prop!), colItem.fieldNames);
      for (const key in tableItem) {
        if (tableItem[key] === null) tableItem[key] = formatValue(tableItem[key]);
      }
    });
  });
  return printDataList;
});

打印表格数据（💥 多级表头数据打印时，只能扁平化成一维数组，printJs 不支持多级表头打印）
const handlePrint = () => {
  const header = `<div style="text-align: center"><h2>${props.title}</h2></div>`;
  const gridHeaderStyle = "border: 1px solid #ebeef5;height: 45px;color: #232425;text-align: center;background-color: #fafafa;";
  const gridStyle = "border: 1px solid #ebeef5;height: 40px;color: #494b4e;text-align: center";
  printJS({
    printable: printData.value,
    header: props.title && header,
    properties: flatColumns
      .value!.filter(item => !["selection", "index", "expand"].includes(item.type!) && item.isShow && item.prop !== "operation")
      .map((item: ColumnProps) => ({ field: handleProp(item.prop!), displayName: item.label })),
    type: "json",
    gridHeaderStyle,
    gridStyle
  });
};
**/

// watch(
//   () => tableColumns.value,
//   (data) => {
//     tableRef?.value?.doLayout();
//   },
//   { immediate: true, deep: true }
// );
</script>

<style lang="scss">
@import "../../styles/flex.scss";
@import "../../styles/mp.scss";
@import "./styles/index.scss";
.title-error {
  padding: 10px;
  font-size: 14px;
  color: var(--el-color-info);
  text-align: center;
}
.m-table-radio {
  width: 18px;
  height: 18px;
  border: 1px solid var(--el-border-color);
  border-radius: 50%;
}
.m-table-radio_action {
  position: relative;
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 14px;
    height: 14px;
    content: "";
    background-color: var(--el-color-primary);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}
.un-use-tooltip {
  .body_cell_text {
    white-space: break-spaces;
  }
}
</style>
