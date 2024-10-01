---
description: description
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

<script setup>
import { NAV_DATA } from './config/data'
</script>
<style src="./config/index.scss"></style>

# 快捷工具站

<NavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>
