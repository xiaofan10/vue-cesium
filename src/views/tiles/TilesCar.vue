<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../../utils/config'
const root = ref(null)
let viewer
onMounted(async () => {
  viewer = new Cesium.Viewer(root.value, { ...getViewerInitConfig() })
  // 定位到纽约
  // 先将纽约经纬度转成笛卡尔坐标
  const position = Cesium.Cartesian3.fromDegrees(-73.93854, 40.6643, 100)

  const carTiles = await Cesium.Cesium3DTileset.fromUrl('./public/tiles/car1/tileset.json')

  viewer.camera.setView({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(0), // 视角水平旋转/转头
      pitch: Cesium.Math.toRadians(0), // 点头
      roll: Cesium.Math.toRadians(0) // 视角垂直旋转/歪头
    }
  })
  const xx = viewer.scene.primitives.add(carTiles)
  const imageryLayers = viewer.imageryLayers
  // const dayLayer = Cesium.ImageryLayer.fromProviderAsync(
  //   new Cesium.UrlTemplateImageryProvider({
  //     url: './public/tiles/map1/tiles/{z}/{x}/{y}.png',
  //     fileExtension: 'png',
  //     credit: 'Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
  //   })
  // )
  // imageryLayers.add(dayLayer)
  viewer.zoomTo(xx)
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
