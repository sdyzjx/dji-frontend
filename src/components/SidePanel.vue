<template>
    <div class="side-panel">
      <h3>{{ title }}</h3>
      <pre class="data-display">{{ data }}</pre>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      default: '数据面板'
    },
    data: {
      type: String,
      default: '等待数据...'
    }
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
    overflow-y: auto;
  }
  
  h3 {
    margin-top: 0;
    border-bottom: 2px solid #1890ff;
    padding-bottom: 10px;
  }
  
  .data-display {
    white-space: pre-wrap; /* 自动换行 */
    word-wrap: break-word;
    font-family: 'Courier New', Courier, monospace;
    background-color: #fff;
    padding: 15px;
    border-radius: 4px;
    min-height: 100px;
  }
  </style>