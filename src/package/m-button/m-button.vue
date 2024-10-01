<template>
  <el-button
    v-bind="state.buttonConfig || props"
    :loading="loading || state.isLoading"
    @click="btnClick"
    :class="['m-button', props.line ? 'is-line is-link' : '']"
    :disabled="disabled"
    :size="baseSize"
  >
    <m-icon
      v-if="position == 'left' && !loading && !state.isLoading && useFont"
      :name="state.buttonConfig.font"
      class="btn-icon"
      :class="[state.slotsLength ? 'mr4' : '']"
    ></m-icon>
    <span v-if="state.slotsLength"> <slot></slot> </span>
    <m-icon v-if="position == 'right' && useFont" :name="state.buttonConfig.font" class="ml4 btn-icon"></m-icon>
  </el-button>
</template>

<script lang="ts" setup>
// _Import
import { reactive, computed, onBeforeMount, useSlots, nextTick, watch } from "vue";
import lodashPkg from "lodash";
import { useBaseStore } from "../store/index";
import { MButtonType } from "./type";
import inBrowser from "@/package/tools/inBrowser";

// _Var
const { debounce } = lodashPkg;
const props = withDefaults(defineProps<MButtonType>(), {
  debounced: true,
  debouncedTime: 800,
  disabled: false,
  position: "left",
  loading: false,
  line: false,
  loadingBy: "#nprogress",
  useFont: true
});

const emit = defineEmits(["click"]);

const state = reactive({
  id: new Date().getTime() + Math.random(),
  maskVisible: false,
  slotsLength: 0,
  isLoading: false,
  buttonConfig: { font: "", type: undefined, plain: true, size: "default" } as any
});
const globalState = useBaseStore();

// _Computed baseSize
const baseSize = computed(() => {
  if (props.size) {
    return props.size;
  } else {
    return globalState.getSize || "default";
  }
});

// _Vue onBeforeMount
onBeforeMount(() => {
  const slots = useSlots();
  state.slotsLength = slots.default ? 1 : 0;
  if (props.font) state.buttonConfig.font = props.font;
  if (props.type) state.buttonConfig.type = props.type;
  if (props.line) state.buttonConfig.type = "info";
});

// _Function 点击按钮
const _debounce = debounce(realClick, props.debouncedTime, { trailing: true });
function btnClick() {
  if (props.disabled) return;
  if (props.debounced) _debounce();
  else realClick();
  // toolsStore.setButtonLoadingId(String(state.id));
}

// _Function 实际点击（Loading）
let lock = false;
function realClick() {
  if (lock) return;
  emit("click");
  lock = true;

  nextTick(() => {
    const EL = window.document.querySelector(props.loadingBy);
    if (EL && inBrowser) {
      state.isLoading = true;

      // 锁死保险
      const safeLock = setTimeout(() => {
        state.isLoading = false;
        observer?.disconnect && observer?.disconnect();
      }, 30000);

      const config = { childList: true };
      const callback = () => {
        const EL = window.document.querySelector(props.loadingBy);
        if (!EL) {
          clearTimeout(safeLock);
          state.isLoading = false;
          observer?.disconnect && observer?.disconnect();
          return;
        }
      };
      const observer = new window.MutationObserver(callback);
      const Body = document.body;
      if (EL) observer.observe(Body, config);
    }
    setTimeout(() => {
      lock = false;
    }, 1000);
  });
}

// _Watch 处理 is
watch(
  () => props.is,
  text => {
    const config = {
      type: "primary",
      plain: true,
      font: "",
      color: ""
    };
    if (text) {
      switch (text) {
        case "search":
          config.font = "search_line";
          break;
        case "view":
          config.font = "document_query_line";
          config.type = "default";
          break;
        case "add":
          config.font = "add_circle_line";
          break;
        case "edit":
          config.font = "edit_line";
          break;
        case "check":
          config.font = "file_save_line";
          break;
        case "save":
          config.font = "save_line";
          break;
        case "submit":
          config.font = "send_plane_line";
          break;
        case "upload":
          config.font = "upload_line";
          config.type = "default";
          break;
        case "download":
          config.font = "download_line";
          config.type = "default";
          break;
        case "remove":
          config.font = "close_circle_line";
          config.type = "danger";
          break;
        case "trash":
          config.font = "trash_line";
          config.type = "danger";
          break;
        case "refresh":
          config.font = "refresh_line";
          config.type = "warning";
          break;
        case "go":
          config.font = "finger_press_line";
          break;
        case "file":
          config.font = "attachment_line";
          config.type = "default";
          break;
        case "time":
          config.font = "time_line";
          config.type = "default";
          break;
        case "switch":
          config.font = "switch_horizontal_line";
          config.type = "warning";
          break;
        case "sync":
          config.font = "refresh_arrows_line";
          break;
        case "import":
          config.font = "entrance_line";
          config.type = "default";
          break;
        case "export":
          config.font = "exit_line";
          config.type = "default";
          break;
        case "ok":
          config.font = "check_circle_line";
          config.type = "success";
          break;
        case "cancel":
          config.font = "close_circle_line";
          config.type = "warning";
          break;
        case "more":
          config.font = "version_line";
          config.type = "warning";
          // config.color = "#026ccf";
          // config.plain = false;
          break;
        default:
          break;
      }
    }
    state.buttonConfig = config;
  },
  { immediate: true }
);

// _Watch 处理 font
watch(
  () => props.font,
  text => {
    if (text) state.buttonConfig.font = text;
  },
  { immediate: true }
);

// _Watch 处理 type
watch(
  () => props.type,
  text => {
    if (text) state.buttonConfig.type = text;
  },
  { immediate: true }
);
</script>

<style lang="scss">
@import "@/styles/mp.scss";
@import "@/styles/flex.scss";

.m-button.el-button.el-button--large {
  padding: 12px 19px !important;
  margin: 0 6px;
}

.m-button.el-button {
  padding: 8px 12px;
  margin: 0 4px;
  height: var(--el-component-base-size-default);
  .btn-icon {
    font-size: var(--el-font-base-size-default) !important;
  }
}

.m-button.el-button.el-button--small {
  padding: 5px 9px !important;
  margin: 0 3px;
}

.el-button.is-link.el-button--large {
  padding: 6px 10px !important;
}

.el-button.is-link {
  padding: 4px 8px !important;
}

.el-button.is-link.el-button--small {
  padding: 2px 4px !important;
}

.m-button.is-line {
  border-bottom: 1px solid !important;
  border-radius: 0;
  min-height: var(--el-component-base-size-default);
  height: auto;
  color: var(--el-text-color-regular);

  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary);
  }
}

.m-button {
  & > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .in_block {
    width: initial;
    height: initial;
  }
  .btn-icon {
    font-size: 15px;
  }
}

.el-message-box:has(.el-message-box-icon--error) {
  .el-button--primary {
    background-color: var(--el-color-error) !important;
    border-color: var(--el-color-error) !important;
  }
}
.el-message-box:has(.el-message-box-icon--warning) {
  .el-button--primary {
    background-color: var(--el-color-warning) !important;
    border-color: var(--el-color-warning) !important;
  }
}
.el-message-box:has(.el-message-box-icon--success) {
  .el-button--primary {
    background-color: var(--el-color-success) !important;
    border-color: var(--el-color-success) !important;
  }
}

.el-button {
  font-size: var(--el-font-base-size-default) !important;
}
</style>
