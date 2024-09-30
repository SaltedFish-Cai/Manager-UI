<template>
  <div :id="id + '-m-editor-index'" :class="baseSize == 'small' ? 'm-editor m-editor_small' : 'm-editor'"></div>
  <m-dialog v-model="visibleCode" title="编辑源码" size="max" height="auto" use-full>
    <el-input v-model="editCode" :rows="18" type="textarea" placeholder="编辑源码" />
    <div class="flex-center mt10">
      <m-button is="save" @click="setEditorCode">保存源码</m-button>
    </div>
  </m-dialog>

  <el-upload
    class="hide-el"
    ref="uploadRef"
    :action="uploadConfig.host + '/newapi/UploadFile/UploadFiles'"
    :show-file-list="false"
    :data="upImageConfig?.fileAttached"
    :on-success="files => handleSuccess(files)"
    :on-error="() => handleError()"
    :on-change="fileChange"
    :accept="accept"
    :headers="setHeader()"
    multiple
    :http-request="httpRequest"
    :auto-upload="false"
  >
    <m-button id="m-editor-click-upload" class="btn-width mr0" is="upload" :loading="loading" />
  </el-upload>
</template>

<script lang="tsx" setup>
// _Import
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import lodashPkg from "lodash";
import { randChar } from "../tools/rand-char";
import { useBaseStore } from "../store/index";
import { Obj } from "@/package/global";
import { ajaxUpload } from "./ajax";
import { MEditorType, fileType } from "./type";
import inBrowser from "@/package/tools/inBrowser";

// _Var
const { debounce } = lodashPkg;

const props = withDefaults(defineProps<MEditorType>(), {
  defaultValue: ""
});

const uploadFilesList: { name: string; size: number }[] = [];
const ajaxFileList: Obj[] = [];
const defaultBtn = [
  {
    key: "editCode",
    icon: "overview_line",
    name: "源码编辑",
    target: () => {
      editCode.value = editor.txt.html();
      visibleCode.value = true;
    }
  },
  {
    key: "upImage",
    icon: "img_album_line",
    name: "图片",
    target: () => {
      const el = window.document.getElementById("m-editor-click-upload");
      if (el) el.click();
    }
  }
];
const maxTry = 5;
const _debounce = debounce(actionRequest, 100, { trailing: true });
const fetchUpload = debounce(
  () => {
    if (!uploadFilesList.length) return;
    if (!beforeUpload(uploadFilesList)) {
      uploadFilesList.length = 0;
      ajaxFileList.length = 0;
      uploadRef?.value?.clearFiles();
      loading.value = false;
      return;
    } else {
      uploadRef?.value?.submit();
    }
  },
  300,
  { trailing: true }
);

let indexTry = 0;
let editor;
let ajaxOptions: Obj = {};

const uploadRef = ref();
const loading = ref(false);
const visibleCode = ref(false);
const editCode = ref("");
const globalStateSize = ref("small");
const globalState = useBaseStore();

// _Computed uploadConfig
const uploadConfig = computed(() => ({
  host: globalState.getApiHost || "",
  token: globalState.getToken || "",
  version: globalState.getVersion || ""
}));

// _Computed baseSize
const baseSize = computed(() => {
  return globalStateSize.value;
});

// _Computed 允许类型
const accept = computed(() => {
  let accept: string | undefined = undefined;
  // if (props.upImageConfig) {
  // const { fileIncludeType } = props.upImageConfig;
  const fileIncludeType = [".png", ".jpg", ".jpeg", ".gif"];
  if (fileIncludeType && Array.isArray(fileIncludeType)) accept = fileIncludeType.join(",");
  // }
  return accept?.toLowerCase() || "";
});

// _Computed 不允许类型
const excludeType = computed(() => {
  // let exType: string | undefined = undefined;
  // if (props.upImageConfig) {
  //   const { fileExcludeType } = props.upImageConfig;
  //   if (fileExcludeType && Array.isArray(fileExcludeType)) exType = fileExcludeType.join(",");
  // }
  // return exType?.toLowerCase() || "";
  return "";
});

