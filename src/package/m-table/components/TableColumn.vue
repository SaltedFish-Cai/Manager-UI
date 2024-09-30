<template>
  <RenderTableColumn v-bind="props.column" />
</template>

<script lang="tsx" setup name="TableColumn">
// _Import
import { inject, ref, useSlots, watch, h } from "vue";
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp, useClipboard } from "../utils";
import { useBaseStore } from "../hooks/store";
import Filter from "./TableColumnFilter.vue";
import MTag from "@/package/m-elements/tag/index.vue";

import { Obj } from "@/package/global";
import { TableColumnPropsType, ColumnProps } from "../type";

// _Var
const props = defineProps<TableColumnPropsType>();

const emits = defineEmits(["handleSortChange", "saveAndFilter", "handleCellClick", "handleRemoveQuery", "openSeniorFilter"]);

const slots = useSlots();
const enumMap = inject("enumMap", ref(new Map()));
let filterData = [] as Obj[];
const SYSTEM: "bbraun" | "cms" | "dealer" = import.meta.env.VITE_APP_DOMAIN_SYSTEM;
const orderString = ref(null as "ascending" | "descending" | null);
const filterValue = ref({} as Obj);
const columnFilter = ref();
const globalStore = useBaseStore();

let justClick = false;

// _Function 渲染单元格内数据
function renderCellData(item: ColumnProps, scope: { [key: string]: any }) {
  let data;
  if (enumMap.value.get(item.prop) && item.filterType == "select") {
    data = filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop)!, item.fieldNames);
  } else {
    data = formatValue(handleRowAccordingToProp(scope.row, item.prop!));
  }
  // const data =
  //   enumMap.value.get(item.prop) && item.filterType == "select"
  //     ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop)!, item.fieldNames)
  //     : formatValue(handleRowAccordingToProp(scope.row, item.prop!));
  if (item?.filterType == "number") {
    return data?.toLocaleString("en-US");
  } else if (item.textWarp) {
    return data.split(item.textWarp)?.map(item => {
      return <div>{item}</div>;
    });
  } else {
    return data;
  }
}

// _Function 获取 tag 类型
// const getTagType = (item: ColumnProps, scope: { [key: string]: any }) => {
//   return filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop), item.fieldNames, "tag");
// };

// _Function 设置单行数据状态
function getItemState(state: Obj) {
  if (state.tableState == "error") {
    return "color:var(--el-color-danger);font-weight:bold;";
  }
  return "";
}

// _Function 点击表格排序
function handleTableOrder(state: Obj) {
  switch (orderString.value) {
    case null:
      orderString.value = "ascending";
      break;
    case "ascending":
      orderString.value = "descending";
      break;
    default:
      orderString.value = null;
      break;
  }
  const upData = { prop: state.prop, order: orderString.value };
  emits("handleSortChange", upData);
}

// _Function 提交筛选
function saveAndFilter(data) {
  const prop = props.column.prop;
  let _filterData = filterData?.filter(item => item.fieldName != prop);
  _filterData = [..._filterData, ...data];
  emits("saveAndFilter", { Filter: _filterData });
}

// _Function 点击行(鼠标移动时不选中,防止推拽文字时会误触行数据)
function mouseMove() {
  justClick = false;
}
function mouseDown() {
  justClick = true;
}
function handleCellClick(scope, e) {
  if (!justClick) return;
  emits("handleCellClick", scope.row, scope.column, e.target);
}

// _Function 删除筛选框数据时,同步删除相关数据
function handleRemoveQuery(scope) {
  emits("handleRemoveQuery", scope, "column");
}

// _Function 打开高级搜索
function openSeniorFilter(item: Obj) {
  columnFilter.value?.setListenClick("clean");
  emits("openSeniorFilter", item);
}

// _Function 设置筛选打开icon的颜色状态
function setIconAction(prop) {
  const { AdvancedFilter } = props.tableQuery;
  const index = AdvancedFilter.findIndex(item => item.fieldName == prop);
  if (index > -1) {
    return true;
  } else {
    return filterValue.value?.fieldName == prop && String(filterValue.value.fieldValue)?.length;
  }
}

