<script setup>
import { Card } from 'ant-design-vue'
import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../utils/config'
import { QHD_STREET_DATA } from '../assets/map/1Street'
import { BaiduImageryProvider } from '../utils/cesiumUtils'

const cardStyle = {
  background: 'rgba(78,118,205,0.5)',
  color: '#fff'
}

console.log(QHD_STREET_DATA)
const root = ref(null)
let viewer
onMounted(() => {
  viewer = new Cesium.Viewer(root.value, getViewerInitConfig())

  viewer.imageryLayers.addImageryProvider(
    new BaiduImageryProvider({
      url: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1'
    })
  )

  const position = Cesium.Cartesian3.fromDegrees(121, 30)

  const dataSource = new Cesium.CustomDataSource('QHD_STREET')
  viewer.dataSources.add(dataSource)

  // QHD_STREET_DATA.forEach((item,i) => {
  //   dataSource.entities.add({
  //     id: `QHD_${i}`,
  //     position: new Cesium.Cartesian3.fromDegrees(...item),
  //     point: {
  //     pixelSize: 10,
  //     outlineWidth: 10,
  //     outlineColor: Cesium.Color.RED,
  //     color: Cesium.Color.BLACK
  //   }
  //   })
  // })
  const positions = Cesium.Cartesian3.fromDegreesArray(QHD_STREET_DATA.flat())
  const point = viewer.entities.add({
    id: 'point',
    polyline: {
      width: 20,
      positions,
      material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED) 
    }
  })
  console.log(QHD_STREET_DATA)
  viewer.zoomTo(point)
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
      <p>轨迹</p>
      <p>添加模型</p>
      <p>控制模型朝向</p>
      <p>位置实时更新</p>
      <p>视角跟随</p>
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
