<template>
  <el-row class="mb-4">
    <m-button font="star_arc_line" :plain="false" type="primary">Primary</m-button>
    <m-button font="star_arc_line" :plain="false" type="success">Success</m-button>
    <m-button font="star_arc_line" :plain="false" type="info">Info</m-button>
    <m-button font="star_arc_line" :plain="false" type="warning">Warning</m-button>
    <m-button font="star_arc_line" :plain="false" type="danger">Danger</m-button>
  </el-row>

  <el-row class="mb-4">
    <m-button font="star_arc_line" type="primary">Primary</m-button>
    <m-button font="star_arc_line" type="success">Success</m-button>
    <m-button font="star_arc_line" type="info">Info</m-button>
    <m-button font="star_arc_line" type="warning">Warning</m-button>
    <m-button font="star_arc_line" type="danger">Danger</m-button>
  </el-row>

  <el-row class="mb-4">
    <m-button font="star_arc_line" round type="primary">Primary</m-button>
    <m-button font="star_arc_line" round type="success">Success</m-button>
    <m-button font="star_arc_line" round type="info">Info</m-button>
    <m-button font="star_arc_line" round type="warning">Warning</m-button>
    <m-button font="star_arc_line" round type="danger">Danger</m-button>
  </el-row>

  <el-row class="mb-4">
    <m-button font="star_arc_line" round type="primary" />
    <m-button font="star_arc_line" round type="success" />
    <m-button font="star_arc_line" round type="info" />
    <m-button font="star_arc_line" round type="warning" />
    <m-button font="star_arc_line" round type="danger" />
  </el-row>

  <el-row>
    <m-button font="star_arc_line" circle type="primary" />
    <m-button font="star_arc_line" circle type="success" />
    <m-button font="star_arc_line" circle type="info" />
    <m-button font="star_arc_line" circle type="warning" />
    <m-button font="star_arc_line" circle type="danger" />
  </el-row>
</template>

<script lang="ts" setup></script>

<style>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
