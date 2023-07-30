<script setup>
import { Card } from 'ant-design-vue'

import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../utils/config'
import { BaiduImageryProvider } from '../utils/cesiumUtils'

const cardStyle = {
  background: 'rgba(78,118,205,0.5)',
  color: '#fff'
}

const root = ref(null)
let viewer

onMounted(async () => {
  // 渲染地球
  viewer = new Cesium.Viewer(root.value, {
    ...getViewerInitConfig(),
    terrain: Cesium.Terrain.fromWorldTerrain(),
  })
//   viewer.imageryLayers.addImageryProvider(
//     new BaiduImageryProvider({
//       url: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1'
//     })
//   )

  //   // 渲染海拔高度范围
  const scene = viewer.scene
  const elevationBandMaterial = Cesium.createElevationBandMaterial({
      scene: scene,
      layers: [
        {
          entries: [
            {
              height: 500.0,
              color: new Cesium.Color(255.0, 0.0, 0.0, 1.0)
            },
            {
              height: 700.0,
              color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            }
          ],
        //   extendDownwards: true,
        //   extendUpwards: true
        },
        {
          entries: [
            {
              height: 100.0,
              color: new Cesium.Color(1.0, 0.0, 0.0, 0.5)
            },
            {
              height: 200.0,
              color: new Cesium.Color(1.0, 0.0, 0.0, 0.5)
            }
          ]
        }
      ]
    })
    viewer.scene.globe.material = elevationBandMaterial
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
      <p>Terrain 地形</p>
      <p>增加场景的材质</p>
      <p>Cesium.createElevationBandMaterial</p>
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
