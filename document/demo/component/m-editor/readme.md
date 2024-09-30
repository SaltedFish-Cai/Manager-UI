# Editor 富文本编辑器

富文本编辑器组件。

## 基础用法

开盖即用，无需额外配置

<demo src="./base.vue" ></demo>

## 外置自定义菜单

```typescript
const exButton = [
  {
    icon: "robot_line",
    name: "aaa",
    target: () => {
      visible.value = true;
    }
  }
];
```

<demo src="./ex-button.vue" ></demo>

## Api

### Attribute 属性

| 属性名       | 必填 | 说明     | 类型       |
| ------------ | ---- | -------- | ---------- |
| id           | ✅    | 唯一标记 | string     |
| defaultValue | ❌    | 默认值   | string     |
| exButton     | ❌    | 外置按钮 | ButtonType |

`ButtonType` 类

| 属性名 | 必填 | 说明     | 类型     |
| ------ | ---- | -------- | -------- |
| icon   | ✅    | 图标     | string   |
| name   | ✅    | 描述     | string   |
| target | ✅    | 执行方法 | function |

### Exposes 暴露

`Function` 方法

```typescript
const editor = ref();
function save() {
  const data = editor.value.getEditorValue();
}
```

| 方法名称       | 请求参数 | 描述           |
| -------------- | -------- | -------------- |
| setEditorValue | string   | 编辑富文本内容 |
| getEditorValue | null     | 获取富文本内容 |