// _Function 一键复制文本
function copyText(e) {
  if (globalStore.isTableTextCopy && e.target.className.indexOf("body_cell_text-rel") > -1) {
    useClipboard(e.target.innerText, e);
  }
}

// _Function 点击标签
function targetTag(item, value, row, options) {
  if (!props.exTargetTag || !props.exTargetTag[item.prop]) return;
  props.exTargetTag[item.prop]({ item, value, row, options });
}

// _Function 设置标签元素
function setTag(tagItem, value, row, exOptions) {
  const item = { ...tagItem.cellConfig, prop: tagItem.prop };
  if (value != null && value != undefined) {
    if (Array.isArray(value)) {
      return (
        <>
          {value.map(data => (
            <div class="inline-block">
              <MTag
                item={item}
                data={data}
                size={props.size}
                exOptions={exOptions}
                useTagsClick={!!props.exTargetTag[tagItem.prop]}
                onClick={() => targetTag(tagItem, data, row, exOptions)}
              />
            </div>
          ))}
        </>
      );
    } else {
      return (
        <div class="inline-block">
          <MTag
            item={item}
            data={value}
            size={props.size}
            exOptions={exOptions}
            useTagsClick={!!props.exTargetTag[tagItem.prop]}
            onClick={() => targetTag(tagItem, value, row, exOptions)}
          />
        </div>
      );
    }
  }
}

// _Function 设置操作列  是否使用更多按钮
// let ctx;
function setOperationsBack(arrData) {
  return;
  const arrayChild = arrData?.[0].children;

  if (arrayChild && arrayChild.length) {
    const _arrayChild: any = [];
    function findChild(arrayChild, childEl?: boolean) {
      for (let index = 0; index < arrayChild.length; index++) {
        const element = arrayChild[index];
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log("++++++++++> arrData:", arrData);
        console.log("++++++++++> element:", element);

        const { ctx, props, type } = element;
        if (type?.props && type?.render) {
          // 开发模式
          if (childEl) {
            _arrayChild.push(element);
          } else {
            const setup = type.setup(type.props, ctx.setupContext);
            console.log("++++++++++> setup:", setup);
            const componentChild = type?.render(ctx, {}, props, setup)?.children || [];
            if (componentChild.length) {
              console.log("++++++++++> componentChild:", componentChild);
              for (let index = 0; index < componentChild.length; index++) {
                if (element?.children?.default) componentChild[index].ctx = element.ctx;
              }
              findChild(componentChild, true);
            }
          }
        }
        //  else if (type?.props) {
        //   // 正式模式
        //   console.log(" ");
        //   console.log(" ");
        //   console.log(" ");
        //   console.log(" ");
        //   console.log("++++++++++> props:", props);
        //   console.log("++++++++++> type:", type);
        //   const render = type.setup(props, {
        //     expose: () => {
        //       //
        //     }
        //   });
        //   console.log(" ");
        //   console.log("++++++++++> render:", render);
        //   const componentChild = render(props, ctx)?.children || [];
        //   console.log("++++++++++> componentChild:", componentChild);
        //   if (componentChild.length) {
        //     for (let index = 0; index < componentChild.length; index++) {
        //       componentChild[index].ctx = element.ctx;
        //     }
        //     findChild(componentChild);
        //   }
        // }
        else if (String(element.type) != "Symbol(v-cmt)") {
          _arrayChild.push(element);
        } else if (String(element.type) == "Symbol(v-fgt)" && element.children?.length) {
          findChild(element.children);
        }
      }
    }
    findChild(arrayChild);
    console.log("++++++++++> _arrayChild:", _arrayChild);
    const baseArr: any = [];
    const otherArr: any = [];
    //  ------------------------------------------------------------
    if (_arrayChild.length > props.operationSize) {
      _arrayChild.map((data, index) => {
        if (index < props.operationSize - 1) {
          baseArr.push(data);
        } else {
          otherArr.push(data);
        }
      });

      return (
        <>
          {baseArr.map(data => {
            return h(data);
          })}
          {
            <el-popover placement="top" popper-class="m-table-more-opt">
              {{
                reference: () => {
                  return <m-button is="more">更多</m-button>;
                },
                default: () => {
                  return (
                    <>
                      {otherArr.map(data => {
                        return h(data);
                      })}
                    </>
                  );
                }
              }}
            </el-popover>
          }
        </>
      );
    } else {
      return (
        <>
          {_arrayChild?.map(data => {
            return h(data);
          })}
        </>
      );
    }
  } else {
    return <></>;
  }
}

