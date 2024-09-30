const s = "success";
const i = "info";
const w = "warning";
const n = "";
const d = "danger";

export default {
  // 审批状态
  ProcessStatus: [n, w, s, d, i],

  // 有效/无效
  ValidOrInvalid: [s, w],

  // 入库-产品状态
  "warehousing-InboundHandlerStatus": [i, w, s, d, w, n, s, i],
  // 入库-入库类型
  "warehousing-InboundType": [n, s, d, w, i, s],
  // 入库-状态
  "warehousing-Status": [i, w, s],

  // 出库类型
  "outbound-OutboundType": [n, s, w, d, n, i, s],
  // 出库状态
  "outbound-OutboundHandlerStatus": [i, s, w, d],

  // 申诉入库-单据状态
  "appeal-Status": [i, w, s, d, w, i],

  // 已绑定经销商-单据状态
  "distributorBinding-Status": [i, w, s, d],
  // 新增二级经销商-单据状态
  "distributorSecondary-Status": [i, w, s, d],

  // 医院列表-单据状态
  "hospitalList-Status": [i, w, s, d],

  // 仓储管理——库存管理-产品类型
  "inventoryProductCount-SmartLabelStockCodeType": [s, n],

  // 仓储管理——库存管理-追溯码状态
  "inventoryProductInfo-Status": [i, s, s, i, n, n, s, d, w, s, s, d],

  // 公告状态
  "dealer-setting-notice-Status": [w, s],

  // 盘库单条数据状态
  "warehouse-inventory-Status": [s, i, n, d],

  // 盘库单条数据状态
  "warehouse-inventoryapply-Status": [i, w, n, n, n, s, d],

  // 盘库单条系统流转状态
  "warehouse-inventoryStatistics-Status": [i, s, s, i, d, w, i, s, d, i, s, i, s],

  // 盘库单条系统封版流转状态
  "warehouse-inventoryStatisticsSealing-Status": [i, s, s, i, d, w, i, s, d, i, s, i, s],

  // 批量导入状态
  "bulk-export-list-Status": [i, w, s, n, d],

  // 盘库-数据类型
  "inventory-InventoryStatisticsDataType": [s, n],

  // 全局-包含下级码
  "all-table-IncludeSubLabelCode": [s, w],
  "all-table-SystemYesOrNo": [s, w],

  //无码出库-是否不可流通
  "outbound-nocode-IsInventoryNonNegotiable": [d, s],

  // 系统操作日志状态
  "system-business-operation-log-OperationStatus": [s, d, w],

  "system-business-operation-log-SystemClientType": [n, s, i],

  "inventory-check-Status": [i, i, w, n, s, i],
  //盘库类型
  "warehouse-inventory-type-DataType": [s, d],

  //盘库贝朗端处理状态
  "warehouse-inventorybbrauns-BBraunHandlerStatus": [s, i],

  // 自盘库单条数据状态
  "inventory-warehouse-Status": [i, s, n, d]
};
