# Dialog 弹窗

常用的弹窗组件。

## 基础用法

开盖即用，更可配置 `自定义` 个性化使用。

<demo src="./base.vue" ></demo>

## 宽度设置

使用 `size` 来定义弹出框尺寸。

<demo src="./size.vue"  ></demo>

## 高度设置

使用 `height` 来定义弹窗框高度。

<demo src="./height.vue"  ></demo>

## 偏移设置

使用 `offsetX` 与 `offsetY` 来定义弹窗框位置偏移量。

<demo src="./offset.vue"  ></demo>

## 使用 `插槽位置` 展示

| 字段   | 描述        |
| ------ | ----------- |
| footer | Dialog 底部 |
| header | Dialog 标题 |

## Api

### Attribute 属性

| 属性名     | 说明          | 类型            | 可选值                  | 默认值   |
| :--------- | :------------ | :-------------- | :---------------------- | :------- |
| size       | 内置尺寸      | string          | "l" / "m" / "max" / "s" | m        |
| height     | 高度          | string / number |                         | 500      |
| width      | 宽度          | string / number |                         |          |
| offsetX    | X 轴偏移量    | string / number |                         | 0        |
| offsetY    | Y 轴偏移量    | string / number |                         | 0        |
| keepAlive  | 缓存模式      | boolean         |                         | false    |
| title      | Dialog 标题   | string          |                         | 'Dialog' |
| useFull    | 使用全屏模式  | boolean         |                         | false    |
| closeOnMod | 点击 Mod 退出 | boolean         |                         | true     |
| closeOnEsc | 使用 Esc 退出 | boolean         |                         | true     |
| draggable  | 开启拖拽      | boolean         |                         | false    |
