# Cell 基础元素

基础元素主要用于 `m-table` 与 `m-form` 内表单元素配置，方便更快完成表单的构建与规则的设置

## 输入框 (MElementInputType)

| 字段           | 类型                                         | 必填 | 默认值    | 描述                             |
| -------------- | -------------------------------------------- | ---- | --------- | -------------------------------- |
| type           | "input"/"textarea"                           | ✅    |           | 表单组件类型                     |
| prop           | string                                       | ✅    |           | 表单结果字段 key                 |
| placeholder    | string                                       | ❌    |           | 输入框提示                       |
| disabled       | boolean                                      | ❌    | false     | 禁用状态                         |
| display        | boolean                                      | ❌    | false     | 纯展示                           |
| maxLength      | number                                       | ❌    |           | 内容长度的最大数                 |
| minLength      | number                                       | ❌    |           | 内容长度的最小数                 |
| clearable      | boolean                                      | ❌    | true      | 显示清除按钮 `type==text`        |
| showPassword   | boolean                                      | ❌    |           | 显示切换密码图标 `type==text`    |
| showWordLimit  | boolean                                      | ❌    | true      | 显示统计字数，需配置 `maxLength` |
| minRows        | number                                       | ❌    | 3         | 最小行数 `type==textarea`        |
| maxRows        | number                                       | ❌    | 5         | 最大行数 `type==textarea`        |
| autofocus      | boolean                                      | ❌    | false     | 自动获取焦点                     |
| size           | "default" / "large" / "small"                | ❌    | "default" | 尺寸大小                         |
| inputParser    | (value: string) => string / undefined        | ❌    | false     | 指定从格式化器输入中提取的值     |
| inputFormatter | (value: number/string) => string / undefined | ❌    | false     | 指定输入值的格式                 |

## 数字输入框 (MElementNumberType)

| 字段         | 类型                          | 必填 | 默认值    | 描述                       |
| ------------ | ----------------------------- | ---- | --------- | -------------------------- |
| type         | "number"                      | ✅    |           | 表单组件类型               |
| prop         | string                        | ✅    |           | 表单结果字段 key           |
| placeholder  | string                        | ❌    |           | 输入框提示                 |
| disabled     | boolean                       | ❌    | false     | 禁用状态                   |
| display      | boolean                       | ❌    | false     | 纯展示                     |
| max          | number                        | ❌    |           | 最大值                     |
| min          | number                        | ❌    |           | 最小值                     |
| maxBy        | string                        | ❌    |           | 最小值依赖源               |
| minBy        | string                        | ❌    |           | 最小值依赖源               |
| precision    | number                        | ❌    | 0         | 小数点精度                 |
| controls     | boolean                       | ❌    | false     | 显示控制器                 |
| clearOnValue | boolean                       | ❌    | false     | 当清空时是否恢复 `最小值`  |
| step         | number                        | ❌    | 1         | 计数器步长                 |
| stepStrictly | boolean                       | ❌    | false     | 是否只能输入 `step` 的倍数 |
| size         | "default" / "large" / "small" | ❌    | "default" | 尺寸大小                   |

## 选择器 (MElementSelectType)

