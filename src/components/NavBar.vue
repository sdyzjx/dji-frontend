<template>
    <nav class="navbar">
      <div class="nav-links">
        <router-link to="/" class="nav-item">直播</router-link>
        <router-link to="/waypoints" class="nav-item">航线</router-link>
        <router-link to="/management" class="nav-item">管理</router-link>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router';
  </script>
  
  <style scoped>
  .navbar {
    background-color: #333;
    padding: 0 20px;
    display: flex;
    align-items: center;
    height: 60px;
    width: 100vw;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    border-bottom: 2px solid rgb(2, 78, 150);
  }
  
  .nav-links {
    display: flex;
  }
  
  .nav-item {
    color: white;
    text-decoration: none;
    padding: 10px 15px;
    margin: 0 5px;
    border-radius: 4px;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .nav-item:hover,
  .nav-item.router-link-exact-active {
    background-color: #666666;
    color: rgb(0, 173, 204);
  }
  </style>