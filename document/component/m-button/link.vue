<template>
  <el-row class="mb-4">
    <m-button font="star_arc_line" link :plain="false" type="primary">Primary</m-button>
    <m-button font="star_arc_line" link :plain="false" type="success">Success</m-button>
    <m-button font="star_arc_line" link :plain="false" type="info">Info</m-button>
    <m-button font="star_arc_line" link :plain="false" type="warning">Warning</m-button>
    <m-button font="star_arc_line" link :plain="false" type="danger">Danger</m-button>
  </el-row>

  <el-row class="mb-4">
    <m-button font="star_arc_line" link disabled type="primary">Primary</m-button>
    <m-button font="star_arc_line" link disabled type="success">Success</m-button>
    <m-button font="star_arc_line" link disabled type="info">Info</m-button>
    <m-button font="star_arc_line" link disabled type="warning">Warning</m-button>
    <m-button font="star_arc_line" link disabled type="danger">Danger</m-button>
  </el-row>
</template>

<script lang="ts" setup></script>

<style>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
