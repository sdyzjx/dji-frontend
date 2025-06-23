<template>
    <div id="main-layout" ref="mainLayoutRef">
      <MqttController @update:left-data="onLeftDataUpdate" @update:right-data="onRightDataUpdate" />
      
      <SidePanel class="panel left-panel" title="遥控器/机场数据" :data="leftPanelData" />
  
      <div class="center-content">
        <VideoPlayer :stream-url="currentStreamUrl" />
        <div class="controls">
          <p>切换视频流:</p>
            <button
                v-for="source in streamSources"
                :key="source.name"
                @click="switchStream(source.url, source.name)"
                :class="{ active: currentStreamName === source.name }"
            >
                {{ source.name }}
            </button>
          <button @click="toggleFullscreen" class="fullscreen-btn">切换全屏</button>
        </div>
      </div>
  
      <SidePanel class="panel right-panel" title="无人机数据" :data="rightPanelData" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import VideoPlayer from '../components/VideoPlayer.vue';
  import SidePanel from '../components/SidePanel.vue';
  import MqttController from '../components/MqttController.vue';
  
  // --- 全屏控制 ---
  const mainLayoutRef = ref(null);
  
  function toggleFullscreen() {
    const elem = mainLayoutRef.value;
    if (!elem) return;
  
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  
  // --- 视频流数据 ---
  const streamSources = ref([
    { name: '测试流 1', url: 'http://10.191.32.14:8080/live/test123.flv' },
    { name: '测试流 2', url: 'http://your_media_server_ip:port/live/stream2.flv' },
    { name: '公开测试流', url: 'https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/v-20220623-204310-579.flv' }
  ]);
  const currentStreamUrl = ref(streamSources.value[-1]?.url); // 初始化为空或第一个
    const currentStreamName = ref('');

    function switchStream(url, name) {
    currentStreamUrl.value = url;
    currentStreamName.value = name;
    }
  
  // --- MQTT 数据 ---
  const leftPanelData = ref('正在连接 MQTT Broker...'); // 初始化为字符串
  const rightPanelData = ref('正在连接 MQTT Broker...');

  function onLeftDataUpdate(data) {
    leftPanelData.value = data; // data可以是字符串或对象
  }

  function onRightDataUpdate(data) {
    rightPanelData.value = data;
  }
  </script>
  
  <style scoped>
  /* 这个布局特有的样式，从 App.vue 移动过来 */
  #main-layout {
    display: flex;
    height: 100%;
    width: 100%;
    background-color: #e0e0e0;
  }
  
  .panel {
    flex-basis: 20%;
    flex-shrink: 0;
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f0f2f5;
    border: 1px solid #d9d9d9;
  }
  
  .center-content {
    flex-basis: 60%;
    flex-shrink: 1;
    flex-grow: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
  }
  
  #main-layout:fullscreen {
    background-color: #333;
  }
  
  .center-content .controls {
    flex-shrink: 0;
    padding: 10px;
    background-color: #424242;
    color: white;
    text-align: center;
    border-radius: 0 0 5px 5px;
  }
  
  .center-content .controls p {
    display: inline-block;
    margin: 0 15px 0 0;
  }
  
  .center-content .controls button {
    margin: 0 5px;
    padding: 8px 15px;
    cursor: pointer;
    border: 1px solid #616161;
    background-color: #757575;
    color: white;
    border-radius: 4px;
  }
  .center-content .controls button.active {
    background-color: #0243bd !important; /* 更醒目的颜色 */
    color: white !important;
    border-color: #0243bd !important;
  }
  
  .fullscreen-btn {
    background-color: #0288bd !important;
  }
  </style>