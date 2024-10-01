---
# 提供三种布局，doc、page和home https://vitepress.dev/reference/default-theme-layout
layout: home
home: true

# https://vitepress.dev/reference/default-theme-home-page
title: 老咸鱼的站点
titleTemplate: 老咸鱼的站点
editLink: true
lastUpdated: true

hero:
    name: 老咸鱼的站点
    text: 学习是时间的累积
    tagline: 欢迎来到·老咸鱼的站点
    image:
        src: logo-ui.svg
        alt: logo
    actions:
    - theme: brand
      text: 💡 Manager-UI
      link: /document/component/quick-start
    - theme: brand
      text: 📘 学习文档
      link: /document/study/vue/doc1

features:
  - icon: 💡
    title: Manager-UI
    details: Manager-UI 基于 Vue3 + Element-Plus 二次开发UI框架，用于快速页面搭建与开发。🤪🤪🤪
    link: /document/component/quick-start
  - icon: 📘‍
    title: 学习文档
    details: 自学记录学习文档，推荐阅读。
    link: /document/study/vue/doc1
---


<!-- 自定义组件 -->
<!-- <script setup>
import home from './components/home.vue';
</script>

<home /> -->
