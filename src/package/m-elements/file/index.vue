<!--
 * @ Author: Cai
 * @ Create Time: 2024-03-12 09:10:00
 * @ Modified by: Cai
 * @ Modified time: 2024-09-03 16:59:45
 * @ Description: page name: m-element-file
 -->

<template>
  <template v-if="item.prop">
    <div class="flex-col">
      <template v-if="fileConfigData.fileApi?.url">
        <div class="flex-center-start mb5" v-if="!item.display">
          <el-upload
            class="m-upload-btn"
            ref="uploadRef"
            :action="fileConfigData.fileApi.url"
            :show-file-list="false"
            :data="item?.fileAttached"
            :on-success="files => handleSuccess(item.prop, files)"
            :on-error="files => handleError()"
            :on-change="fileChange"
            :accept="accept"
            :headers="setHeader()"
            :multiple="fileMultiple ? fileMultiple > 1 : false"
            :http-request="httpRequest"
            :auto-upload="false"
          >
            <m-button
              title="点击上传"
              class="btn-width mr0"
              is="upload"
              :loading="loading"
              :disabled="item.disabled || (fileMultiple ? fileMultiple == data[item.prop]?.length : false)"
            >
              {{ !item?.disabled && item?.placeholder ? item?.placeholder : "点击上传" }}
            </m-button>
          </el-upload>
          <m-button
            v-if="data[item.prop]?.length && !item.display"
            title="清空已添加文件"
            class="btn-width ml5"
            is="trash"
            link
            :disabled="item.disabled"
            @click="cleanFiles"
          >
            清空
          </m-button>
        </div>

        <div
          class="tips-box"
          v-if="accept || excludeType || (fileMultiple && fileMultiple > 1) || item.fileSingleSize || item.fileAllSize"
        >
          <span v-if="accept">
            可上传 <span class="light-text">{{ accept }}</span> 类型文件
          </span>

          <span v-if="excludeType">
            不可上传 <span class="light-text">{{ excludeType }}</span> 类型文件
          </span>

          <span v-if="fileMultiple && fileMultiple > 1">
            最多上传 <span class="light-text">{{ fileMultiple }}个</span> 文件
          </span>

          <span v-if="item.fileSingleSize">
            单文件最大 <span class="light-text">{{ item.fileSingleSize ? (item.fileSingleSize / 1024).toFixed(2) : 1 }}M</span>
          </span>

          <span v-if="item.fileAllSize">
            单次总文件最大 <span class="light-text">{{ item.fileAllSize ? (item.fileAllSize / 1024).toFixed(2) : 1 }}M</span>
          </span>
        </div>

        <div class="file-item-box">
          <template v-for="(file, index) in data[item.prop]" :key="file.FileId">
            <m-button line @click="openFile(file)" is="download">
              <span class="flex-center download-file">
                <div class="download-file_text">{{ file.OriginalName || file.FileName }}</div>
                <m-icon
                  v-if="!item.display && !item.disabled"
                  title="点击删除"
                  class="hand ml5 remove-btn"
                  name="close_circle_line"
                  @click="removeFile(item.prop, index)"
                />
              </span>
            </m-button>
          </template>
        </div>
      </template>

      <div class="file-item-box" :class="['contrast-value']" v-if="alwaysContrast || eq(item.prop, data, contrastData)">
        <template v-for="file in data[item.prop]" :key="file.FileId">
          <m-button line @click="openFile(file)" is="download">
            {{ file.OriginalName || file.FileName }}
          </m-button>
        </template>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import lodashPkg from "lodash";
import { MElementFileType } from "./index";
import { ElMessage, ElMessageBox } from "element-plus";
import { useDownload } from "./use-download";
import { ajaxUpload } from "./ajax";
import { Obj } from "@/package/global";
import { useBaseStore as globalState } from "@/package/store/index";

const { isEqual, debounce } = lodashPkg;

type fileType = { FileUrl?: string; OriginalName?: string; FileName?: string };

type Props = {
  item: MElementFileType;
  data?: {};
  contrastData?: {};
  alwaysContrast?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  contrastData: () => ({}),
  includeType: () => ({})
});

// >-------------> 文件数量 <------------<
const fileConfigData = computed(() => {
  const useGlobalState = globalState();
  const headerData = useGlobalState.getRequestHeader;
  const fileApi = useGlobalState.getFormConfig?.fileApi;
  return { headerData, fileApi };
});
// >-------------> 文件数量 <------------<
const fileMultiple = computed(() => {
  let multiple: number | undefined = undefined;
  const { fileMultiple } = props.item;
  if (fileMultiple) multiple = fileMultiple;
  return multiple;
});

// >-------------> 允许类型 <------------<
const accept = computed(() => {
  let accept: string | undefined = undefined;
  const { fileIncludeType } = props.item;
  if (fileIncludeType && Array.isArray(fileIncludeType)) accept = fileIncludeType.join(",");
  return accept?.toLowerCase() || "";
});

// >-------------> 不允许类型 <------------<
const excludeType = computed(() => {
  let exType: string | undefined = undefined;
  const { fileExcludeType } = props.item;
  if (fileExcludeType && Array.isArray(fileExcludeType)) exType = fileExcludeType.join(",");
  return exType?.toLowerCase() || "";
});

const emit = defineEmits(["change", "changeState"]);
const uploadRef = ref();
const loading = ref(false);
const uploadFilesList: { name: string; size: number }[] = [];
const ajaxFileList: Obj[] = [];

function changeEvent(value, item) {
  emit("change", { value, item });
}

const setHeader = () => {
  const data = {};
  if (fileConfigData.value.headerData) {
    for (const key in fileConfigData.value.headerData) {
      data[key] = fileConfigData.value.headerData[key];
    }
  }
  return data;
};

