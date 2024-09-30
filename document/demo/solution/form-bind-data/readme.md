# Form 数据注入和使用提示

`V1.6.0` 版本将对数据进行管理和使用提示，但不会对使用用所影响，为了更好的管理数据，请修改为正确的使用方式。

## 解决方案

使用插槽时，数据的绑定使用 `scope` 下返回内容进行绑定。

## 错误案例

```html
  <m-form id="base-from-demo" ref="proForm" :structure="formConfig" :ex-options="exOptions" :data="baseData">
    <template #Input1>
      <el-input v-model="baseData.Input1"></el-input>  // [!code error]
    </template>
  </m-form>
```

<demo src="./form-bind-data-error.vue"></demo>

## 解决案例

```html
  <m-form id="base-from-demo" ref="proForm" :structure="formConfig" :ex-options="exOptions" :data="baseData">
    <template #Input1="{ data }">
      <el-input v-model="data.Input1"></el-input>  // [!code warning]
    </template>
  </m-form>
```

<demo src="./form-bind-data.vue"></demo>
