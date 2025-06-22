<template>
    <div class="video-container">
        <video ref="videoPlayerRef" class="centered-video" muted autoplay></video>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import flvjs from 'flv.js';
  
  // 定义 props 来接收父组件传递的流地址
  const props = defineProps({
    streamUrl: {
      type: String,
      required: true,
    },
  });
  
  const videoPlayerRef = ref(null); // 获取 video 元素的引用
  let flvPlayer = null; // 用于存储 flv.js 播放器实例
  
  // 初始化和销毁播放器的函数
  const setupPlayer = (url) => {
    if (flvjs.isSupported()) {
      // 如果已有播放器实例，先销毁
      if (flvPlayer) {
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
        flvPlayer = null;
      }
      
      // 创建新的播放器实例
      flvPlayer = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: url,
      });
      
      flvPlayer.attachMediaElement(videoPlayerRef.value);
      
      try {
        flvPlayer.load();
        flvPlayer.play().catch(error => {
          console.error("Autoplay was prevented:", error);
          // 浏览器通常会阻止自动播放，除非视频是静音(muted)的
        });
      } catch (error) {
        console.error("Error loading video stream:", error);
      }
    }
  };
  
  // 监听 streamUrl 的变化，当 URL 改变时，重新设置播放器
  watch(() => props.streamUrl, (newUrl) => {
    if (newUrl) {
      console.log(`Switching to new stream: ${newUrl}`);
      setupPlayer(newUrl);
    }
  });
  
  // 组件挂载后，初始化播放器
  onMounted(() => {
    if (props.streamUrl) {
      setupPlayer(props.streamUrl);
    }
  });
  
  // 组件卸载时，清理播放器资源，防止内存泄漏
  onUnmounted(() => {
    if (flvPlayer) {
      flvPlayer.unload();
      flvPlayer.detachMediaElement();
      flvPlayer.destroy();
    }
  });
  </script>
  
  <style scoped>
  .video-container {
    width: 100%;
    height: 100%;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .centered-video {
    width: 100%;
    height: 100%;
  }
  </style>