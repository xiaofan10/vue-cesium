<script setup>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

onMounted(async () => {
  // 官方提供 https://services.arcgisonline.com/arcgis/rest/services
  // 高德地图 https://blog.csdn.net/hou_ge/article/details/127212932
  // 矢量地图带注记：https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}  UrlTemplateImageryProvider
  // 矢量地图不带注记：http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&scl=1&ltype=3
  // 影像不带注记：http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}
  // 道路带注记：http://webst0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8
  // 道路不带注记：http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8<ype=11
  // 矢量带注记http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}

  // 天地图 http://lbs.tianditu.gov.cn/server/MapService.html
  // http://Mapbox.com 地图制作 https://blog.csdn.net/hou_ge/article/details/127212932

  // Cesium 官方提供的资源所使用的token
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkY2UyZDI3NS02M2NjLTQ1OTUtODBmMC03YWNhYzk1NzU2M2MiLCJpZCI6MTU2MDQyLCJpYXQiOjE2OTAyMDc4ODR9.BmN3pOpnSPgJa2eBzYBHt5xrnMaIlV7MdcNrvowXpfs'
  // ArcGis 使用的token https://developers.arcgis.com
  // Cesium.ArcGisMapService.defaultAccessToken =
  //   'AAPKa334085b43db448b9396da0be43d8eb0E00TOp76Ro_zfiObeIZ-Bkhu1q5J1GEASdk78VTLE52iPRJJa6E_O4O84zOVYEp1'

  const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
      Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Cesium.ArcGisBaseMapType.SATELLITE)
    )
  })
 
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
