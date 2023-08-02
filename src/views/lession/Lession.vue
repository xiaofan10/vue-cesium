<template>
  <div class="container">
    <div class="sheet" ref="sheet"></div>
    <div class="tooltip-panel">
      <Card
        class="card"
        title="学习目标"
        style="width: 300px"
        :head-style="cardStyle"
        :bodyStyle="cardStyle"
      >
        <p>Cession 初始化</p>
        <div>
          <p>背景色设置</p>
          <Button size="small" @click="setSceneBackground('RED')">红色背景</Button>
          <Button size="small" @click="setSceneBackground('BLACK')">默认背景</Button>
          <Button size="small" @click="setSceneSkyBox()">设置3D背景图片</Button>
        </div>
        <div>
          <p>地图设置</p>
          <Button size="small" @click="setMap('ArcGis')">ArcGis地图</Button>
          <Button size="small" @click="setMap('baidu')">百度地图</Button>
          <Button size="small" @click="setMap('gaode')">高德地图</Button>
        </div>
        <div>
          <p>地图地形加载</p>
          <Button size="small" @click="setTerrain('add')">加载地形</Button>
          <Button size="small" @click="setTerrain('remove')">删除地形</Button>
        </div>
        <div>
          <p>地图经纬度辅助</p>
          <Button size="small" @click="setTileCoordinates('add')">加载经纬度</Button>
          <Button size="small" @click="setTileCoordinates('remove')">删除经纬度</Button>
        </div>
        <p>Cesium.createElevationBandMaterial</p>
      </Card>
    </div>
  </div>
</template>

<script setup>
import * as Cesium from 'cesium'
import { onMounted, onUnmounted, onBeforeUnmount, ref } from 'vue'
import { Card, Button } from 'ant-design-vue'
import { getViewerInitConfig } from '../../utils/config'
import { BaiduImageryProvider } from '../../utils/cesiumUtils'
import CesiumNavigation from 'cesium-navigation-es6'

const cardStyle = {
  background: 'rgba(78,118,205,0.5)',
  color: '#fff'
}

const sheet = ref(null)
let viewer

const setSceneBackground = (color) => {
  viewer.scene.skyBox = new Cesium.SkyBox({ show: false })
  viewer.scene.backgroundColor = Cesium.Color[color]
}

const setSceneSkyBox = () => {
  // 仅仅支持3d场景，2d则会消失 原理与制作方法 https://www.codenong.com/cs109889699/
  viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
      positiveX: './img/sky.jpg',
      negativeX: './img/sky.jpg',
      positiveY: './img/sky.jpg',
      negativeY: './img/sky.jpg',
      positiveZ: './img/sky.jpg',
      negativeZ: './img/sky.jpg'
    }
  })
}

const setMap = async (type) => {
  switch (type) {
    case 'ArcGis':
      const mapUrl = {
        base: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        street: 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer'
      }

      const layer = await Cesium.ImageryLayer.fromProviderAsync(
        Cesium.ArcGisMapServerImageryProvider.fromUrl(mapUrl.street)
      )
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      viewer.imageryLayers.add(layer)
      break
    case 'baidu':
      let baiduMapUrl = {
        yingxiang:
          'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1'
      }

      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      viewer.imageryLayers.addImageryProvider(
        new BaiduImageryProvider({
          url: baiduMapUrl.yingxiang
        })
      )
      break
    case 'gaode':
      let gaodeMapUrl = {
        yingxiang: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
      }
      // 添加高德影像图
      let gaodeLayer = new Cesium.UrlTemplateImageryProvider({
        url: gaodeMapUrl.yingxiang,
        minimumLevel: 3,
        maximumLevel: 18
      })

      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      viewer.imageryLayers.addImageryProvider(gaodeLayer)
      break
      case 'tiandi':
      // let tiandiMapUrl = {
      //   yingxiang: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
      // }
      // // 添加高德影像图
      // let tiandiLayer = new Cesium.UrlTemplateImageryProvider({
      //   url: tiandiMapUrl.yingxiang,
      //   minimumLevel: 3,
      //   maximumLevel: 18
      // })

      // viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      // viewer.imageryLayers.addImageryProvider(gaodeLayer)
      break
    default:
  }
}
// 地形与水波纹加载
const setTerrain = async (status) => {
  if(status === 'add') {
    viewer.terrainProvider = await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    });
  } else {
    viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider()
  }
}

const setTileCoordinates = async (status) => {
  if(status === 'add') {
    const layer = new Cesium.TileCoordinatesImageryProvider()
    viewer.imageryLayers.addImageryProvider(layer)
    console.log(viewer.imageryLayers)
  } else {
  
  }
}

onMounted(() => {
  viewer = new Cesium.Viewer(sheet.value, getViewerInitConfig())
  const options = {}
  // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
  // options.defaultResetView = Rectangle.fromDegrees(80, 22, 130, 50);
  // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
  options.enableCompass = true
  // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
  options.enableZoomControls = true
  // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
  options.enableDistanceLegend = true
  // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  options.enableCompassOuterRing = true

  //修改重置视图的tooltip
  options.resetTooltip = '重置视图'
  //修改放大按钮的tooltip
  options.zoomInTooltip = '放大'
  //修改缩小按钮的tooltip
  options.zoomOutTooltip = '缩小'

  //如需自定义罗盘控件，请看下面的自定义罗盘控件
  new CesiumNavigation(viewer, options)
})
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .sheet {
    width: 100%;
    height: 100%;
  }
  .tooltip-panel {
    position: absolute;
    left: 0;
    bottom: 0;
    .card {
      background: transparent !important;
      color: #fff;
    }
  }
}
</style>
