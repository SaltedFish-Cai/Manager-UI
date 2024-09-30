<template>
  <m-editor id="base-editor" ref="editor" :default-value="data"> </m-editor>

  <div class="flex-center mt10">
    <m-button is="submit" @click="save">获取值</m-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const editor = ref();
const data = `<p style='color:red'>用 JS 设置的内容</p>`;

function save() {
  const data = editor.value.getEditorValue();
  console.log("++++++++++> data:", data);
}
</script>

<style scoped></style>
