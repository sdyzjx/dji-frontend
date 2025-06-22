<template>
  <div id="app-container">
    <NavBar />
    <main class="content-wrap">
      <transition name="fade" mode="out-in">
        <RouterView />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
</script>

<style>
/* 全局样式 */
.content-wrap {
  /* 添加顶部内边距，防止内容被固定的导航栏遮挡 */
  padding-top: 60px; 
  height: 100vh;
  box-sizing: border-box;
}

/* 确保路由视图能撑满内容区域 */
.content-wrap > * {
  height: 100%;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>