function setOperations(arrData) {
  setOperationsBack(arrData);
  // const root = arrData?.[0];
  // console.log(" ");
  // console.log(" ");
  // console.log(" ");
  // console.log(" ");
  // console.log("++++++++++> root:", root);
  const arrayChild = arrData?.[0].children;
  if (arrayChild && arrayChild.length) {
    const _arrayChild: any = [];
    // console.log("++++++++++> arrayChild:", arrayChild);
    function findChild(arrayChild) {
      for (let index = 0; index < arrayChild.length; index++) {
        const element = arrayChild[index];
        // console.log(" ");
        // console.log(" ");
        // console.log("++++++++++> h element:", h(element));
        const { type, children } = element;
        const stringType = String(type);
        if (stringType.indexOf("Symbol") < 0 || stringType == "Symbol(v-txt)") {
          _arrayChild.push(element);
        } else if (stringType == "Symbol(v-fgt)" && children?.length) {
          for (let index = 0; index < children.length; index++) {
            const child = children[index];
            _arrayChild.push(child);
          }
        }
        // if (children?.default || String(type) == "Symbol(v-txt)") {
        //   _arrayChild.push(element);
        // } else if (String(type) == "Symbol(v-fgt)" && children?.length) {
        //   findChild(element.children);
        // }
        // else if (children == null) {
        //   const hEl = h(element);
        //   console.log("++++++++++> hEl:", hEl);
        //   // return <>{hEl}</>;
        //   // 开发模式
        //   const setup = type.setup(props, ctx?.setupContext);
        //   console.log("++++++++++> setup:", setup);
        //   const renderEnd = type?.render(root.ctx.setupContext, [], setup.props, setup);
        //   console.log("++++++++++> renderEnd:", renderEnd);
        //   return <>{renderEnd}</>;
        //   // console.log("++++++++++> renderEnd:", renderEnd);
        //   // const componentChild = renderEnd?.children || [];
        //   // if (componentChild.length) {
        //   //   if (rootElement) {
        //   //     console.log("++++++++++> element:", element);
        //   //     _arrayChild.push(element);
        //   //   } else {
        //   //     for (let index = 0; index < componentChild.length; index++) {
        //   //       componentChild[index].ctx = rootElement?.ctx || element.ctx;
        //   //     }
        //   //     console.log("++++++++++> componentChild:", componentChild);
        //   //     findChild(componentChild, element);
        //   //   }
        //   // }
        // }
      }
    }
    findChild(arrayChild);
    const baseArr: any = [];
    const otherArr: any = [];
    //  ------------------------------------------------------------
    if (_arrayChild.length > props.operationSize) {
      _arrayChild.map((data, index) => {
        if (index < props.operationSize - 1) {
          baseArr.push(data);
        } else {
          otherArr.push(data);
        }
      });

      return (
        <>
          {baseArr.map(data => {
            return h(data);
          })}
          {
            <el-popover placement="top" popper-class="m-table-more-opt">
              {{
                reference: () => {
                  return <m-button is="more">更多</m-button>;
                },
                default: () => {
                  return (
                    <>
                      {otherArr.map(data => {
                        return h(data);
                      })}
                    </>
                  );
                }
              }}
            </el-popover>
          }
        </>
      );
    } else {
      return (
        <>
          {_arrayChild?.map(data => {
            return h(data);
          })}
        </>
      );
    }
  } else {
    return <></>;
  }
}

