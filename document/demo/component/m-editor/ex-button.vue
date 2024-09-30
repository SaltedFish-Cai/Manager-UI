<template>
  <m-editor id="ex-button-editor" ref="editor" :default-value="data" :exButton="exButton"> </m-editor>

  <m-dialog v-model="visible" title="自定义" size="s" height="auto">
    <div class="flex-center mt10">
      <m-button is="submit" @click="setValue">设置新值</m-button>
    </div></m-dialog
  >
  <div class="flex-center mt10">
    <m-button is="submit" @click="save">获取值</m-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const editor = ref();
const data = `<p style='color:red'>用 JS 设置的内容</p>`;
const visible = ref(false);
const exButton = [
  {
    icon: "robot_line",
    name: "aaa",
    target: () => {
      visible.value = true;
    }
  }
];

function save() {
  const data = editor.value.getEditorValue();
  console.log("++++++++++> data:", data);
}

function setValue() {
  editor.value.setEditorValue(`<p style='color:blue'>这是新内容</p>`);
  visible.value = false;
}
</script>

<style scoped></style>
