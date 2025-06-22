<script setup>
import { onMounted, onUnmounted } from 'vue';
import mqtt from 'mqtt';

const emit = defineEmits(['update:left-data', 'update:right-data']);

let client = null;
let intervalId = null;

onMounted(() => {
  // --- MQTT 连接设置 ---
  const MQTT_BROKER_URL = 'ws://broker.emqx.io:8083/mqtt'; // 公共测试 Broker
  client = mqtt.connect(MQTT_BROKER_URL);

  const LEFT_PANEL_TOPIC = 'vue-dashboard/data/left';
  const RIGHT_PANEL_TOPIC = 'vue-dashboard/data/right';

  client.on('connect', () => {
    console.log('MQTT 连接成功!');
    emit('update:left-data', 'MQTT 已连接, 等待主题消息...');
    emit('update:right-data', 'MQTT 已连接, 等待主题消息...');
    
    client.subscribe(LEFT_PANEL_TOPIC, { qos: 0 }, (err) => {
      if (!err) console.log(`成功订阅主题: ${LEFT_PANEL_TOPIC}`);
    });
    client.subscribe(RIGHT_PANEL_TOPIC, { qos: 0 }, (err) => {
      if (!err) console.log(`成功订阅主题: ${RIGHT_PANEL_TOPIC}`);
    });
    
    // (可选) 为了演示，每5秒发布一条测试消息
    intervalId = setInterval(() => {
      if (client && client.connected) {
        client.publish(LEFT_PANEL_TOPIC, `时间: ${new Date().toLocaleTimeString()}`);
        client.publish(RIGHT_PANEL_TOPIC, JSON.stringify({ sensor: 'T-800', value: (Math.random() * 100).toFixed(2), unit: '°C' }, null, 2));
      }
    }, 5000);
  });

  client.on('message', (topic, message) => {
    const messageString = message.toString();
    if (topic === LEFT_PANEL_TOPIC) {
      emit('update:left-data', messageString);
    } else if (topic === RIGHT_PANEL_TOPIC) {
      emit('update:right-data', messageString);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT 连接错误:', err);
    const errorMsg = 'MQTT 连接失败!';
    emit('update:left-data', errorMsg);
    emit('update:right-data', errorMsg);
    if (client) {
      client.end();
    }
  });
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (client) {
    client.end();
  }
});
</script>