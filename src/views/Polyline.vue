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

  // 添加线
  let entity = viewer.entities.add({
    id: 'polylineTest1',
    name: 'borderLine',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([88,39,109,39]),
      width: 20,
      material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED) // 箭头
    }
  })
// 发光材质
  entity = viewer.entities.add({
    id: 'polylineTest2',
    name: 'borderLine',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([88, 42, 110, 42]),
      width: 20,
      material: new Cesium.PolylineGlowMaterialProperty({
        color: Cesium.Color.BLUE,
        glowPower: 0.9,
        taperPower: 0.5
      })
    }
  })

  viewer.zoomTo(entity)
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
