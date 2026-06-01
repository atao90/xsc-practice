<template>
  <div class="app-container">
    <router-view />
    <van-tabbar v-model="activeTab" :fixed="true" @change="onTabChange">
      <van-tabbar-item icon="bookmark-o" to="/chinese">语文</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" to="/math">数学</van-tabbar-item>
      <van-tabbar-item icon="font-o" to="/english">英语</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/me">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(0)

watch(() => route.path, (path) => {
  if (path.startsWith('/chinese')) activeTab.value = 0
  else if (path.startsWith('/math')) activeTab.value = 1
  else if (path.startsWith('/english')) activeTab.value = 2
  else if (path.startsWith('/me')) activeTab.value = 3
}, { immediate: true })

function onTabChange(index: number) {
  activeTab.value = index
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f7f8fa;
}
.app-container {
  padding-bottom: 50px;
  min-height: 100vh;
}
</style>