// >-------------> 上传成功 <------------<
const handleSuccess = (prop = "", response: { Code: Number; Data: fileType }) => {
  if (!prop) return ElMessage.error({ message: `上传失败` });
  if (!response) return;

  const { Code, Data } = response;
  if (Code == 200) {
    if (!props.data[prop]) {
      props.data[prop] = [];
    }
    if (Array.isArray(Data)) {
      const _Data = Data.map(item => {
        return {
          ...item,
          FileName: item.OriginalName || item.FileName,
          FullPath: fileConfigData.value.fileApi?.fileApi + item.FileUrl
        };
      });
      props.data[prop].push(..._Data);
    } else {
      props.data[prop].push({
        ...Data,
        FileName: Data.OriginalName || Data.FileName,
        FullPath: fileConfigData.value.fileApi?.fileApi || "" + Data.FileUrl
      });
    }

    changeEvent(props.data[prop], props.item);
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
};

// >-------------> 上传失败 <------------<
const handleError = () => {
  uploadFilesList.length = 0;
  ajaxFileList.length = 0;
  uploadRef?.value?.clearFiles();
  ElMessage.error({ message: `上传失败` });
  loading.value = false;
};

// >-------------> 文件选择 <------------<
const fileChange = (uploadFile, uploadFiles) => {
  if (loading.value || !uploadFiles.length) return;
  uploadFilesList.push(uploadFile);
  fetchUpload();
};

// >-------------> 上传前钩子 <------------<
const beforeUpload = (fileList: { name: string; size: number }[]) => {
  loading.value = true;
  const prop = props?.item?.prop;
  if (!prop) return false;
  if (!fileConfigData.value.fileApi) {
    ElMessage.error({ message: `上传文件配置错误！` });
    return false;
  }
  const defaultData = props.data[prop] || [];
  if (fileMultiple.value && fileMultiple.value > 1 && [...fileList, ...defaultData].length > fileMultiple.value) {
    ElMessage.warning({ message: `上传文件限制数量${fileMultiple.value}个` });
    return false;
  } else {
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

      if (props.item.fileSingleSize && size / 1024 > props.item.fileSingleSize) {
        ElMessage.error({ message: `上传文件过大，文件大小：${(size / 1024 / 1024).toFixed(2)}M` });
        return false;
      }

      const allSize = fileList.reduce((prev, cur) => prev + cur.size, 0);
      if (props.item.fileAllSize && allSize / 1024 > props.item.fileAllSize) {
        ElMessage.error({ message: `上传文件总体过大，单次总文件大小：${(allSize / 1024 / 1024).toFixed(2)}M` });
        return false;
      }
    }
    return true;
  }
};

// >-------------> 接口请求 <------------<
let ajaxOptions: Obj = {};

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

const _debounce = debounce(actionRequest, 100, { trailing: true });
function actionRequest() {
  ajaxOptions.ajaxFileList = ajaxFileList;
  ajaxUpload(ajaxOptions);
}

const httpRequest = async options => {
  const { filename, file } = options;
  ajaxFileList.push({ filename, file });
  ajaxOptions = options;
  _debounce();
};

const cleanFiles = () => {
  if (props?.item?.prop) {
    ElMessageBox.confirm("是否删除当前已选文件?", "温馨提示", {
      type: "warning",
      confirmButtonText: "确认删除"
    }).then(() => {
      if (props?.item?.prop) props.data[props.item.prop].length = 0;
    });
  }
};

// >-------------> 删除文件 <------------<
const removeFile = (prop = "", index: number) => {
  if (!prop) return;
  props.data[prop].splice(index, 1);

  changeEvent(props.data[prop], props.item);
};

function openFile(file: fileType) {
  if (file.FileUrl) {
    useDownload(file.FileUrl, file.OriginalName || file.FileName);
  }
}

function eq(prop, data, contrastData) {
  if (!prop || !contrastData || !contrastData[prop] || !Array.isArray(contrastData[prop])) return false;

  const _contrastData = contrastData[prop].filter(value => value !== null && typeof value !== "undefined");

  if (_contrastData && _contrastData.length == 0) {
    return false;
  }

  return !isEqual(data[prop], _contrastData);
}

watch(
  () => loading.value,
  data => {
    emit("changeState", data ? "Working" : "Pending");
  }
);
</script>

<style lang="scss" scoped>
@import "../index.scss";

.file-item-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;

  .download-file {
    .download-file_text {
      word-break: break-all;
      display: inline-block;
      white-space: pre-line;
    }

    .remove-btn {
      display: none;
    }

    &:hover {
      .remove-btn {
        display: block;
      }
    }
  }
}
.file-item {
  padding: 5px 8px;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 12px;
  line-height: 1.5em;
  transition: 0.3s;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  background-color: var(--el-disabled-bg-color);
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-color-primary)) inset;
  }
}
.hand {
  font-size: 14px;
  &:hover {
    color: var(--el-color-error);
    cursor: pointer;
  }
}
.light-text {
  color: var(--el-color-primary);
}
.tips-box + .file-item-box {
  margin-top: 3px;
}
.tips-box:has(span) + .file-item-box {
  margin-top: 0;
}
.tips-box {
  padding-top: 2px;
  font-size: 12px;
}
</style>

<style lang="scss">
.download-message-info {
  position: fixed;
  .el-notification__icon {
    display: none;
  }
  .el-notification__title {
    padding-left: 22px;
  }
  .download-message {
    padding-left: 22px;
    .m-iconfont_icon {
      position: absolute;
      left: 15px;
      top: 15px;
      font-size: 22px;
      animation: loadings 1s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  }
}

@keyframes loadings {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0);
  }
}
// .m-upload-btn {
//   .m-button {
//     padding: 8px 11px;
//     height: max-content;
//   }
// }
</style>
