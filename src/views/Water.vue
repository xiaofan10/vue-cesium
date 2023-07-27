<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../utils/config'
const root = ref(null)
let viewer
onMounted(() => {

  viewer = new Cesium.Viewer(root.value, getViewerInitConfig())
  const position = Cesium.Cartesian3.fromDegrees(-73.93854, 40.6643, 100)
// frequency  水波纹数量
// animationSpeed 水的流速
// amplitude 水波纹的振幅
// specularIntensity 镜面反射强度


//   viewer.camera.setView({
//     destination: position,
//     orientation: {
//         heading: Cesium.Math.toRadians(0), // 视角水平旋转/转头
//         pitch:  Cesium.Math.toRadians(0),// 点头
//         roll: Cesium.Math.toRadians(0), // 视角垂直旋转/歪头
//     }
//   })
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
