<script setup>
import { onMounted, onUnmounted } from 'vue';
import mqtt from 'mqtt';

const emit = defineEmits(['update:left-data', 'update:right-data']);

let client = null;
let intervalId = null;

onMounted(() => {
  // --- MQTT 连接设置 ---
  const MQTT_BROKER_URL = 'ws://117.50.176.63:8083/mqtt'; // 公共测试 Broker
  client = mqtt.connect(MQTT_BROKER_URL);

  const LEFT_PANEL_TOPIC = 'thing/product/5YSZM150030540/osd';
  const RIGHT_PANEL_TOPIC = 'thing/product/1581F5FJD241900D0U32/osd';

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
    
  });

  client.on('message', (topic, message) => {
    const messageString = message.toString();
    try {
      const jsonData = JSON.parse(messageString);
      // 根据主题分发解析后的JSON数据
      if (topic === LEFT_PANEL_TOPIC) {
        emit('update:left-data', jsonData);
      } else if (topic === RIGHT_PANEL_TOPIC) {
        emit('update:right-data', jsonData);
      }
    } catch (e) {
      // 如果解析失败，则作为普通字符串分发
      if (topic === LEFT_PANEL_TOPIC) {
        emit('update:left-data', messageString);
      } else if (topic === RIGHT_PANEL_TOPIC) {
        emit('update:right-data', messageString);
      }
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