<template>
  <ul class="detail-list">
    <li v-for="(value, key) in data" :key="key">
      <strong>{{ translateKey(key) }}:</strong>

      <JsonDetail v-if="isObject(value)" :data="value" class="nested-list" />

      <template v-else-if="Array.isArray(value)">
        <ul class="nested-list">
          <li v-for="(item, index) in value" :key="index" class="array-item">
            <span v-if="value.length > 1 && isObject(item)" class="array-index">#{{ index + 1 }}</span>
            <JsonDetail v-if="isObject(item)" :data="item" />
            <span v-else>{{ item }}</span>
          </li>
        </ul>
      </template>

      <span v-else>
        {{ formatValue(key, value) }}
      </span>
    </li>
  </ul>
</template>

<script>
// 使用普通<script>标签来支持组件的递归
import { isObject, translateKey, formatValue } from '../utils/formatters.js';

export default {
  name: 'JsonDetail', // name属性对于递归组件是必需的
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup() {
    // 将方法暴露给模板
    return {
      isObject,
      translateKey,
      formatValue
    };
  }
}
</script>

<style scoped>
.detail-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.detail-list li {
  padding: 4px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}
.detail-list li:last-child {
  border-bottom: none;
}
.detail-list strong {
  margin-right: 10px;
}
.nested-list {
  width: 100%;
  margin-top: 5px;
  padding-left: 20px;
  border-left: 2px solid #e0e0e0;
}
.array-item {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 5px;
  margin-bottom: 5px;
}
.array-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.array-index {
  font-weight: bold;
  color: #1890ff;
  display: block;
  margin-bottom: 5px;
}
</style>