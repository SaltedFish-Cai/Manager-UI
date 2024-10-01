# LineMap 关系图

链接关系组件。

## 基础用法

开盖即用，无需额外配置。

<demo src="./base.vue" ></demo>

## Api

### Attribute 属性

:::danger
`default-data` 数据使用优先级高于 `tree-data` 数据结构，切勿同时使用。
:::

| 属性名       | 类型                         | 可选值 | 默认值 | 说明               |
| :----------- | :--------------------------- | :----- | :----- | :----------------- |
| tree-data    | PropsDataConfigType[]        | —      | -      | 默认树形结构数据值 |
| default-data | DefaultPropsDataConfigType[] | —      | -      | 默认数据值         |

### Exposes 暴露

```typescript
const lineMapRef = ref();
async function submitForm() {
  const data = await lineMapRef.value.getMapDataByTree();
  if (data) {
    formData.value = data;
  }
}
```

`Function` 方法

| 方法名称         | 请求参数 | 描述             |
| ---------------- | -------- | ---------------- |
| getMapDataByTree | null     | 获取树形结构数据 |
| getMapData       | null     | 获取数组结构数据 |
