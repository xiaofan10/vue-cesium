<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../utils/config'
const root = ref(null)
let viewer
onMounted(async () => {
  console.log(root.value)
  viewer = new Cesium.Viewer(root.value, getViewerInitConfig())
  // 定位到纽约
  // 先将纽约经纬度转成笛卡尔坐标
  const position = Cesium.Cartesian3.fromDegrees(-73.93854, 40.6643, 100)
  viewer.camera.setView({
    destination: position,
    orientation: {
        heading: Cesium.Math.toRadians(0), // 视角水平旋转/转头
        pitch:  Cesium.Math.toRadians(0),// 点头
        roll: Cesium.Math.toRadians(0), // 视角垂直旋转/歪头
    }
  })
  // 添加OSM bulidings
  const tiles = await Cesium.createOsmBuildingsAsync()
 viewer.scene.primitives.add(tiles);
//   viewer.camera.flyTo  // 飞到哪个位置
//   viewer.camera.lookAt // 锁定位置
})
</script>

<template>
  <div class="cesiumContainer" ref="root"></div>
</template>

<style scoped>
.cesiumContainer {
  width: 100%;
  height: 100vh;
}
</style>
