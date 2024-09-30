# Tabs 选项卡

常用的选项卡。

## 基础用法

无额外配置直接使用即可。

<demo src="./base.vue" ></demo>

## 自定义标签

使用 `插槽` 对选项卡标签进行自定义内容修改。

```html
  <m-tabs v-model="activeName">
    <m-tab-item label="第一页" name="page1">   
      <template #label>  // [!code warning]
        <m-icon name="applet_line" />  // [!code warning]
        <span>Page1</span>  // [!code warning]
      </template>  // [!code warning]
      page1
    </m-tab-item>
  </m-tabs>
```

<demo src="./slot.vue" ></demo>

## 滚动模式（锚点）

当设置 `slider` 模式，可实现全展示与 `锚点` 功能

```html
<m-tabs v-model="state.activeName" slider> // [!code warning]
  <m-tab-item label="User" name="one"></m-tab-item> 
</m-tabs>
```

<demo src="./slider.vue" ></demo>

## 内页是否可滚动

当设置 tabs 高度时，内部元素 `m-tab-item` 高度会被拦截，可添加 `scroll` 是否滚动属性

```html
<m-tabs v-model="state.activeName">
  <m-tab-item label="User" name="one" scroll></m-tab-item> // [!code warning]
</m-tabs>
```

<demo src="./scroll.vue" ></demo>

## Api

### Attribute 属性

| 属性名        | 说明             | 类型    | 可选值                | 默认值    |
| :------------ | :--------------- | :------ | :-------------------- | :-------- |
| activeName    | 默认选中 tab     | string  |                       | —         |
| mode          | 显示类型         | string  | 'display' / 'visible' | 'visible' |
| card          | 卡片模式         | boolean |                       | false     |
| portrait      | 纵向模式         | boolean |                       | false     |
| slider        | 滚动模式（锚点） | boolean |                       | false     |
| useHeaderLine | 表头下划线       | boolean |                       | false     |

### Events 事件

| 字段       | 类型     | 描述              |
| ---------- | -------- | ----------------- |
| tab-change | function | 当 tab 切换时触发 |
