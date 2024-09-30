<template>
  <el-row class="mb-4">
    <m-button font="star_arc_line" disabled :plain="false" type="primary">Primary</m-button>
    <m-button font="star_arc_line" disabled :plain="false" type="success">Success</m-button>
    <m-button font="star_arc_line" disabled :plain="false" type="info">Info</m-button>
    <m-button font="star_arc_line" disabled :plain="false" type="warning">Warning</m-button>
    <m-button font="star_arc_line" disabled :plain="false" type="danger">Danger</m-button>
  </el-row>

  <el-row class="mb-4">
    <m-button font="star_arc_line" disabled type="primary">Primary</m-button>
    <m-button font="star_arc_line" disabled type="success">Success</m-button>
    <m-button font="star_arc_line" disabled type="info">Info</m-button>
    <m-button font="star_arc_line" disabled type="warning">Warning</m-button>
    <m-button font="star_arc_line" disabled type="danger">Danger</m-button>
  </el-row>

  <el-row class="mb-4">
    <m-button font="star_arc_line" disabled round type="primary">Primary</m-button>
    <m-button font="star_arc_line" disabled round type="success">Success</m-button>
    <m-button font="star_arc_line" disabled round type="info">Info</m-button>
    <m-button font="star_arc_line" disabled round type="warning">Warning</m-button>
    <m-button font="star_arc_line" disabled round type="danger">Danger</m-button>
  </el-row>

  <el-row>
    <m-button font="star_arc_line" disabled round type="primary" />
    <m-button font="star_arc_line" disabled round type="success" />
    <m-button font="star_arc_line" disabled round type="info" />
    <m-button font="star_arc_line" disabled round type="warning" />
    <m-button font="star_arc_line" disabled round type="danger" />
  </el-row>
</template>

<script lang="ts" setup></script>

<style>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
