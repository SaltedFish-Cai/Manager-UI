# Table 表格

`m-table` 能够快速搭建你需要的表格，只需简单的配置即可创建一个带有 `筛选/搜索/排序/分页` 等功能的完善表格，当然你还可以使用 `插槽` 功能扩展使你的表格更加强大！

## 基础使用

最简单的使用方式，只需要配置 `columns` 即表格的结构配置，并添加数据来源 `request-api` 即可完成表格的创建，如果表格数据中存根据 `选项（select）` 获取展示的值，还需配置 `ex-options` 来匹配选项的值。
点击表格右上角 `工具图标按钮`，即可打开表格的筛选配置，在这里你可以对每一个列进行 `筛选/选择/左右固定/是否展示列` 的处理。
点击表格右上角 `刷新图标按钮`，即可单独再次获取当前已经筛选后的表数据，数据来源会再次请求 `request-api` 所提供的接口。
通过 `ref` 可以获取到表格实例，然后带去表格内值的方法，如刷新页面。获取数据等功能

<demo src="./base.vue"></demo>

## 选择功能（Selection / Radio）

在使用带有多选的表格时，必须选择填写 `row-key` 其值为返回对象数组中对象的 `唯一` 键值，并且在表格配置中添加 `selection / radio` 一行以打开表的选择列。 \*如果 `row-key` 出现非唯一时，可能出现勾选内容和实际内容 `错误/偏差/无法勾选` 等情况！
`获取选中值` 可以通过 `ref` 获取实例，然后获取实例中 `selectedList` 字段，数据包含单条数据的完整内容。

### 多选（Selection）

```typescript
const tableConfig: mTableStructureType[] = [
  { type: "selection" }, // [!code warning]
  ...
];
```

<demo src="./select.vue"></demo>

### 单选（Radio）

```typescript
const tableConfig: mTableStructureType[] = [
  { type: "radio" }, // [!code warning]
  ...
];
```

<demo src="./radio.vue"></demo>

## 额外展示（Expand）

