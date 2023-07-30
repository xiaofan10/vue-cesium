<script setup>
import { Button, Card } from 'ant-design-vue'

import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../utils/config'

const cardStyle = {
  background: 'rgba(78,118,205,0.5)',
  color: '#fff'
}

const root = ref(null)
let viewer

onMounted(() => {
  // 渲染地球
  viewer = new Cesium.Viewer(root.value, getViewerInitConfig())
  // 北京三围笛卡尔坐标
  const position = Cesium.Cartesian3.fromDegrees(-73.93854, 40.6643, 100)

})
</script>

<template>
  <div class="cesiumContainer" ref="root"></div>
  <div class="tooltip-panel">
    <Card
      class="card"
      title="学习目标"
      style="width: 300px"
      :head-style="cardStyle"
      :bodyStyle="cardStyle"
    >
      <p>广告牌添加</p>
    </Card>
  </div>
</template>

<style scoped>
.cesiumContainer {
  width: 100%;
  height: 100vh;
}
.tooltip-panel {
  position: absolute;
  left: 0;
  bottom: 0;
}
.card {
  background: transparent !important;
  color: #fff;
}
</style>
