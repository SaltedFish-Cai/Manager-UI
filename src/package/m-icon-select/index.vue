<template>
  <div class="">
    <div>
      <m-icon class="pop_icon-show" :name="selectItem" />
    </div>

    <el-tabs v-model="activeName" class="no_flx_tabs">
      <el-tab-pane v-for="its in Config" :key="its.name" :label="`${its.title}(${its.icons.length})`" :name="its.name">
        <transition appear name="fade-transform" mode="out-in">
          <div class="h300">
            <div class="select_icon_popover">
              <template v-for="icon in its.icons" :key="icon.value">
                <m-icon
                  class="pop_icon"
                  :style="{ color: icon.value == selectItem ? 'var(--el-color-primary)' : '' }"
                  :name="icon.value"
                  @click="selectedIcon(icon.value)"
                  @mouseover="hoverIcon(icon)"
                />
              </template>
            </div>
          </div>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
// _Import
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { selectIconProps } from "./type";
import iconJson from "./config/icon.json";
import direction from "./config/direction.json";
import multiMedia from "./config/multi-media.json";
import office from "./config/office.json";
import shop from "./config/shop.json";
import cityJson from "./config/city.json";
import network from "./config/network.json";

// _Var
const Config = ref([
  {
    title: "全部图标",
    name: "all",
    icons: setIconOptions([...iconJson, ...network, ...multiMedia, ...office, ...shop, ...cityJson, ...direction])
  },
  { title: "网络图标", name: "network", icons: setIconOptions(network) },
  { title: "方向图标", name: "direction", icons: setIconOptions(direction) },
  { title: "办公图标", name: "fileType", icons: setIconOptions(office) },
  { title: "娱乐图标", name: "multiMedia", icons: setIconOptions(multiMedia) },
  { title: "商城图标", name: "shop", icons: setIconOptions(shop) },
  { title: "城市图标", name: "city", icons: setIconOptions(cityJson) },
  { title: "其他图标", name: "default", icons: setIconOptions(iconJson) }
]);

const props = defineProps<selectIconProps>();
const selectItem = ref(props.defaultIcon || "finger_press_line");
const hoverItem = ref("finger_press_line");

const activeName = ref("all");
const emit = defineEmits(["change"]);

// _Function 设置Icon选项
function setIconOptions(icons) {
  const iconOptions = icons.map(item => {
    return { label: item.font_class, value: item.font_class };
  });
  return iconOptions;
}

// _Function 选择Icon
function selectedIcon(iconText) {
  selectItem.value = iconText;
  emit("change", iconText);
  if (props.useCopy) handleCopy(iconText);
}

// _Function 悬停Icon
function hoverIcon(iconText) {
  hoverItem.value = iconText.label;
}

// _Function 点击拷贝
function handleCopy(text) {
  const copyInput = document.createElement("input");
  document.body.appendChild(copyInput);
  copyInput.setAttribute("value", text);
  copyInput.select();
  document.execCommand("Copy");
  ElMessage.success("图标名——已复制！");
  document.body.removeChild(copyInput);
}

// _Watch defaultIcon
watch(
  () => props.defaultIcon,
  data => {
    selectItem.value = data || "finger_press_line";
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.h300 {
  overflow: scroll;
}
.select_icon_popover {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  .pop_icon {
    padding: 10px;
    font-size: 30px;
  }
}
.pop_icon-show {
  font-size: 28px;
}
.label-btn {
  width: 100%;
}
</style>