在表格配置中添加 `expand` 一行以打开表的展开按钮，在表格内添加插槽 `expand` 以展示展开内容，可使用 [setExpandRowKey](/document/component/m-table/readme.html#exposes-暴露) 设置单行展开状态

```typescript
const tableConfig: mTableStructureType[] = [
  { type: "expand" }, // [!code warning]
  ...
];
```

<demo src="./expand.vue"></demo>

## 子数据（Children）

在使用带有子数据的表格时，必须选择填写 `row-key` 其值为返回对象数组中对象的 `唯一` 键值，并且在表格配置中添加 `row` 一行以打开表的展开列。
列表渲染表格时，当表格数据中出现 `children` 切其值为 `数组` 类型则回被视为子数据。 \*如果 `row-key` 出现非唯一时，可能出现勾选内容和实际内容 `错误/偏差/无法展开` 等情况！

:::danger
`children` 作为关键字，不可作为自定义对象使用，其值必须与同级结构相同。
:::

```typescript
const tableConfig: mTableStructureType[] = [
  { type: "row" }, // [!code warning]
  ...
];

async function getTableList(params: any) {
  // 返回数据中 必须含有 children
  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: "1", children: [{ Text: "Text-3221cars", Select: "1" }] },
        { Text: "Text-d2i23411", Select: "2", children: [{ Text: "Text-d2fda234", Select: "1" }] }
      ]
    },
    Code: 200
  };
}
```

<demo src="./children.vue"></demo>

## 单元格（Cell）

只需在配置中设置 `cellConfig` 即可使用 `Cell元素` 作为表格内容展示。通过 `getSubmitTableList` 获取表格内填写的内容。

```typescript
const tableConfig: mTableStructureType[] = [
  { label: "Cell-Input", prop: "Input", cellConfig: { type: "input" } },
  { label: "Cell-Select", prop: "Select", cellConfig: { type: "select" } },
  ...
];
```

<demo src="./case-cell.vue"></demo>

## 单元格的校验（Cell Submit）

在使用 `getSubmitTableList` 时，同 'm-form' 相同内部会进行数据校验，默认情况下每个单元格都是 `必填项` ，可以通过配置修改，也可以通过 `exDependent.submitRule` 对其就行独立的校验。

```typescript
const tableConfig: mTableStructureType[] = [
  { label: "Cell-Input", prop: "Input", cellConfig: { type: "input" } },
  { label: "Cell-Input1", prop: "Input1", cellConfig: { type: "input" } },
  { label: "Cell-Input2", prop: "Input2", cellConfig: { type: "input" } },
  { label: "Cell-Input3", prop: "Input3", cellConfig: { type: "input", required: false } },
  { label: "Cell-Input4", prop: "Input4", cellConfig: { type: "input", display: true } }
];

const exDependent = {
  submitRule: {
    Input1: {
      roleFn: data => data.Input1 >= 99,
      errorMessage: "Input值必须大于99"
    },
    Input2: {
      roleFn: Input2roleFn
    }
  }
};

function Input2roleFn(data) {
  if (data.Input2 == 1) return "不可为1";
  if (data.Input2 == 2) return "不可为2";
  if (data.Input2 != 3) return "填写1-3";
  return true;
}
```

<demo src="./case-cell-submit.vue"></demo>

## 标记（Tag）

使用 [useDictionaries](/document/component/md/dictionaries.html#获取字典选项-usedictionaries) 获取字典结果更快捷。

```typescript
const tableConfig: mTableStructureType[] = [
  { label: "Cell-Text", prop: "Text" },
  { label: "Cell-Input", prop: "Select", cellConfig: { type: "tag" } }, // [!code warning]
  { label: "操作", prop: "operation" }
];

const exOptions = ref({});
nextTick(async () => {
  const Select: mTagOptionType[] = await useDictionaries("table", ["Dealer"]);
  const bgColor = ["#33b698", "#409eff"]; // [!code warning]
  for (let index = 0; index < Select.length; index++) {
    Select[index].tagStyle = { bgColor: bgColor[index], textColor: "#fff" }; // [!code warning]
  }
  exOptions.value = { Select };
});
```

<demo src="./case-tag.vue"></demo>

## 外部依赖（ExDependent）

```html
<m-table
  :ex-options="exOptions"
  :showToolButton="state.showToolButton"
  :showPagination="state.showPagination"
  :showSelectAll="state.showSelectAll"
  :showSummary="state.showSummary"
  :embeddedToolButton="state.embeddedToolButton"
  :exDependent="exDependent"
  :exPagination="exPagination"
>
</m-table>
```

<demo src="./case-options.vue"></demo>

## 插槽（Slots）

```html
<m-table ref="proTable" :structure="tableConfig" :request-api="getTableList">
  <template #HeaderLeft>>HeaderLeft Slot</template>
  ...
</m-table>
```

| 字段             | 描述                                             |
| ---------------- | ------------------------------------------------ |
| HeaderLeft       | 表头左侧区域                                     |
| HeaderCenter     | 表头中间区域                                     |
| ToolButton       | 表头右侧按钮工具区域，替换（搜索按钮/筛选配置）  |
| ToolButtonInline | 表头右侧按钮工具区域内部元素左侧                 |
| HeaderAfter      | 表头下方区域                                     |
| BodyAppend       | 表格之后区域                                     |
| Empty            | 表格无数据时，展示区域                           |
| Expand           | 用于 expand 模式下展示元素（需配合 config 配置） |
| Pagination       | 表格分页组件区域，替换（默认分页组件）           |
| FooterLeft       | 表底左侧区域                                     |
| FooterCenter     | 表底中间区域                                     |

<demo src="./case-slots.vue"></demo>


## 全局配置（GlobalConfig）

组件会在当前 vue 实例中添加 `setManagerTableGlobalConfig` 方法，调用次方法即可修改全局配置

<demo src="./set-config.vue"></demo>

## Api

### 结构（mTableStructureType） 

```typescript
const tableConfig: mTableStructureType[] = [
  { label: "Label-Text", prop: "Text" },
  ...
];
```

| 字段       | 类型                                                                                                                                                                                | 必填 | 描述                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------- |
| label      | string                                                                                                                                                                              | ✅    | 表头展示                                                         |
| prop       | string                                                                                                                                                                              | ✅    | 表头 prop 表 key 字段                                            |
| width      | string / number                                                                                                                                                                     | ❌    | 表列列宽                                                         |
| isShow     | boolean                                                                                                                                                                             | ❌    | 是否显示在表格当中                                               |
| useSort    | boolean                                                                                                                                                                             | ❌    | 是否使用排序                                                     |
| useFilter  | boolean                                                                                                                                                                             | ❌    | 是否使用筛选                                                     |
| fixed      | boolean / left / right                                                                                                                                                              | ❌    | 表列固定位置                                                     |
| search     | `SearchProps`                                                                                                                                                                       | ❌    | 顶部搜索配置 (暂未开放使用)                                      |
| filterType | "input" / "select" / "time"                                                                                                                                                         | ❌    | 筛选时使用类型                                                   |
| cellConfig | [BaseCellItemType](/document/component/m-table/readme.html#basecellitemtype-基础类型)  &  [CellItemType](/document/component/m-table/readme.html#cellitemtype-单元格类型) | ❌    | 单元格使用类型，详细配置                                         |
| textWarp   | string                                                                                                                                                                              | ❌    | 单元格内文字折行依据                                             |
| requestBy  | string / string[]                                                                                                                                                                   | ❌    | `type=='online-select' / type=='request-select'`请求数据依赖来源 |
| useSum     | boolean                                                                                                                                                                             | ❌    | 是否计入合计内容                                                 |

`BaseCellItemType` 基础类型

| 字段     | 类型    | 必填 | 默认值 | 描述     |
| -------- | ------- | ---- | ------ | -------- |
| required | boolean | ❌    | true   | 校验规则 |

`CellItemType` 单元格类型

| 单元格类型                                                                                                             | 描述               |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------ |
| [MElementInputType](/document/component/m-element/readme.html#输入框-melementinputtype)                           | 输入框             |
| [MElementNumberType](/document/component/m-element/readme.html#数字输入框-melementnumbertype)                     | 数字输入框         |
| [MElementSelectType](/document/component/m-element/readme.html#选择器-melementselecttype)                         | 选择器             |
| [MElementRequestSelectType](/document/component/m-element/readme.html#远端请求选择器-melementrequestselecttype)   | 远端请求选择器     |
| [MElementOnlineSelectType](/document/component/m-element/readme.html#远端搜索请求选择器-melementonlineselecttype) | 远端搜索请求选择器 |
| [MElementCascaderType](/document/component/m-element/readme.html#联级选择器-melementcascadertype)                 | 联级选择器         |
| [MElementCheckBoxType](/document/component/m-element/readme.html#多选-melementcheckboxtype)                       | 多选               |
| [MElementRadioType](/document/component/m-element/readme.html#单选-melementradiotype)                             | 单选               |
| [MElementIconType](/document/component/m-element/readme.html#icon选择-melementicontype)                           | icon 选择          |
| [MElementSwitchType](/document/component/m-element/readme.html#开关-melementswitchtype)                           | 开关               |
| [MElementDateType](/document/component/m-element/readme.html#时间选择器-melementdatetype)                         | 时间选择器         |

### Attribute 属性

| 字段                | 是否必填 | 类型                                                                                           | 默认值 | 描述                                                      |
| ------------------- | -------- | ---------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------- |
| id                  | ✅        | string                                                                                         |        | 表格 id，同页面存在多个表格时填写，否则会导致表格推拽失效 |
| structure           | ✅        | [mTableStructureType[]](/document/component/m-table/readme.html#mtablestructuretype-结构) |        | 表格列配置项                                              |
| requestApi          | ✅        | (params, id) => object[]                                                                       |        | 表格数据来源接口                                          |
| requestAuto         | ❌        | boolean                                                                                        | true   | 是否自动执行请求                                          |
| requestError        | ❌        | (params) => void                                                                               |        | 表格 api 请求错误监听                                     |
| exportApi           | ❌        | (params) => object[]                                                                           |        | 页面导出按钮触发方法                                      |
| filterSelectRow     | ❌        | (params) => object[]                                                                           |        | 筛选 `选择表状态下` 可选择数据                            |
| flat                | ❌        | boolean                                                                                        | false  | 扁平页面                                                  |
| rowKey              | ❌        | string                                                                                         |        | 当表格数据多选时，所指定的 `key` 需要保持数据 `唯一`      |
| showToolButton      | ❌        | boolean                                                                                        | true   | 是否显示表格 `刷新 / 筛选` 功能                           |
| showPagination      | ❌        | boolean                                                                                        | true   | 是否显示分页功能                                          |
| showExpandAll       | ❌        | boolean                                                                                        | true   | 是否显示展开全部按钮                                      |
| showSelectAll       | ❌        | boolean                                                                                        | false  | 显示 `一键全选` 按钮                                      |
| showSummary         | ❌        | boolean                                                                                        | false  | 是否显示尾部合集行                                        |
| showTableIndex      | ❌        | boolean                                                                                        | false  | 是否显示表格序号                                          |
| showOverflowTooltip | ❌        | boolean                                                                                        | true   | 是否使用文字超出后Tooltip提示完整内容                     |
| embeddedToolButton  | ❌        | boolean                                                                                        | false  | 是否显示表格功能按钮嵌入式样式                            |
| exOptions           | ❌        | object                                                                                         |        | 外置筛选依赖                                              |
| exDependent         | ❌        | [ExDependentType](/document/component/m-table/readme.html#exdependenttype-外置依赖)       |        | 外置依赖                                                  |
| exPagination        | ❌        | [ExPaginationType](/document/component/m-table/readme.html#expaginationtype-外置页码配置) |        | 外置依赖                                                  |
| expandAuto          | ❌        | boolean                                                                                        | false  | 是否默认打开expand折叠                                    |
| operationSize       | ❌        | number                                                                                         | 3      | 操作内元素最大显示数量，超出放置到更多按钮                |
| summaryConfig       | ❌        | sumText?: string;  合计文字 unitText?: string; // 单位文字                                     |        | 自定义合计参数                                            |
| summaryFunction     | ❌        | (params: any) => string[]                                                                      |        | 自定义合计方法                                            |

`ExDependentType` 外置依赖

| 字段            | 是否必填 | 类型   | 描述                                                           |
| --------------- | -------- | ------ | -------------------------------------------------------------- |
| requestFunction | ❌        | object | `cellConfig.type==online-select / request-select` 传入请求方法 |
| disabledRule    | ❌        | object | 禁用规则                                                       |
| submitRule      | ❌        | object | `getSubmitTableList` 运行时可自定义规则                        |
| inputParser     | ❌        | object | `cellConfig.type==input / textarea` 格式化器输入中提取的值     |
| inputFormatter  | ❌        | object | `cellConfig.type==input / textarea` 指定输入值的格式           |

`ExPaginationType` 外置页码配置

| 字段       | 是否必填 | 默认值                                  | 类型     | 描述         |
| ---------- | -------- | --------------------------------------- | -------- | ------------ |
| pageNum    | ❌        | 1                                       | number   | 当前页数     |
| pageSize   | ❌        | 20                                      | number   | 每页条数     |
| pageSizes  | ❌        | [20, 50, 100, 150]                      | number[] | 条数选择范围 |
| layout     | ❌        | total, sizes, prev, pager, next, jumper | string   | 页码功能范围 |
| pagerCount | ❌        | 5                                       | number   | 页数拆分数量 |

### Events 事件

| 字段             | 类型     | 回调                     | 描述                       |
| ---------------- | -------- | ------------------------ | -------------------------- |
| selectRowBack    | function | ({row, selected})=>{}    | 多选框点击回调             |
| selectRowAllBack | function | ({value, selection})=>{} | 多选框全选点击回调         |
| expandRowBack    | function | ({ index, row })=>{}     | Expand展开按钮点击回调     |
| expandRowAllBack | function | (data)=>{}               | Expand展开全部按钮点击回调 |


### Exposes 暴露

```typescript
const proTable = ref();
async function RefreshTable() {
  await proTable.value.getTableList(); // [!code warning]
}
```

| 方法名称             | 请求参数                        | 描述                                                                                             |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| getTableList         | null                            | 获取表数据，调用 request-api 提供的方法                                                          |
| setTableList         | table 数据                      | 手动设置表格数据绕过 request-api                                                                 |
| setListState         | list / key / tableKey（非必填） | 设置表格单行数据状态（数据标红）`list` 标记数据数组 / `key` 标记数据键值 / `tableKey` 表格据键值 |
| setSelectedList      | rowKeyList                      | 设置选中的数据                                                                                   |
| clearSelection       | null                            | 清除表格已勾选的数据                                                                             |
| getSelectAllOrCancel | null                            | 获取全部选中数据（含分页情况下，需传递 `isShowSelectAll`）                                       |
| searchReset          | null                            | 重置表格外置搜索数据（需传递 `isShowSearch`）                                                    |
| getSubmitTableList   | null                            | 校验表格数据并获取数据（配置中存在 `cellConfig` 元素）                                           |
| setExpandRowKey      | index, row, state（非必填）     | 打开单行折叠                                                                                     |
| setExpandRowKeysAll  | state（非必填）                 | 打开全部折叠                                                                                     |

```typescript
const proTable = ref();
const TableData = proTable.value.tableData;
```

| 对象名称        | 描述                                                |
| --------------- | --------------------------------------------------- |
| tableData       | 获取表格数据                                        |
| flatTableData   | 获取扁平化表格数据（提取 children 至外层）          |
| searchParam     | 获取表格外置搜索筛选数据（（需传递 `isShowSearch`） |
| pageable        | 获取分页数据                                        |
| enumMap         | 获取枚举                                            |
| isSelected      | 获取表格状态（是否已经有勾选数据）                  |
| selectedList    | 获取表格选中数据                                    |
| selectedListIds | 获取表格选中数据 Id（即 `row-key` 对应的字段值）    |

## `SearchProps` 顶部搜索配置（暂未使用）

| 字段         | 类型                              | 描述                                                                   |
| ------------ | --------------------------------- | ---------------------------------------------------------------------- |
| el           | `SearchType`                      | 当前项搜索框的类型                                                     |
| order        | number                            | 搜索项排序（从大到小）                                                 |
| span         | number                            | 搜索项所占用的列数，默认为 1 列                                        |
| offset       | number                            | 搜索字段左侧偏移列数                                                   |
| props        | any                               | 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件 |
| defaultValue | string / number / boolean / any[] | 搜索字段左侧偏移列数                                                   |

## `SearchType` 当前项搜索框的类型（暂未使用）

| 字段         | 描述       |
| ------------ | ---------- |
| input        | 输入框     |
| input-number | 数字输入框 |
| select       | 选择器     |
| tree-select  | 树形选择器 |
| cascader     | 级联选择器 |
| date-picker  | 日期选择器 |
| time-select  | 时间选择器 |
| switch       | 开关       |
| slider       | 滑块       |
