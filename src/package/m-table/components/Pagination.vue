<template>
  <!-- 分页组件 -->
  <el-pagination
    class="m-table-pagination"
    :background="true"
    :current-page="pageable.pageNum"
    :page-size="pageable.pageSize"
    :page-sizes="pageable.pageSizes"
    :total="pageable.total"
    :pager-count="exPagination?.pagerCount ? exPagination?.pagerCount : useFooterCenter ? 5 : 5"
    :layout="
      exPagination.layout
        ? exPagination.layout
        : useFooterCenter
        ? 'total, sizes, prev, pager, next'
        : 'total, sizes, prev, pager, next, jumper'
    "
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    small
  ></el-pagination>
</template>

<script setup lang="ts" name="Pagination">
// _Import
import { PaginationPropsType } from "../type";

defineProps<PaginationPropsType>();
</script>

<style lang="scss">
.m-table-pagination {
  .el-pagination__total {
    transform: scale(1.1);
  }
  .el-select {
    width: 84px;
  }
  .el-pagination__sizes {
    margin-left: 10px;
  }
  .btn-prev {
    margin-left: 10px !important;
  }
}
</style>
