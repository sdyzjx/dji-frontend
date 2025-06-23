<template>
  <div class="side-panel">
    <h3>{{ title }}</h3>
    <div class="data-container">
      <template v-if="isObject(data)">
        <JsonDetail :data="filteredData" />
      </template>
      <pre v-else>{{ data }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { isObject } from '../utils/formatters.js';
import JsonDetail from './JsonDetail.vue';

const props = defineProps({
  title: {
    type: String,
    default: '数据面板'
  },
  data: {
    type: [String, Object],
    default: '等待数据...'
  }
});

// 创建一个计算属性来过滤掉不想显示的顶层键（如bid, tid）
const filteredData = computed(() => {
  if (!isObject(props.data)) return {};
  const { bid, tid, ...rest } = props.data;
  return rest;
});
</script>

<style scoped>
.side-panel {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f0f2f5;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h3 {
  margin-top: 0;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 10px;
  flex-shrink: 0;
}

.data-container {
  flex-grow: 1;
  font-family: 'Courier New', Courier, monospace;
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-y: auto;
  min-height: 100px;
  font-size: 14px;
}

.data-container pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}
</style>