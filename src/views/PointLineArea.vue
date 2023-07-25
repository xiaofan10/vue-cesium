<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../utils/config'
const root = ref(null)
let viewer
onMounted(() => {
  viewer = new Cesium.Viewer(root.value, getViewerInitConfig())
  const position = Cesium.Cartesian3.fromDegrees(121, 30)
  const point = viewer.entities.add({
    id: 'point',
    position,
    point: {
      pixelSize: 200,
      outlineWidth: 10,
      outlineColor: Cesium.Color.RED,
      color: Cesium.Color.BLACK
    }
  })
  console.log(point)
  viewer.zoomTo(point)
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
