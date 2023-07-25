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
  const mapUrl = {
    base: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
    street: 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer'
  }

  const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
      Cesium.ArcGisMapServerImageryProvider.fromUrl(mapUrl.street)
    ),
    // 初始地形设置（水波纹，山峰）
    terrainProvider: await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    })
  })
  // 3dtile 数据设置 纽约城市3d模型
  const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(75343)
  console.log(tileset)
  //   摄像头设置
  const city = viewer.scene.primitives.add(tileset)
  await viewer.zoomTo(tileset)
  const tileStyle = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ['${Height} >= 100', 'rgba(0,0,0,0.5)'],
        ['${Height} >= 50', 'rgba(121,22,32,0.5)'],
        ['true', 'rgba(40,40,40,0.5)']
      ],
      show: '${Height} > 0',
      meta: {
        description: '"Building id ${id} has height ${Height}."'
      }
    }
  })
  city.style = tileStyle
  // 边界加载 使用geojson
  viewer.dataSources.add(Cesium.GeoJsonDataSource.load('./US.geojson'))
 // 增加模型
  function createModel(url, height) {
    // viewer.entities.removeAll()
    // 经纬度转笛卡尔
    const position = Cesium.Cartesian3.fromDegrees(-73.938540, 40.6643, height)
    // 笛卡尔转弧度坐标
    // const hudu = Cesium.Cartographic.fromCartesian(position)
    // const lon = Cesium.Math.toDegrees()
    const heading = Cesium.Math.toRadians(135)
    const pitch = 0
    const roll = 0
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)

    const entity = viewer.entities.add({
      name: url,
      position: position,
      orientation: orientation,
      model: {
        uri: url,
        // minimumPixelSize: 128,
        // maximumScale: 20000
      }
    })
    viewer.trackedEntity = entity
  }
  createModel('./car.glb', 1000)
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