// _Computed 文件数量
// const fileMultiple = computed(() => {
//   let multiple: number | undefined = undefined;
//   if (props.upImageConfig) {
//     const { fileMultiple } = props.upImageConfig;
//     if (fileMultiple) multiple = fileMultiple;
//   }
//   return multiple;
// });

// _Vue onMounted
onMounted(() => init);

defineExpose({ setEditorValue, getEditorValue, insertTextAtCursor });

// _Expose 获取数据
function getEditorValue() {
  return editor.txt.html();
}

// _Expose 设置数据
function setEditorValue(value) {
  editor?.txt?.html(value);
}

// _Expose 把数据插入到光标位置
function insertTextAtCursor(text) {
  // 通知编辑器更新内部状态
  editor.cmd.do("insertHTML", text);
}

// _Function 创建按钮
function createBtnClass({ name, icon, target }) {
  if (!inBrowser) return;
  const E = window.wangEditor;
  const { BtnMenu } = E;
  class NewBtnMenu extends BtnMenu {
    constructor(editor) {
      const $elem = E.$(
        `<div class="w-e-menu" data-title="${name}">
        <span class="m-iconfont m-iconfont_icon icon-${icon}"  ></span>
            </div>`
      );
      super($elem, editor);
    }
    clickHandler() {
      target();
    }
    // 菜单是否被激活（如果不需要，这个函数可以空着）
    // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
    // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
    tryChangeActive() {
      // 激活菜单
      // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
      // 2. this.this.isActive === true
      this.active();

      // // 取消激活菜单
      // // 1. 菜单 DOM 节点会删掉 .w-e-active
      // // 2. this.this.isActive === false
      // this.unActive()
    }
  }
  return NewBtnMenu;
}

// _Function 初始化
function init(callback?: Function) {
  if (!inBrowser) return;
  const E = window.wangEditor;
  if (!E) {
    if (indexTry > maxTry) return;
    indexTry++;
    return setTimeout(() => {
      init(callback);
    }, 1000);
  }
  if (!editor?.config) {
    editor = new E(`#${props.id}-m-editor-index`);
    editor.config.menus = [
      "head",
      "bold",
      "fontSize",
      "fontName",
      "italic",
      "underline",
      "strikeThrough",
      "indent",
      "lineHeight",
      "foreColor",
      "backColor",
      "link",
      "upImage",
      "list",
      "todo",
      "justify",
      "quote",
      "table",
      "code",
      "splitLine",
      "undo",
      "redo"
    ];
    editor.config.excludeMenus = ["emoticon", "video", "image"];

    for (let index = 0; index < defaultBtn.length; index++) {
      const element = defaultBtn[index];
      editor.menus.extend(element.key, createBtnClass(element));
      editor.config.menus.push(element.key);
    }
    if (props.exButton) {
      for (let index = 0; index < props.exButton.length; index++) {
        const element = props.exButton[index];
        const _key = randChar();
        editor.menus.extend(_key, createBtnClass(element));
        editor.config.menus.push(_key);
      }
    }

    editor.create();
  }
  if (callback) callback();
}

// _Function 保存源码
function setEditorCode() {
  editor.txt.html(editCode.value);
  visibleCode.value = false;
  editCode.value = "";
}

// _Function 上传文件配置头
function setHeader() {
  const token = uploadConfig.value.token;
  const Version = uploadConfig.value.version;
  if (token) {
    return { Authorization: `Bearer ${token}`, Version };
  }
  return {};
}

// _Function 发起请求
function actionRequest() {
  ajaxOptions.ajaxFileList = ajaxFileList;
  ajaxUpload(ajaxOptions);
}

// _Function 请求Ajax
async function httpRequest(options) {
  const { filename, file } = options;
  ajaxFileList.push({ filename, file });
  ajaxOptions = options;
  _debounce();
}

