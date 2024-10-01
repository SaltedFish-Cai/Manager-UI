import { ElMessageBox, ElNotification } from "element-plus";
import inBrowser from "@/package/tools/inBrowser";
import { useBaseStore as globalState } from "@/package/store/index";

/**
 * @description 接收数据流生成 blob，创建链接，下载文件
 * @param {String} path 下载文件地址 (必传)
 * @param {Boolean} isNotify 是否有导出消息提示 (默认为 true) (必传)
 * @param {String} exFileName 外置下载文件名称
 * */

export const useDownload = async (path: string, exFileName?: string) => {
  const useGlobalState = globalState();
  const megNotify: any = ElNotification({
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    message:
      "<div class='download-message'><span class='m-iconfont m-iconfont_icon icon-loading_line'></span>如果数据庞大会导致下载缓慢，请您耐心等待！</div>",
    type: "info",
    duration: 0,
    customClass: "download-message-info"
  });

  try {
    const headerData = useGlobalState.getRequestHeader;
    const fileApi = useGlobalState.getFormConfig?.fileApi;

    const headers = {};
    if (headerData) {
      for (const key in headerData) {
        headers[key] = headerData[key];
      }
    }
    const _path = (fileApi?.downloadApi || "") + path;
    fetch(`${_path}`, {
      method: "GET",
      mode: "cors",
      headers
    }).then(response => {
      // 切割出文件名
      const fileNameEncode = response.headers.get("content-disposition")?.split("filename=")[1];
      // 解码
      const fileName = (fileNameEncode && decodeURIComponent(fileNameEncode)) || exFileName || "下载文件";
      if (response.status != 200) {
        megNotify?.close();
        ElNotification({
          title: "下载出错",
          message: response.statusText,
          type: "error",
          duration: 3000
        });
      } else if (response.headers.get("Content-Type")?.includes("application/json")) {
        response.json().then(json => {
          if (json.Message == "当前页面过期") {
            megNotify?.close();
            ElMessageBox({
              title: "当前页面过期",
              message: "当前页面已过期",
              showCancelButton: false,
              callback: () => {
                location.reload();
              }
            });
          } else if (json.Message == "批量导出") {
            megNotify?.close();
            ElNotification({
              title: "温馨提示",
              message: "数据量过大，请至【导出管理-导出记录】中进行查看导出进度",
              type: "warning",
              duration: 10000
            });
          } else {
            megNotify?.close();
            ElNotification({
              title: "下载出错",
              message: json.Message,
              type: "error",
              duration: 3000
            });
          }
        });
      } else {
        megNotify?.close();
        ElNotification({
          title: "下载成功",
          message: `请注意下载文件内容，文件名(${fileName})`,
          type: "success",
          duration: 3000
        });
      }
      if (inBrowser) {
        response.blob().then(res => {
          // 兼容 edge 不支持 createObjectURL 方法
          if ("msSaveOrOpenBlob" in navigator) {
            const _navigator: any = window.navigator;
            return _navigator.msSaveOrOpenBlob(res, `${fileName}` || `${new Date().getTime()}.xlsx`);
          }
          const blobUrl = window.URL.createObjectURL(res);
          const exportFile = window.document.createElement("a");
          exportFile.style.display = "none";
          exportFile.download = `${fileName}` || `${new Date().getTime()}.xlsx`;
          exportFile.href = blobUrl;
          window.document.body.appendChild(exportFile);
          exportFile.click();
          // 去除下载对 url 的影响
          window.document.body.removeChild(exportFile);
          window.URL.revokeObjectURL(blobUrl);
        });
      }
    });
  } catch (error) {
    window.log.error(String(error));
  }
};