| 字段            | 类型                                                                                                             | 必填 | 默认值    | 描述                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | ---- | --------- | ------------------------------------------------------ |
| prop            | string                                                                                                           | ✅    |           | 表单结果字段 key                                       |
| type            | "multiple-select" / "select"                                                                                     | ✅    |           | 表单组件类型                                           |
| placeholder     | string                                                                                                           | ❌    |           | 输入框提示                                             |
| disabled        | boolean                                                                                                          | ❌    | false     | 禁用状态                                               |
| display         | boolean                                                                                                          | ❌    | false     | 纯展示                                                 |
| clearable       | boolean                                                                                                          | ❌    | true      | 显示清除按钮                                           |
| multipleLimit   | number                                                                                                           | ❌    | 0         | `type==multiple-select` 选择的项目数， 为 `0` 则不限制 |
| collapseTags    | boolean                                                                                                          | ❌    | true      | `type==multiple-select` 将选中值按文字的形式展示       |
| maxCollapseTags | number                                                                                                           | ❌    | 1         | `collapseTags==true` 需要显示的 Tag 的最大数量         |
| options         | [MElementSelectOptionType[]](/document/demo/component/m-element/readme.html#选择器选项-melementselectoptiontype) | ❌    |           | 内置选项                                               |
| size            | "default" / "large" / "small"                                                                                    | ❌    | "default" | 尺寸大小                                               |

## 远端请求选择器 (MElementRequestSelectType)

| 字段            | 类型                                                                                                             | 必填 | 默认值    | 描述                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | ---- | --------- | ------------------------------------------------------ |
| prop            | string                                                                                                           | ✅    |           | 表单结果字段 key                                       |
| type            | "multiple-request-select" / "request-select"                                                                     | ✅    |           | 表单组件类型                                           |
| placeholder     | string                                                                                                           | ❌    |           | 输入框提示                                             |
| disabled        | boolean                                                                                                          | ❌    | false     | 禁用状态                                               |
| display         | boolean                                                                                                          | ❌    | false     | 纯展示                                                 |
| clearable       | boolean                                                                                                          | ❌    | true      | 显示清除按钮                                           |
| multipleLimit   | number                                                                                                           | ❌    | 0         | `type==multiple-select` 选择的项目数， 为 `0` 则不限制 |
| collapseTags    | boolean                                                                                                          | ❌    | true      | `type==multiple-select` 将选中值按文字的形式展示       |
| maxCollapseTags | number                                                                                                           | ❌    | 1         | `collapseTags==true` 需要显示的 Tag 的最大数量         |
| requestBy       | string[] / string                                                                                                | ❌    |           | 请求触发来源 `m-table` 使用                            |
| options         | [MElementSelectOptionType[]](/document/demo/component/m-element/readme.html#选择器选项-melementselectoptiontype) | ❌    |           | 内置选项                                               |
| size            | "default" / "large" / "small"                                                                                    | ❌    | "default" | 尺寸大小                                               |

## 远端搜索请求选择器 (MElementOnlineSelectType)

| 字段            | 类型                                                                                                             | 必填 | 默认值    | 描述                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | ---- | --------- | ------------------------------------------------------ |
| prop            | string                                                                                                           | ✅    |           | 表单结果字段 key                                       |
| type            | "multiple-online-select" / "online-select"                                                                       | ✅    |           | 表单组件类型                                           |
| placeholder     | string                                                                                                           | ❌    |           | 输入框提示                                             |
| disabled        | boolean                                                                                                          | ❌    | false     | 禁用状态                                               |
| display         | boolean                                                                                                          | ❌    | false     | 纯展示                                                 |
| clearable       | boolean                                                                                                          | ❌    | true      | 显示清除按钮                                           |
| multipleLimit   | number                                                                                                           | ❌    | 0         | `type==multiple-select` 选择的项目数， 为 `0` 则不限制 |
| collapseTags    | boolean                                                                                                          | ❌    | true      | `type==multiple-select` 将选中值按文字的形式展示       |
| maxCollapseTags | number                                                                                                           | ❌    | 1         | `collapseTags==true` 需要显示的 Tag 的最大数量         |
| options         | [MElementSelectOptionType[]](/document/demo/component/m-element/readme.html#选择器选项-melementselectoptiontype) | ❌    |           | 内置选项                                               |
| size            | "default" / "large" / "small"                                                                                    | ❌    | "default" | 尺寸大小                                               |

### 选择器选项 (MElementSelectOptionType)

| 字段     | 类型            | 必填 | 默认值 | 描述     |
| -------- | --------------- | ---- | ------ | -------- |
| label    | string          | ✅    |        | 选项名   |
| value    | string / number | ✅    |        | 选项值   |
| disabled | boolean         | ❌    |        | 禁用状态 |

## 联级选择器 (MElementCascaderType)

| 字段            | 类型                                                                                                                     | 必填 | 默认值    | 描述                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | ---- | --------- | ---------------------------------------------- |
| prop            | string                                                                                                                   | ✅    |           | 表单结果字段 key                               |
| type            | "cascader-check" / "cascader" / "multiple-cascader-check" / "multiple-cascader"                                          | ✅    |           | 表单组件类型                                   |
| placeholder     | string                                                                                                                   | ❌    |           | 输入框提示                                     |
| clearable       | boolean                                                                                                                  | ❌    | true      | 显示清除按钮                                   |
| disabled        | boolean                                                                                                                  | ❌    | false     | 禁用状态                                       |
| display         | boolean                                                                                                                  | ❌    | false     | 纯展示                                         |
| collapseTags    | boolean                                                                                                                  | ❌    | true      | `type==multiple-*` 将选中值按文字的形式展示    |
| maxCollapseTags | number                                                                                                                   | ❌    | 1         | `collapseTags==true` 需要显示的 Tag 的最大数量 |
| options         | [MElementCascaderOptionType[]](/document/demo/component/m-element/readme.html#联级选择器选项-melementcascaderoptiontype) | ❌    |           | 内置选项                                       |
| size            | "default" / "large" / "small"                                                                                            | ❌    | "default" | 尺寸大小                                       |

### 联级选择器选项 (MElementCascaderOptionType)

| 字段     | 类型                                                                                                                     | 必填 | 默认值 | 描述     |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ---- | ------ | -------- |
| label    | string                                                                                                                   | ✅    |        | 选项名   |
| value    | string / number                                                                                                          | ✅    |        | 选项值   |
| children | [MElementCascaderOptionType[]](/document/demo/component/m-element/readme.html#联级选择器选项-melementcascaderoptiontype) | ❌    |        | 子选     |
| disabled | boolean                                                                                                                  | ❌    |        | 禁用状态 |
| base     | object                                                                                                                   | ❌    |        | 源数据   |

## 多选 (MElementCheckBoxType)

| 字段     | 类型                                                                                                               | 必填 | 默认值 | 描述             |
| -------- | ------------------------------------------------------------------------------------------------------------------ | ---- | ------ | ---------------- |
| type     | "checkbox"                                                                                                         | ✅    |        | 表单组件类型     |
| prop     | string                                                                                                             | ✅    |        | 表单结果字段 key |
| disabled | boolean                                                                                                            | ❌    |        | 禁用状态         |
| display  | boolean                                                                                                            | ❌    | false  | 纯展示           |
| options  | [MElementCheckBoxOptionType[]](/document/demo/component/m-element/readme.html#多选选项-melementcheckboxoptiontype) | ❌    |        | 内置选项         |

### 多选选项 (MElementCheckBoxOptionType)

| 字段     | 类型            | 必填 | 默认值 | 描述     |
| -------- | --------------- | ---- | ------ | -------- |
| label    | string          | ✅    |        | 选项名   |
| value    | string / number | ✅    |        | 选项值   |
| disabled | boolean         | ❌    |        | 禁用状态 |

## 单选 (MElementRadioType)

| 字段     | 类型                                                                                                         | 必填 | 默认值    | 描述             |
| -------- | ------------------------------------------------------------------------------------------------------------ | ---- | --------- | ---------------- |
| type     | "radio"                                                                                                      | ✅    |           | 表单组件类型     |
| prop     | string                                                                                                       | ✅    |           | 表单结果字段 key |
| disabled | boolean                                                                                                      | ❌    |           | 禁用状态         |
| display  | boolean                                                                                                      | ❌    |           | false            | 纯展示 |
| options  | [MElementRadioOptionType[]](/document/demo/component/m-element/readme.html#单选选项-melementradiooptiontype) | ❌    |           | 内置选项         |
| size     | "default" / "large" / "small"                                                                                | ❌    | "default" | 尺寸大小         |

### 单选选项 (MElementRadioOptionType)

| 字段     | 类型            | 必填 | 默认值 | 描述     |
| -------- | --------------- | ---- | ------ | -------- |
| label    | string          | ✅    |        | 选项名   |
| value    | string / number | ✅    |        | 选项值   |
| disabled | boolean         | ❌    |        | 禁用状态 |

## ICON选择 (MElementIconType) 

| 字段        | 类型                          | 必填 | 默认值    | 描述             |
| ----------- | ----------------------------- | ---- | --------- | ---------------- |
| type        | "select-icon"                 | ✅    |           | 表单组件类型     |
| prop        | string                        | ✅    |           | 表单结果字段 key |
| placeholder | string                        | ❌    |           | 输入框提示       |
| disabled    | boolean                       | ❌    |           | 禁用状态         |
| display     | boolean                       | ❌    |           | 纯展示           |
| size        | "default" / "large" / "small" | ❌    | "default" | 尺寸大小         |

## 开关 (MElementSwitchType)

| 字段          | 类型                          | 必填 | 默认值    | 描述             |
| ------------- | ----------------------------- | ---- | --------- | ---------------- |
| type          | "switch"                      | ✅    |           | 表单组件类型     |
| prop          | string                        | ✅    |           | 表单结果字段 key |
| disabled      | boolean                       | ❌    |           | 禁用状态         |
| display       | boolean                       | ❌    |           | 纯展示           |
| activeValue   | string / number / boolean     | ❌    |           | 打开（值）       |
| inActiveValue | string / number / boolean     | ❌    |           | 关闭（值）       |
| activeText    | string                        | ❌    |           | 打开（键）       |
| inActiveText  | string                        | ❌    |           | 关闭（键）       |
| size          | "default" / "large" / "small" | ❌    | "default" | 尺寸大小         |

## 时间选择器 (MElementDateType)

| 字段        | 类型                                                                                                                                             | 必填 | 默认值    | 描述             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---- | --------- | ---------------- |
| type        | "date-picker-group" / "date-picker"/ "date-time-range"/ "month-picker-group"/ "month-picker"/ "time-picker-group"/ "time-picker"/ "year-picker"; | ✅    |           | 表单组件类型     |
| prop        | string                                                                                                                                           | ✅    |           | 表单结果字段 key |
| placeholder | string                                                                                                                                           | ❌    |           | 输入框提示       |
| disabled    | boolean                                                                                                                                          | ❌    |           | 禁用状态         |
| display     | boolean                                                                                                                                          | ❌    |           | 纯展示           |
| size        | "default" / "large" / "small"                                                                                                                    | ❌    | "default" | 尺寸大小         |

## 地址选择器 (MElementAddressType)

| 字段        | 类型                          | 必填 | 默认值    | 描述             |
| ----------- | ----------------------------- | ---- | --------- | ---------------- |
| type        | "address"                     | ✅    |           | 表单组件类型     |
| prop        | [string, string, string]      | ✅    |           | 表单结果字段 key |
| placeholder | string                        | ❌    |           | 输入框提示       |
| disabled    | boolean                       | ❌    |           | 禁用状态         |
| display     | boolean                       | ❌    |           | 纯展示           |
| size        | "default" / "large" / "small" | ❌    | "default" | 尺寸大小         |

## 文件上传 (MElementFileType)

| 字段            | 类型     | 必填 | 描述                          |
| --------------- | -------- | ---- | ----------------------------- |
| type            | "file"   | ✅    | 表单组件类型                  |
| prop            | string   | ✅    | 表单结果字段 key              |
| fileMultiple    | number   | ❌    | 上传文件数量限制              |
| placeholder     | string   | ❌    | 输入框提示                    |
| disabled        | boolean  | ❌    | 禁用状态                      |
| display         | boolean  | ❌    | 纯展示                        |
| fileAttached    | object   | ❌    | 文件上传额外参数/数据         |
| fileIncludeType | string[] | ❌    | 文件类型限制 包含             |
| fileExcludeType | string[] | ❌    | 文件类型限制 不包含           |
| fileSingleSize  | number   | ❌    | 文件类型限制 单文件大小       |
| fileAllSize     | number   | ❌    | 文件类型限制 单次总包文件大小 |