// _Function 上传前钩子
function beforeUpload(fileList: { name: string; size: number }[]) {
  loading.value = true;

  if (!uploadConfig.value.token) {
    ElMessage.error({ message: `上传文件配置错误！` });
    return false;
  }

  for (let i = 0; i < fileList.length; i++) {
    const files = fileList[i];

    //获取最后一个.的位置
    const index = files.name.lastIndexOf(".");
    //获取文件后缀
    const ext = files.name.substring(index).toLowerCase();
    const size = files.size;

    const _excludeType = excludeType.value.split(",");
    if (!!excludeType.value && _excludeType && _excludeType.length && _excludeType.indexOf(String(ext)) > -1) {
      ElMessage.error({ message: `不可上传${_excludeType.join(" ")}类型的文件` });
      return false;
    }

    const _includeType = accept.value.split(",");
    if (!!accept.value && _includeType && _includeType.length && _includeType.indexOf(String(ext)) < 0) {
      ElMessage.error({ message: `请上传${_includeType.join(" ")}类型的文件` });
      return false;
    }

    if (props.upImageConfig) {
      if (props.upImageConfig.fileSingleSize && size / 1024 > props.upImageConfig.fileSingleSize) {
        ElMessage.error({ message: `上传文件过大，文件大小：${(size / 1024 / 1024).toFixed(2)}M` });
        return false;
      }

      // const allSize = fileList.reduce((prev, cur) => prev + cur.size, 0);
      // if (props.upImageConfig.fileAllSize && allSize / 1024 > props.upImageConfig.fileAllSize) {
      //   ElMessage.error({ message: `上传文件总体过大，单次总文件大小：${(allSize / 1024 / 1024).toFixed(2)}M` });
      //   return false;
      // }
    }
  }
  return true;
}

// _Function 文件选择
function fileChange(uploadFile, uploadFiles) {
  if (loading.value || !uploadFiles.length) return;
  uploadFilesList.push(uploadFile);
  fetchUpload();
}

// _Function 上传成功
function handleSuccess(response: { Code: Number; Data: fileType[] }) {
  if (!response) return;

  const { Code, Data } = response;
  if (Code == 200 && Data && Data?.length) {
    for (let index = 0; index < Data.length; index++) {
      const element = Data[index];
      const Text = `<img src='${element.FileUrl}' name='${element.OriginalName}'></img>`;
      insertTextAtCursor(Text);
      // editor.txt.append(`<img src='${element.FileUrl}' name='${element.OriginalName}'></img>`);
    }

    uploadFilesList.length = 0;
    ajaxFileList.length = 0;
    uploadRef?.value?.clearFiles();
    loading.value = false;
  } else {
    ElMessage.error({ message: `上传失败` });
    uploadFilesList.length = 0;
    ajaxFileList.length = 0;
    uploadRef?.value?.clearFiles();
    loading.value = false;
  }
}

// _Function 上传失败
function handleError() {
  uploadFilesList.length = 0;
  ajaxFileList.length = 0;
  uploadRef?.value?.clearFiles();
  ElMessage.error({ message: `上传失败` });
  loading.value = false;
}

// _Watch defaultValue
watch(
  () => props.defaultValue,
  data => {
    nextTick(() =>
      init(() => {
        editor?.txt?.html(data);
      })
    );
  },
  { immediate: true }
);
</script>

<style lang="scss">
@import "../m-icon/iconfont/iconfont.css";
@import "@/styles/mp.scss";
@import "@/styles/flex.scss";
.m-icon {
  display: inline-block;
}
.m-iconfont_icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: inherit;
  line-height: 1em;
}

