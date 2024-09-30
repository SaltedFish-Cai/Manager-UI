<template>
  <template v-if="item.prop">
    <el-cascader
      v-if="!item.display"
      v-model="cascaderAddress"
      @change="cascaderChange"
      :placeholder="item.placeholder"
      :options="state.regionData"
      :props="cascaderProps"
      filterable
      :disabled="item.disabled"
      placement="bottom"
      :size="item.size"
    />
    <div v-else class="el-form-item__content——value">{{ findData(item.prop) || "--" }}</div>
    <div
      v-if="alwaysContrast || (findContrastData(item.prop) && findContrastData(item.prop) != findData(item.prop))"
      :class="['contrast-value', item.size == 'small' ? 'contrast-value__small' : '']"
    >
      {{ findContrastData(item.prop) }}
    </div>
  </template>
  <div v-else>--</div>
</template>
<script lang="ts" setup>
// _Import
import { reactive, ref, watch, onBeforeMount } from "vue";
import { MElementAddressType } from "./index";
import { Obj } from "@/package/global";
import { GetSystemAddressMap } from "@/package/api/form";

// _Props
type Props = {
  item: MElementAddressType;
  data: {};
  contrastData?: {};
  alwaysContrast?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({})
});

// _Var
const cascaderProps = {
  value: "Value",
  label: "Label",
  children: "Children",
  expandTrigger: "click" as const
};
const staticState = {
  CodeToText: { Province: [] as Obj[], City: [] as Obj[], Region: [] as Obj[] },
  TextToCode: { Province: [] as Obj[], City: [] as Obj[], Region: [] as Obj[] }
};
const cascaderAddress = ref(["", "", ""]);
const state = reactive({ regionData: [] as Obj[], Prop: "" });

// _Emits
const emit = defineEmits(["change"]);

// _Vue
onBeforeMount(() => {
  getAddressMap();
});

// _Function 添加Address字典
async function getAddressMap() {
  const Data = await GetSystemAddressMap();
  init(Data);
  setAddressData();
}

// _Function 改改选择
function cascaderChange(data: any) {
  if (data.length == 3) {
    const CodeToText = staticState.CodeToText;
    const _prop = props.item.prop;
    if (!_prop) return;
    const Province = CodeToText.Province[data[0]];
    const City = CodeToText.City[data[1]];
    const Region = CodeToText.Region[data[2]];

    if (Array.isArray(props.item.prop)) {
      props.data[_prop[0]] = Province;
      props.data[_prop[1]] = City;
      props.data[_prop[2]] = Region;
      props.data[state.Prop] = `${Province}-${City}-${Region}`;
    } else {
      props.data[state.Prop] = `${Province}-${City}-${Region}`;
    }
  } else {
    props.data[state.Prop] = "";
    cascaderAddress.value = [];
  }
  emit("change", { value: props.data[state.Prop], item: { ...props.item, prop: props.item?.prop?.join("-") } });
}

// _Function 初始化
async function init(Data) {
  if ((state.regionData && state.regionData.length) || !Data) return;

  const CodeToText = staticState.CodeToText;
  const TextToCode = staticState.TextToCode;

  for (let v = 0; v < Data.length; v++) {
    const vd = Data[v];
    CodeToText.Province[vd.Value] = vd.Label;
    TextToCode.Province[vd.Label] = vd.Value;

    for (let i = 0; i < vd.Children.length; i++) {
      const id = vd.Children[i];
      CodeToText.City[id.Value] = id.Label;
      TextToCode.City[vd.Label + id.Label] = id.Value;

      for (let a = 0; a < id.Children.length; a++) {
        const ad = id?.Children[a];
        if (ad) {
          CodeToText.Region[ad.Value] = ad.Label;
          TextToCode.Region[vd.Label + id.Label + ad.Label] = ad.Value;
        }
      }
    }
  }

  state.regionData = Data;
  staticState.CodeToText = CodeToText;
  staticState.TextToCode = TextToCode;
}

// _Function 查找值
function findData(prop) {
  return `${props.data[prop[0]] || "--"}/${props.data[prop[1]] || "--"}/${props.data[prop[2]] || "--"}`;
}

// _Function 查找对比值
function findContrastData(prop) {
  if (!props.contrastData[prop[0]]) return;
  return `${props.contrastData[prop[0]] || "--"}/${props.contrastData[prop[1]] || "--"}/${props.contrastData[prop[2]] || "--"}`;
}

// _Function 设置值
function setAddressData() {
  const data = props.data;
  const _prop = props.item.prop;
  if (!_prop) return;
  const _propFirst = _prop[0];

  if (Array.isArray(_prop)) {
    if (!data[_propFirst] || data[_propFirst].indexOf("null") > -1 || data[_propFirst].indexOf("undefined") > -1) {
      props.data[state.Prop] = "";
      cascaderAddress.value = [];
      return;
    }
    data[state.Prop] = `${data[_prop[0]]}-${data[_prop[1]]}-${data[_prop[2]]}`;

    const TextToCode: Obj = staticState.TextToCode;

    const Province = TextToCode.Province[data[_prop[0]]];
    const City = TextToCode.City[data[_prop[0]] + data[_prop[1]]];
    const Region = TextToCode.Region[data[_prop[0]] + data[_prop[1]] + data[_prop[2]]];

    cascaderAddress.value = [Province, City, Region];
    props.data[state.Prop] = `${Province}-${City}-${Region}`;
  } else {
    props.data[state.Prop] = data[state.Prop];
    cascaderAddress.value = data[state.Prop]?.split("-");
  }
}

// _Watch item
watch(
  () => props.item,
  async item => {
    if (Array.isArray(item.prop)) {
      state.Prop = item.prop.join("-");
    }
  },
  { immediate: true }
);

// _Watch 值
watch(
  () => props.data[state.Prop],
  async () => {
    setAddressData();
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
@import "../index.scss";
</style>
