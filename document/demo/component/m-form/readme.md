# Form 表单

`m-form` 能够快速搭建你需要的表单，只需简单的配置即可创建一个带有 `校验/组合/拆分` 等功能的完善表单，当然你还可以使用 `插槽` 功能扩展使你的表单更加强大！

## 基础使用

最简单的使用方式，只需要配置 `config` 即表单的结构配置，即可完成表单的创建，如果表单数据中存根据 `选项（select）` 获取展示的值，还需配置 `ex-options` 来匹配选项的值，你还可以在配置中设置 `rules` 规则项，给单独一个字端设置校验规则。

通过 `ref` 可以获取到表单实例，调用 `submitForm` 即可完成表单的校验。

<demo src="./base.vue"></demo>

## 组件展示

常用组件的展示和配置演示，你可以使用 `useRequired` 字端来给整个表单去除校验功能。

<demo src="./show.vue"></demo>

## 归档

如果你想为你的表单内容进行归档，只需在 `config` 中添加 `groupName` 类即可完成页面归档展示。

```typescript
const formConfig: FormItemType[] = [
  {
    unitName: "groupName#1", // [!code warning]
    ...
  }
];
```

<demo src="./classify.vue"></demo>

## 默认值

你可以使用 `data` 传递默认值，默认值可以被多次修改，表单组件会坚挺默认值，但是同时也会初始化表单校验功能

:::tip
需要注意的是 `From 内部数据` 与 `传入的 data` 会进行双向绑定，修改内部值时，外部传入的值也会被修改，但不会触发表单检验，如需使用校验请使用 `submitForm` 。
:::

<demo src="./default-data.vue"></demo>

## Tab Form

高阶组件的展示和配置演示，在使用时需在 `config` 配置中添加字段 `tabsFormConfig` 其值为基础组件配置。
获取结果时，组件会对内容进行校验，当单个 Tab 页面出现 `错误`，组件会 `自动跳转` 至错误页，并提示错误内容.

```typescript
const tabsFormConfig: mFormStructureType[] = [
  { groupName: "Tab-groupName1", label: "Input1", prop: "Input1", type: "input" },
  ...
];

const formConfig: mFormStructureType[] = [
  { groupName: "高阶组件——标签", label: "标签组件", prop: "Tab1", type: "tabs-form", tabsFormConfig }
];
```

<demo src="./tab.vue"></demo>

## Group Form

高阶组件的展示和配置演示，在使用时需在 `config` 配置中添加字段 `groupFormConfig` 其值为基础组件配置。
`groupFormConfig` 内的元素，当 `prop` `相同`，返回时只会产生一个数据。

```typescript
const formConfig: mFormStructureType[] = [
  {
    label: "group组",
    prop: "groupProp",
    type: "group",
    groupFormConfig: [
      {
        label: "选项1",
        prop: "childProp1",
        type: "input",
        value: "value1"
      },
      {
        label: "选项2",
        prop: "childProp1",
        value: "value2",
        type: "textarea"
      }
    ]
  }
];
```

<demo src="./group.vue"></demo>

## 展示模式（Display） 

使用 `Display` 模式时，将无法修改任何数据，数据只做展示使用，但是 `span` `labelWidth` 等配置依然生效。

```html
  <m-form
    :labelWidth="100"
    display 
    ...  
  />
```

<demo src="./show-display.vue"></demo>

## 使用 `远程请求` 获取参数

该场景使用 `exOptions (Attribute 属性)` 给 `Form组件` 提供内部参数，支持延迟和异步方式赋值。

```typescript
const exOptions = ref({
  Select1: [] as mOptionType[]
});

async function getOptionsFromApi() {
  exOptions.value["Select1"] = [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ];
}
```

<demo src="./case-ex-options.vue"></demo>

## 使用 `外置校验规则` 配置

该场景使用 `exRules (Attribute 属性)` 给 `Form组件` 提供内部参数，支持延迟和异步方式赋值。

```typescript
const exRules = ref({
  Input1: [{ validator: ruleFunction, trigger: "blur" }]
});

function ruleFunction(rule: any, value: any, callback: any) {
  callback();
}
```

<demo src="./case-ex-rules.vue"></demo>

## 异步更改配置项

该场景使用 `resetStructure` 方法对源配置项进行修改，以支持异步参数配置，配置项的值由 [`Cell元素`](/document/demo/component/m-element/readme.html) 决定。

```typescript
  proForm.value?.resetStructure("Prop", {
    fileIncludeType: [".png", ".jpg"],
    ...
  });
```

<demo src="./case-set-config.vue"></demo>

## 使用 `Slot 插槽` 进行扩展

对于非基础表单组件或无法满足需求的，可以使用 `Slot 插槽` 对表单进行扩展。

### 基础的使用

```html
<m-form id="case-slot-from-demo" ref="proForm" :structure="formConfig">
  <template #SlotKey> // [!code warning] ... </template>
</m-form>
```

```typescript
const formConfig: mFormStructureType[] = [
  {
    label: "Slot1",
    prop: "SlotKey", // [!code warning]
    type: "slot" // [!code error]
  }
];
```

<demo src="./case-slot.vue"></demo>

### Option 的扩展

对于下拉框结构的现实可以使用 `Options-Slot` 进行扩展，使用时插槽名称只需在 `key` 前面添加 `option-` 即可。

