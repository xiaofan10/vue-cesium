<script setup>
import { Viewer } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

onMounted(() => {
  console.log(document.getElementById('cesiumContainer'))
  const viewer = new Viewer('cesiumContainer')
  viewer.scene.debugShowFramesPerSecond = true
})
</script>

<template>
  <main>
    <div class="cesiumContainer" id="cesiumContainer"></div>
  </main>
</template>
<style scoped>
.cesiumContainer {
  width: 100%;
  height: 100vh;
}
</style>
