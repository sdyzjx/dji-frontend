// src/utils/formatters.js

/**
 * 检查一个值是否为可迭代的非空对象
 * @param {*} value
 * @returns {boolean}
 */
export const isObject = (value) => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * 包含所有需要翻译的键名
 */
export const keyMap = {
  // 通用
  app_version: '固件版本',
  capacity_percent: '电量百分比',
  height: '高度',
  latitude: '纬度',
  longitude: '经度',
  gateway: '网关',
  timestamp: '时间戳',
  sn: '序列号',
  firmware_version: '固件版本',
  index: '索引',
  type: '类型',
  temperature: '温度',
  voltage: '电压',
  
  // 左侧面板
  wireless_link: '无线链路',
  '4g_freq_band': '4G频段',
  '4g_gnd_quality': '4G地面质量',
  '4g_link_state': '4G连接状态',
  '4g_quality': '4G质量',
  '4g_uav_quality': '4G无人机质量',
  dongle_number: '加密狗数量',
  link_workmode: '链路工作模式',
  sdr_freq_band: 'SDR频段',
  sdr_link_state: 'SDR连接状态',
  sdr_quality: 'SDR质量',

  // 右侧面板
  "67-0-0": 'H20T 负载', // 这是一个动态键的例子
  gimbal_pitch: '云台俯仰',
  gimbal_roll: '云台横滚',
  gimbal_yaw: '云台偏航',
  payload_index: '负载索引',
  thermal_current_palette_style: '热成像风格',
  thermal_gain_mode: '热成像增益模式',
  thermal_global_temperature_max: '最高温度',
  thermal_global_temperature_min: '最低温度',
  thermal_isotherm_lower_limit: '等温线低温阈值',
  thermal_isotherm_state: '等温线状态',
  thermal_isotherm_upper_limit: '等温线高温阈值',
  zoom_factor: '变焦倍数',
  activation_time: '激活时间',
  attitude_head: '机头朝向',
  attitude_pitch: '姿态-俯仰',
  attitude_roll: '姿态-横滚',
  battery: '电池信息',
  batteries: '电池组',
  high_voltage_storage_days: '高压存储天数',
  loop_times: '循环次数',
  sub_type: '子类型',
  landing_power: '降落所需电量',
  remain_flight_time: '剩余飞行时间',
  return_home_power: '返航所需电量',
  cameras: '相机信息',
  camera_mode: '相机模式',
  position_state: '定位状态',
  gps_number: 'GPS数量',
  is_fixed: '是否固定',
  quality: '质量',
  rtk_number: 'RTK数量',
  rc_lost_action: '遥控器失联执行',
  rth_altitude: '返航高度',
  obstacle_avoidance: '避障状态',
  downside: '下视',
  horizon: '水平',
  upside: '上视',
  // ... 其他键名 ...
};

/**
 * 翻译键名
 * @param {string} key
 * @returns {string}
 */
export const translateKey = (key) => keyMap[key] || key;

/**
 * 格式化值
 * @param {string} key
 * @param {*} value
 * @returns {string}
 */
export const formatValue = (key, value) => {
  if (value === null || value === undefined) return 'N/A';
  
  // 根据键名格式化
  if (typeof value === 'number' && (key.includes('temperature') || key.includes('temp'))) {
    return `${value.toFixed(2)} °C`;
  }
  if (key === 'capacity_percent') return `${value}%`;
  if (key.endsWith('_state') || key === 'is_fixed') {
      const stateMap = { 0: '已断开', 1: '已连接' };
      return stateMap[value] !== undefined ? stateMap[value] : value;
  }
  if (key === 'height' && typeof value === 'number') return `${value.toFixed(2)} m`;
  if (key === 'voltage' && typeof value === 'number') return `${(value / 1000).toFixed(2)} V`;
  if (key === 'timestamp' || key === 'activation_time') {
      // activation_time 是秒，timestamp 是毫秒
      const date = new Date(key === 'timestamp' ? value : value * 1000);
      return date.toLocaleString();
  }
  if (typeof value === 'number') {
      // 对较长的小数进行格式化
      return Number.isInteger(value) ? value : value.toFixed(2);
  }
  return value;
};