```html
<m-form id="case-slot-from-demo" ref="proForm" :structure="formConfig">
  <template #option-Select="scope"> {{ scope }} </template> // [!code warning]
</m-form>
```

<demo src="./case-slot-options.vue"></demo>

### Cell 的扩展

`Cell元素` 的两侧预留了插槽用于内容的展示与扩展，使用时插槽名称只需在 `key` 前面添加 `cell-` 即可。

```html
  <m-form id="case-slot-from-demo" ref="proForm" :structure="formConfig" :span="2">
    <template #cell-Select> <m-button class="ml10" is="go">按钮</m-button> </template> // [!code warning]
  </m-form>
```

<demo src="./case-slot-cell.vue"></demo>

## Api

### 结构（mFormStructureType）

```typescript
const formConfig: mFormStructureType[] = [
  { label: "输入框", prop: "Input1", type: "input" },
  ...
];
```

BaseType 基础参数 & `CellItemType`

| 字段     | 类型                                                                                   | 必填 | 描述         |
| -------- | -------------------------------------------------------------------------------------- | ---- | ------------ |
| label    | string                                                                                 | ❌    | 标签         |
| tip      | string                                                                                 | ❌    | 标签提示     |
| unitName | string                                                                                 | ❌    | 分组组名     |
| unitTip  | string                                                                                 | ❌    | 分组组名提示 |
| rules    | [FormItemRule[]](https://element-plus.gitee.io/zh-CN/component/form.html#formitemrule) | ❌    | 表单校验规则 |
| span     | 1 / 2 / 3 / 4                                                                          | ❌    | 表单强制分栏 |

`CellItemType` 单元格类型

| 单元格类型                                                                                             | 描述       |
| ------------------------------------------------------------------------------------------------------ | ---------- |
| [MElementInputType](/document/demo/component/m-element/readme.html#输入框-melementinputtype)           | 输入框     |
| [MElementNumberType](/document/demo/component/m-element/readme.html#数字输入框-melementnumbertype)     | 数字输入框 |
| [MElementSelectType](/document/demo/component/m-element/readme.html#选择器-melementselecttype)         | 选择器     |
| [MElementCascaderType](/document/demo/component/m-element/readme.html#联级选择器-melementcascadertype) | 联级选择器 |
| [MElementCheckBoxType](/document/demo/component/m-element/readme.html#多选-melementcheckboxtype)       | 多选       |
| [MElementRadioType](/document/demo/component/m-element/readme.html#单选-melementradiotype)             | 单选       |
| [MElementIconType](/document/demo/component/m-element/readme.html#icon选择-melementicontype)           | icon 选择  |
| [MElementSwitchType](/document/demo/component/m-element/readme.html#开关-melementswitchtype)           | 开关       |
| [MElementDateType](/document/demo/component/m-element/readme.html#时间选择器-melementdatetype)         | 时间选择器 |
| [MElementAddressType](/document/demo/component/m-element/readme.html#地址选择器-melementaddresstype)   | 地址选择器 |
| [MElementFileType](/document/demo/component/m-element/readme.html#文件上传-melementfiletype)           | 文件上传   |

### Attribute 属性

| 字段          | 是否必填 | 类型                 | 描述                               |
| ------------- | -------- | -------------------- | ---------------------------------- |
| structure     | ✅        | mFormStructureType[] | 表单配置                           |
| id            | ✅        | string               | 表单 id，同页面存在多个表单时填写  |
| data          | ❌        | object               | 外置默认数据(双向`绑定`数据)       |
| value         | ❌        | object               | 外置默认数据(双向`隔离`数据)       |
| contrastData  | ❌        | object               | 外置对比数据                       |
| span          | ❌        | 1 / 2 / 3 / 4        | 表单强制分栏                       |
| labelWidth    | ❌        | number               | `label` 宽度，不设置时使用弹性宽度 |
| labelPosition | ❌        | 'left' / 'right'     | `labelWidth==true` 时 `label` 位置 |
| exRules       | ❌        | object               | 外置 `校验规则`                    |
| exOptions     | ❌        | object               | 外置 `Option 参数` 依赖            |
| disabled      | ❌        | boolean              | 设置表单为纯展示                   |
| useRequired   | ❌        | object               | 强制不使用校验                     |
| exDependent   | ❌        | `ExDependentType`    | 外置依赖                           |
| useTopTitle   | ❌        | boolean              | 是否使用上方式标题                 |

`ExDependentType` 外置依赖

| 字段         | 是否必填 | 类型   | 描述                                                |
| ------------ | -------- | ------ | --------------------------------------------------- |
| disabledRule | ❌        | object | 禁用规则                                            |
| fileData     | ❌        | object | `type==file` 上传文件需要的额外数据                 |
| remoteMethod | ❌        | object | `type==online-select / request-select` 传入请求方法 |

### Events 事件

| 字段     | 类型     | 描述                               |
| -------- | -------- | ---------------------------------- |
| cellBack | function | 当表单数据发生变化时调用的回调方法 |

### Exposes 暴露

```typescript
const proForm = ref();
async function submitForm() {
  const data = await proForm.value.getSubmitForm();
  if (data) {
    formData.value = data;
  }
}
```

Function 方法

| 方法名称      | 请求参数 | 描述                         |
| ------------- | -------- | ---------------------------- |
| getSubmitForm | null     | 进行表单校验，并且获取表单值 |
| cleanAll      | null     | 清空已填写的表单             |