.m-editor {
  position: relative;
  transform: translateZ(1px);

  .w-e-toolbar,
  .w-e-text-container,
  .w-e-dp-title,
  .w-e-list,
  .w-e-droplist,
  .w-e-panel-container {
    background-color: var(--el-bg-color) !important;
    border-color: var(--el-border-color-lighter) !important;
    z-index: initial !important;
  }

  .w-e-menu-tooltip {
    font-size: 12px;
    padding: 2px 10px;
  }
  .w-e-toolbar {
    .w-e-menu {
      position: inherit;
      border-radius: 3px;
      i {
        color: inherit;
      }
      .m-iconfont {
        font-size: 20px;
      }
      .w-e-panel-container {
        position: fixed;
        margin: 0px !important;
        border: 1px solid var(--el-color-primary) !important;
        margin-left: 0% !important;
        margin-top: 0% !important;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999 !important;
        color: inherit;
        .w-e-panel-tab-title {
          border-bottom: 1px solid var(--el-color-primary) !important;
        }
        .w-e-panel-container {
          color: var(--el-text-color-regular) !important;
        }
      }
    }
    .w-e-active {
      i {
        color: var(--el-color-primary);
      }
    }
    .w-e-menu:hover {
      color: var(--el-text-color-regular) !important;
      background-color: var(--el-color-primary-light-9) !important;
      i {
        color: var(--el-text-color-regular);
      }
    }
    .w-e-item {
      color: var(--el-text-color-regular) !important;
      border: 1px solid rgba(0, 0, 0, 0) !important;
      p > i {
        display: none !important;
        // color: var(--el-text-color-regular) !important;
      }
      &:hover {
        color: var(--el-text-color-regular) !important;
        background-color: rgba(0, 0, 0, 0) !important;
        border: 1px solid var(--el-color-primary) !important;
        border-radius: 4px;
      }
    }
    .w-e-droplist {
      width: 135px !important;
      // background-color: #bebebe !important;
      .w-e-block {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        .w-e-item {
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .w-e-list {
      .w-e-item {
        margin: 0 !important;
        padding: 0 !important;
        h1,
        h2,
        h3,
        h4,
        h5,
        p,
        span {
          display: block;
          padding: 2px 0;
          font-size: 15px !important;
          line-height: 30px !important;
          letter-spacing: 2px;
          border-bottom: 1px solid var(--el-border-color-lighter) !important;
        }
        &:last-child {
          h1,
          h2,
          h3,
          h4,
          h5,
          p {
            border-bottom: none !important;
          }
        }
      }
    }
  }
  .w-e-dp-title {
    margin: 0;
    font-size: 14px !important;
    font-weight: bold;
    letter-spacing: 3px;
    color: var(--el-color-primary) !important;
  }
  .w-e-list {
    padding: 0;
    margin: 0;
    max-height: 250px;
    overflow: scroll;
    .w-e-item {
      color: var(--el-text-color-regular) !important;
      &:hover {
        color: var(--el-text-color-regular) !important;
        background-color: var(--el-color-primary-light-9) !important;
      }
    }
  }
  .w-e-panel-tab-title {
    padding-left: 0;
    border-color: var(--el-border-color-lighter) !important;
  }
  .w-e-panel-container {
    box-shadow: none !important;
    input {
      color: var(--el-text-color-regular) !important;
      border-color: var(--el-border-color-lighter) !important;
    }
  }
  .w-e-button-container {
    button {
      padding: 0 !important;
      margin: 0;
      color: var(--el-color-primary) !important;
      font-weight: bold;
      background-color: inherit !important;
    }
  }
  .w-e-text {
    blockquote {
      border-left: 8px solid var(--el-color-primary);
      background-color: var(--el-fill-color-light);
    }
  }
  .w-e-text-container {
    p {
      font-size: 13px !important;
    }
  }
}

.m-editor_small {
  .w-e-toolbar {
    .w-e-menu {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }
    .w-e-droplist {
      width: 120px !important;
    }
    .w-e-dp-title {
      font-size: 12px !important;
    }
    .w-e-list {
      .w-e-item {
        margin: 0 !important;
        padding: 0 !important;
        h1,
        h2,
        h3,
        h4,
        h5,
        p,
        span {
          display: block;
          padding: 2px 0;
          font-size: 12px !important;
          line-height: 20px !important;
          letter-spacing: 2px;
          border-bottom: 1px solid var(--el-border-color-lighter) !important;
        }
        &:last-child {
          h1,
          h2,
          h3,
          h4,
          h5,
          p {
            border-bottom: none !important;
          }
        }
      }
    }
  }
}

.hide-el {
  position: fixed;
  top: -9999px;
  opacity: 0;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
