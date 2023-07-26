<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../utils/config'
const root = ref(null)
let viewer
onMounted(async () => {
  console.log(root.value)
  viewer = new Cesium.Viewer(root.value, getViewerInitConfig())
  //   116.20 39.56 北京
  // -73.93854, 40.6643 纽约
  const areaList = {
    biejing: {
      lon: 116.2,
      lat: 39.56
    }
  }
  const position = Cesium.Cartesian3.fromDegrees(
    areaList.biejing.lon,
    areaList.biejing.lat,
    10000000
  )
  viewer.camera.flyTo({
    destination: position
  })

  const chinaGeoJson = await Cesium.GeoJsonDataSource.load('./geo/china.topo.json')
  const entities = chinaGeoJson.entities.values
  entities.forEach((item, i) => {
    const color = Cesium.Color.fromRandom()
    if (item.polygon?.material) {
      item.polygon.material = color
      item.polygon.extrudedHeight = Math.floor(Math.random() * 100000)
      item.billboard = new Cesium.BillboardGraphics({
        image: './img/mark.jpeg',
        width: 20,
        height: 20,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      })
      if (item.properties.center) {
        const center = item.properties.center.getValue()
        item.position = Cesium.Cartesian3.fromDegrees(
          center[0],
          center[1],
          0
        )
        item.label = {
            text: item.name
        }
      }

      //   entity.polygon.outline =
    }
  })

  viewer.dataSources.add(chinaGeoJson)
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
