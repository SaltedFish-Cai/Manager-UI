<template>
  <div class="vp_title_label">结果值：</div>

  <code-view v-model:html="treeData"> </code-view>
  <div style="height: 300px">
    <m-line-map ref="lineMapRef" :tree-data="mapData" :default-data="mapData2">
      <template #default="{ data, id }">
        {{ id }}
        <!-- <div v-for="item in data.arr" :key="item.id">{{ item }}</div>
        <text @click="data.arr.push('112233')">add</text> -->
      </template>

      <template #line="{ data }"> 自定义 {{ data }} </template>
    </m-line-map>
  </div>
  <div class="flex-center mt10">
    <m-button is="submit" @click="getMapData">获取值</m-button>
    <m-button is="submit" @click="getMapDataByTree">获取链接值</m-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const lineMapRef = ref();
const treeData = ref([]);
const mapData: any = ref([
  {
    id: "1",
    name: "aa",
    age: "11111",
    arr: [11],
    place: { x: 100, y: 100 },
    children: [
      {
        id: "11",
        place: { x: 300, y: 80 },
        name: "aa",
        age: "11111",
        arr: [11],
        children: [
          {
            id: "111",
            label: "test3",
            place: { x: 500, y: 200 },
            name: "htdcd",
            age: "55",
            arr: [11],
            children: [
              {
                id: "1111",
                label: "test3",
                place: { x: 500, y: 200 },
                name: "htdcd",
                age: "55",
                arr: [11]
              }
            ]
          },
          {
            id: "112",
            label: "test3",
            place: { x: 500, y: 200 },
            name: "htdcd",
            age: "55",
            arr: [11]
          }
        ]
      },
      {
        id: "12",
        label: "test3",
        place: { x: 500, y: 200 },
        name: "htdcd",
        age: "55",
        arr: [11],
        children: [
          {
            id: "121",
            label: "test3",
            place: { x: 500, y: 200 },
            name: "htdcd",
            age: "55",
            arr: [11]
          },
          {
            id: "122",
            label: "test3",
            place: { x: 500, y: 200 },
            name: "htdcd",
            age: "55",
            arr: [11]
          }
        ]
      },
      {
        id: "13",
        place: { x: 210, y: 220 },
        name: "casdaas",
        age: "23",
        arr: [11],
        children: [
          {
            id: "131",
            label: "test3",
            place: { x: 500, y: 200 },
            name: "htdcd",
            age: "55",
            arr: [11]
          },
          {
            id: "121",
            label: "test3",
            place: { x: 500, y: 200 },
            name: "htdcd",
            age: "55",
            arr: [11]
          }
        ]
      }
    ]
  }
]);

// const mapData2 = {
//   steps: [
//     { name: "casdaas", age: "23", arr: [11], id: "a", place: { x: 200, y: 100 } },
//     { name: "ht", age: "11", arr: [11], id: "aa", place: { x: 400, y: 300 } },
//     { label: "test3", name: "htdcd", age: "55", arr: [11], id: "aaa", place: { x: 500, y: 200 } }
//   ],
//   lines: [
//     { from: "a", to: "aa" },
//     { from: "a", to: "aaa" },
//     { from: "aa", to: "aaa" }
//   ]
// };

const mapData2 = {
  steps: [
    { name: "aa", age: "11111", arr: [11], id: "1", place: { x: 0, y: 0 } },
    { name: "aa", age: "11111", arr: [11], id: "11", place: { x: 196, y: 0 } },
    { label: "test3", name: "htdcd", age: "55", arr: [11], id: "111", place: { x: 397, y: 0 } },
    { label: "test3", name: "htdcd", age: "55", arr: [11], id: "1111", place: { x: 604, y: 0 } },
    { label: "test3", name: "htdcd", age: "55", arr: [11], id: "112", place: { x: 397, y: 41 } },
    { label: "test3", name: "htdcd", age: "55", arr: [11], id: "12", place: { x: 196, y: 82 } },
    { label: "test3", name: "htdcd", age: "55", arr: [11], id: "121", place: { x: 399, y: 82 } },
    { label: "test3", name: "htdcd", age: "55", arr: [11], id: "122", place: { x: 399, y: 123 } },
    { name: "casdaas", age: "23", arr: [11], id: "13", place: { x: 196, y: 164 } },
    { label: "test3", name: "htdcd", age: "55", arr: [11], id: "131", place: { x: 399, y: 164 } }
  ],
  lines: [
    { from: "1", to: "11" },
    { from: "1", to: "12" },
    { from: "1", to: "13" },
    { from: "11", to: "111" },
    { from: "11", to: "112" },
    { from: "111", to: "1111" },
    { from: "12", to: "121" },
    { from: "12", to: "122" },
    { from: "13", to: "131" },
    { from: "13", to: "121" }
  ]
};

function getMapData() {
  const data = lineMapRef.value.getMapData();
  treeData.value = data;
}

function getMapDataByTree() {
  const data = lineMapRef.value.getMapDataByTree();
  treeData.value = data;
}
</script>

<style lang="scss">
.test {
  width: 100%;
  height: 200px;
}
.test2 {
  width: 150px;
  height: 150px;
  background-color: red;
  margin-right: 10px;
}
</style>