// _Function 主方法
function RenderTableColumn(item: ColumnProps) {
  const filterType = item.filterType || "input";
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          width={item.width || "auto"}
          min-width="200px"
          align={item.align ?? "left"}
          showOverflowTooltip={
            (props.showOverflowTooltip || item.showOverflowTooltip) &&
            item.prop !== "operation" &&
            item.cellConfig?.type !== "tag"
          }
        >
          {{
            default: (scope: any) => {
              if (item.childrenColumn) return item.childrenColumn.map(child => RenderTableColumn(child));
              if (item.render) return item.render(scope);
              if (slots[handleProp(item.prop!)]) {
                if (item.prop == "operation") {
                  if (slots["moreOperation"] && slots["moreOperation"]!(scope)?.[0]?.children?.length) {
                    return (
                      <div class="operation_item">
                        {slots[handleProp(item.prop!)]!(scope)}
                        <el-popover placement="top" popper-class="m-table-more-opt">
                          {{
                            reference: () => {
                              return <m-button is="more">更多</m-button>;
                            },
                            default: () => {
                              return <>{slots["moreOperation"]!(scope)}</>;
                            }
                          }}
                        </el-popover>
                      </div>
                    );
                  } else {
                    const operationArr = slots[handleProp("operation")]!(scope);
                    {
                      /* return <div class="operation_item">{slots[handleProp(item.prop!)]!(scope)}</div>; */
                    }
                    return <div class="operation_item">{setOperations(operationArr)}</div>;
                  }
                } else {
                  return slots[handleProp(item.prop!)]!(scope);
                }
              }
              {
                /* <m-tag :item="{ ...item.cellConfig, prop: item.prop }" :data="row" :exOptions="exOptions"></m-tag> */
              }
              {
                /* if (item.cellConfig?.type == "tag") return  <MTag item={tagItem} data={scope.row} exOptions={props.exOptions} />; */
              }
              if (item.cellConfig?.type == "tag" && item.prop)
                return setTag(item, scope.row[item.prop], scope.row, props.exOptions);
              return (
                <div
                  class="body_cell_text"
                  style={getItemState(scope.row)}
                  onMousemove={mouseMove}
                  onMousedown={mouseDown}
                  onMouseup={e => handleCellClick(scope, e)}
                >
                  <div
                    class={
                      "body_cell_text-rel find-class-" +
                      item.prop +
                      (globalStore.isTableTextCopy ? " body_cell_text-copy" : "") +
                      (item.textSpill ? " m-table-text-spill" : "")
                    }
                    onClick={copyText}
                  >
                    {renderCellData(item, scope)}
                  </div>
                </div>
              );
            },
            header: () => {
              if (item.headerRender) return item.headerRender(item);
              if (slots[`${handleProp(item.prop!)}Header`]) return slots[`${handleProp(item.prop!)}Header`]!({ row: item });
              return (
                <div class={item.prop ? "flex-center-between cell_header" : "flex-center cell_header"}>
                  <span class="no-click">
                    <span class="cell_text drag-el">{item?.label}</span> <span class="cell_text_after"></span>
                  </span>
                  {item.prop && (
                    <div class="flex-center-between flex1 cell_header_setting ">
                      {item.useSort != false ? (
                        <div
                          class={
                            props.orderProp == item.prop && orderString.value != null
                              ? "flex-col table-order-box order-box-act"
                              : "flex-col table-order-box"
                          }
                          onClick={() => {
                            handleTableOrder(item);
                          }}
                        >
                          <m-icon
                            class={
                              props.orderProp == item.prop && orderString.value == "ascending"
                                ? "order-icon flex-center order-act"
                                : "order-icon flex-center"
                            }
                            name="up_small_fill"
                          />
                          <m-icon
                            class={
                              props.orderProp == item.prop && orderString.value == "descending"
                                ? "order-icon flex-center order-act"
                                : "order-icon flex-center"
                            }
                            name="down_small"
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {item.useFilter != false ? (
                        <Filter
                          id={props.id}
                          ref={columnFilter}
                          item={item}
                          onSaveAndFilter={saveAndFilter}
                          data={filterValue.value}
                          exOptions={props.exOptions}
                          onHandleRemoveQuery={handleRemoveQuery}
                          onOpenSeniorFilter={openSeniorFilter}
                          size={props.size}
                        >
                          {{
                            default: () => {
                              return (
                                <div class={setIconAction(item.prop) ? "table-filter-box filter-box-act" : "table-filter-box"}>
                                  <m-icon
                                    class={
                                      setIconAction(item.prop) ? "filter-icon flex-center filter-act" : "filter-icon flex-center"
                                    }
                                    name="filter"
                                  />
                                </div>
                              );
                            },
                            exBtn: () => {
                              return (
                                (filterType == "input" || filterType == "number") &&
                                SYSTEM != "cms" && (
                                  <div class="flex-center">
                                    <m-button class="mt10" font="mortarboard_line" onClick={() => openSeniorFilter(item)} link>
                                      使用高级搜索
                                    </m-button>
                                  </div>
                                )
                              );
                            }
                          }}
                        </Filter>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          }}
        </el-table-column>
      )}
    </>
  );
}

// _Watch 排序
watch(
  () => props.orderProp,
  (value: string) => {
    if (props.column.prop != value && orderString.value != null) orderString.value = null;
  },
  { immediate: true }
);

// _Watch Filter值
watch(
  () => props.tableQuery.Filter,
  (value: Obj[]) => {
    filterData = value;
    const prop = props.column.prop;
    if (props.column?.filterType == "time") {
      const findItemArr = value?.filter(item => item.fieldName == prop);
      const arr = [] as string[];
      for (let index = 0; index < findItemArr.length; index++) {
        const item = findItemArr[index];
        arr[item.conditionalType == 3 ? 0 : 1] = item.fieldValue.split(" ")[0];
      }
      filterValue.value = {
        ...findItemArr[0],
        fieldValue: arr
      };
    } else {
      const findItem = value?.find(item => item.fieldName == prop);
      if (findItem && String(findItem.fieldValue)?.length) {
        filterValue.value = {
          ...findItem,
          fieldValue: props.column.filterType == "select" ? findItem.fieldValue.split(",") : findItem.fieldValue
        };
      } else {
        filterValue.value = {};
      }
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
%table-order-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.7em;
  height: 100%;
  padding: 2px 0;
  margin-left: 3px;
  transition: 0.3s;
  &:hover {
    background-color: var(--el-table-row-hover-bg-color) !important;
  }
  .order-icon {
    display: flex !important;
    width: 18px;
    height: 7px;
    font-size: 24px;
    color: var(--el-text-color-disabled);
  }
  .order-act {
    color: var(--el-color-primary);
  }
}
.order-box-act {
  // background-color: var(--el-color-primary-light-9);
}
.table-order-box {
  @extend %table-order-box;
}
.table-filter-box {
  @extend %table-order-box;
  .filter-icon {
    display: flex !important;
    width: 18px;
    height: 100%;
    font-size: 16px;
    color: var(--el-text-color-disabled);
  }
  .filter-act {
    color: var(--el-color-primary);
  }
}
.filter-box-act {
  // background-color: var(--el-color-primary-light-9);
}
.no-click {
  overflow: hidden;
  color: var(--el-text-color-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cell_header {
  width: 100%;
  height: 100%;
  .cell_header_setting {
    height: 100%;
  }
}
.el-tooltip__trigger:has(.table-filter-box) {
  height: 100%;
}
.body_cell_text {
  width: 99.5%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .body_cell_text-rel {
    display: inline;
  }
}
.body_cell_text-copy {
  &:hover {
    color: var(--el-color-primary);
    cursor: pointer;
  }
}
.m-table-text-spill {
  display: block !important;
  width: 100%;
  overflow: hidden;
  line-height: 1.5em;
  text-wrap: wrap;
  word-break: break-all;
  word-wrap: break-word;
}
.inline-block {
  display: inline-block;
}
// .inline-block + .inline-block {
//   padding-left: 0 !important;
// }
</style>
