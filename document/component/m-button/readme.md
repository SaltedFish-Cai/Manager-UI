# Button 按钮

常用的操作按钮。

## 基础用法

使用 `type`、`plain`、`round` 和 `circle` 来定义按钮的样式。

<demo src="./base.vue" ></demo>

## 禁用状态

使用 `disabled` 来定义按钮的禁用。

<demo src="./disabled.vue"  ></demo>

## 链接按钮

:::warning
`type="text"` 已被 废弃，请考虑切换至新的 API `link` 。
:::

<demo src="./link.vue"></demo>

## 内置样式

内置样式只需使用 `is` 即可完成样式选择

<demo src="./is.vue"></demo>

## 防抖按钮

使用 `debounced` 即可开启防抖模式

<demo src="./debounced.vue"></demo>

## Icon位置

使用 `position` 即可开启防抖模式

<demo src="./position.vue"></demo>

## Api

### Attribute 属性

| 属性名        | 类型    | 可选值                                                             | 默认值  | 说明                                                               |
| :------------ | :------ | :----------------------------------------------------------------- | :------ | :----------------------------------------------------------------- |
| is            | string  | [样式展示](/document/component/m-button/readme.html#内置样式) | —       | 内置样式选择                                                       |
| type          | string  | default / primary / success / warning / danger / info / text       | default | 类型                                                               |
| position      | string  | 'left' / 'right'                                                   | left    | Icon位置                                                           |
| font          | string  | —                                                                  | --      | icon 图标([`m-icon`](/document/component/m-icon/readme.html)) |
| loading       | boolean | —                                                                  | false   | 是否 `Loading` 状态                                                |
| loadingBy     | string  | —                                                                  | --      | 自动 `Loading` 监听依赖源                                          |
| plain         | boolean | —                                                                  | true    | 是否为朴素按钮                                                     |
| round         | boolean | —                                                                  | false   | 是否为圆角按钮                                                     |
| circle        | boolean | —                                                                  | false   | 是否为圆形按钮                                                     |
| debounced     | boolean | —                                                                  | false   | 开启防抖                                                           |
| debouncedTime | number  | —                                                                  | 800     | 防抖延迟时间                                                       |
