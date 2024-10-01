<template>
  <el-row class="mb-4">
    <m-button font="star_arc_line" size="large" :plain="false">Primary</m-button>
    <m-button font="star_arc_line" size="default" :plain="false">Success</m-button>
    <m-button font="star_arc_line" size="small" :plain="false">Info</m-button>
  </el-row>

  <el-row class="mb-4">
    <m-button font="star_arc_line" size="large">Primary</m-button>
    <m-button font="star_arc_line">Success</m-button>
    <m-button font="star_arc_line" size="small">Info</m-button>
  </el-row>

  <el-row class="mb-4">
    <m-button font="star_arc_line" size="large" round>Primary</m-button>
    <m-button font="star_arc_line" size="default" round>Success</m-button>
    <m-button font="star_arc_line" size="small" round>Info</m-button>
  </el-row>

  <el-row class="mb-4">
    <m-button font="star_arc_line" size="large" round />
    <m-button font="star_arc_line" size="default" round />
    <m-button font="star_arc_line" size="small" round />
  </el-row>

  <el-row>
    <m-button font="star_arc_line" circle size="large" />
    <m-button font="star_arc_line" size="default" circle />
    <m-button font="star_arc_line" circle size="small" />
  </el-row>
</template>

<script lang="ts" setup></script>

<style>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
