---
# 提供三种布局，doc、page和home https://vitepress.dev/reference/default-theme-layout
layout: home
home: true

# https://vitepress.dev/reference/default-theme-home-page
title: Manager UI
titleTemplate: Manager UI
editLink: true
lastUpdated: true

hero:
    name: Manager UI
    text: 快捷强大, 超出想象
    tagline: 使用 Vue3 + Vite + Element-Plus
    image:
        src: logo-ui.svg
        alt: logo
    actions:
    - theme: brand
      text: 快捷上手
      link: /document/demo/guide/quickstart
    - theme: brand
      text: 组件文档
      link: /document/demo/component/m-color/readme

features:
  - icon: 🤹‍♀️
    title: M-Table
    details: 完善的表格组件，方便快速创建表格，强大的功能与高扩展性。
    link: /document/demo/component/m-table/readme
  - icon: 👩‍🎨‍
    title: M-Form
    details: 便捷的表单组件，快速创建各种元素的表单，一步校验所有元素。
    link: /document/demo/component/m-form/readme
  - icon: 🧩
    title: 更多组件
    details: 更多组件能让你有效提高前端开发效率。
---


<!-- 自定义组件 -->
<!-- <script setup>
import home from './components/home.vue';
</script>

<home /> -->
