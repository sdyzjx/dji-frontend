<template>
  <div id="main-layout" ref="mainLayoutRef">
    <SidePanel class="panel left-panel" title="飞机数据" :data="leftPanelData" />

    <div class="center-content">
      <VideoPlayer :stream-url="currentStreamUrl" />
      <div class="controls">
        <p>切换视频流:</p>
        <button v-for="source in streamSources" :key="source.name" @click="switchStream(source.url)">
          {{ source.name }}
        </button>
        <button @click="toggleFullscreen" class="fullscreen-btn">切换全屏</button>
      </div>
    </div>

    <SidePanel class="panel right-panel" title="位置数据" :data="rightPanelData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mqtt from 'mqtt';
import VideoPlayer from './components/VideoPlayer.vue';
import SidePanel from './components/SidePanel.vue';

// --- 全屏控制 ---
const mainLayoutRef = ref(null); // 获取根元素的引用

function toggleFullscreen() {
  const elem = mainLayoutRef.value;
  if (!elem) return;

  if (!document.fullscreenElement) {
    // 如果当前不是全屏，则请求整个应用布局进入全屏
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  } else {
    // 如果当前是全屏，则退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}


// --- 视频流数据 ---
const streamSources = ref([
  // 提示：请将下面的地址替换为你的媒体服务器提供的 HTTP-FLV 流地址
  { name: '测试流 1', url: 'http://your_media_server_ip:port/live/stream1.flv' },
  { name: '测试流 2', url: 'http://your_media_server_ip:port/live/stream2.flv' },
  // 你可以使用一个公开的测试流来快速验证
  { name: '公开测试流', url: 'https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/v-20220623-204310-579.flv' }
]);

const currentStreamUrl = ref(streamSources.value[2].url); // 默认播放公开流

function switchStream(url) {
  currentStreamUrl.value = url;
}

// --- MQTT 数据 ---
const leftPanelData = ref('正在连接 MQTT Broker...');
const rightPanelData = ref('正在连接 MQTT Broker...');

onMounted(() => {
  // --- MQTT 连接设置 ---
  // 请替换为你自己的 MQTT Broker 地址和 WebSocket 端口
  const MQTT_BROKER_URL = 'ws://broker.emqx.io:8083/mqtt'; // 使用一个公开的测试 Broker
  const client = mqtt.connect(MQTT_BROKER_URL);

  const LEFT_PANEL_TOPIC = 'vue-dashboard/data/left';
  const RIGHT_PANEL_TOPIC = 'vue-dashboard/data/right';

  client.on('connect', () => {
    console.log('MQTT 连接成功!');
    leftPanelData.value = 'MQTT 已连接, 等待主题消息...';
    rightPanelData.value = 'MQTT 已连接, 等待主题消息...';
    
    client.subscribe(LEFT_PANEL_TOPIC, { qos: 0 }, (err) => {
      if (!err) console.log(`成功订阅主题: ${LEFT_PANEL_TOPIC}`);
    });
    client.subscribe(RIGHT_PANEL_TOPIC, { qos: 0 }, (err) => {
      if (!err) console.log(`成功订阅主题: ${RIGHT_PANEL_TOPIC}`);
    });
    
    // (可选) 为了演示，每5秒发布一条测试消息
    setInterval(() => {
      client.publish(LEFT_PANEL_TOPIC, `时间: ${new Date().toLocaleTimeString()}`);
      client.publish(RIGHT_PANEL_TOPIC, JSON.stringify({ sensor: 'T-800', value: (Math.random() * 100).toFixed(2), unit: '°C' }, null, 2));
    }, 5000)
  });

  client.on('message', (topic, message) => {
    const messageString = message.toString();
    if (topic === LEFT_PANEL_TOPIC) {
      leftPanelData.value = messageString;
    } else if (topic === RIGHT_PANEL_TOPIC) {
      rightPanelData.value = messageString;
    }
  });

  client.on('error', (err) => {
    console.error('MQTT 连接错误:', err);
    const errorMsg = 'MQTT 连接失败!';
    leftPanelData.value = errorMsg;
    rightPanelData.value = errorMsg;
    client.end();
  });
});
</script>

<style>
/* 全局样式 */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;

}


#main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #e0e0e0;
}

/* --- 这是关键的修改部分 --- */

/* 为所有面板设置一个基础规则 */
.panel {
  /* 核心：设置理想宽度为 20%，并且绝不允许被压缩！ */
  flex-basis: 20%;
  flex-shrink: 0; /* 0 表示绝不收缩 */
  flex-grow: 0;   /* 0 表示绝不放大 */
  
  /* 其他样式 */
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  border: 1px solid #d9d9d9;
}

.center-content {
  /* 核心：允许放大和缩小，理想宽度为 60% */
  flex-basis: 60%;
  flex-shrink: 1; /* 1 表示允许收缩 */
  flex-grow: 1;   /* 1 表示允许放大 */
  
  /* 关键：强制它可以被压缩到0，以防其内容过大 */
  min-width: 0;
  
  /* 其他样式 */
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
}
/* --- 修改结束 --- */


#main-layout:fullscreen {
  background-color: #333;
}

#main-layout:fullscreen .panel {
  background-color: #f0f2f5; /* 在全屏模式下保持原色，或自定义 */
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
  transition: background-color 0.2s ease;
}
.center-content .controls button:hover {
  background-color: #616161;
}

.fullscreen-btn {
  background-color: #0277bd !important;
}

.fullscreen-btn:hover {
  background-color: #01579b !important;
}

/* SidePanel.vue 的内部样式，为了方便，我们直接在这里覆盖，你也可以写在组件里 */
.panel h3 {
  margin-top: 0;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 10px;
  flex-shrink: 0;
}

.panel .data-display {
  flex-grow: 1;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-y: auto;
  min-height: 100px; /* 给一个最小高度 */
}
</style>