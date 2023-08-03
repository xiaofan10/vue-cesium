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
        <div>
          <p>加载图元entities</p>
          <Button size="small" @click="addEntities('point')">Add 点</Button>
          <Button size="small" @click="addEntities('cube')">Add 正方体</Button>
          <Button size="small" @click="addEntities('plane')">Add 平面</Button>
        </div>
        <div>
          <p>加载3dTiles</p>
          <Button size="small" @click="addTiles()">Add</Button>
        </div>
        <div>
          <p>加载Event</p>
          <Button size="small" @click="addEvent()">Add</Button>
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
let viewer, tilesCollection = []

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

const addEvent = async () => {
  // 屏幕空间事件操作
  const handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handle.getInputAction((...res) => {
    console.log(res,'getInputAction')
  },Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handle.setInputAction((res) => {
    const feature = viewer.scene.pick(res.position)
    console.log(feature,'setInputAction')
    // feature.getPropertyIds().forEach((id) => {
    //   console.log(feature.getProperty(id))
    // })
    feature.color = Cesium.Color.RED

  },Cesium.ScreenSpaceEventType.LEFT_CLICK)
  console.log(handle)
}

const bindTilesEvent = (tileset) => {
  tileset.tileLoad.addEventListener((tile) => {
    const content = tile.content;
    const featuresLength = content.featuresLength;
    console.log(content)
    for (let i = 0; i <= featuresLength; ++i) {
    // const feature = content.getFeature(i);
  }
  })
  tileset.tileUnload.addEventListener(function(tile) {
    console.log(tile,'unload');
});
}

const addTiles = async () => {
  try {
    const tileset = await Cesium.Cesium3DTileset.fromUrl(
      // 'http://data.mars3d.cn/3dtiles/qx-dyt/tileset.json',
      '//data.mars3d.cn/3dtiles/max-fsdzm/tileset.json',
      {
        // debugShowBoundingVolume: true
      }
    )
    // bindTilesEvent(tileset)

    const primitiveTiles = viewer.scene.primitives.add(tileset)

    // 定位到3dtiles的位置
    function setTilesHeight() {
      // viewer.camera.viewBoundingSphere(
      //   tileset.boundingSphere,
      //   new Cesium.HeadingPitchRange(0, -20, 0)
      // )
      //高度偏差，向上是正数，向下是负数
      var heightOffset = -54.5 //计算tileset的绑定范围
      var boundingSphere = tileset.boundingSphere //计算中心点位置

      var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center) //计算中心点位置的地表坐标

      var current = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0.0
      ) //偏移后的坐标

      var offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        heightOffset
      )

      var translation = Cesium.Cartesian3.subtract(offset, current, new Cesium.Cartesian3()) //tileset.modelMatrix转换 计算两个笛卡尔坐标的差值

      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation) 
    }

    setTilesHeight()

    viewer.flyTo(primitiveTiles)
  } catch (error) {
    console.error(`Error creating [addTiles] tileset: ${error}`)
  }
}

const addEntities = async (shape) => {
  const bjCoord = [
    [104.0482, 30.6663, 0],
    [113.3708, 34.5839, 0]
  ]
  if (shape === 'point') {
    const point = viewer.entities.add({
      // id: 'point',
      name: 'cube',
      position: Cesium.Cartesian3.fromDegrees(...bjCoord[0]),
      point: {
        show: true,
        color: Cesium.Color.PINK,
        pixelSize: 5,
        outlineWidth: 5,
        outlineColor: Cesium.Color.RED
      }
    })
    viewer.flyTo(point)
  } else if (shape === 'cube') {
    const cube = viewer.entities.add({
      // id: 'cube',
      name: 'cube',
      position: Cesium.Cartesian3.fromDegrees(...bjCoord[1]),
      box: {
        show: true,
        dimensions: new Cesium.Cartesian3(400000.0, 400000.0, 400000.0),
        material: Cesium.Color.BLUE,
        shadow: Cesium.ShadowMode.ENABLED
      }
    })
    viewer.flyTo(cube)
  } else if (shape === 'plane') {
    const plane = viewer.entities.add({
      // id: 'plane',
      name: 'plane',
      position: Cesium.Cartesian3.fromDegrees(bjCoord[1][0], bjCoord[1][1], -250000),
      plane: {
        plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
        dimensions: new Cesium.Cartesian2(1000000.0, 1000000.0),
        material: Cesium.Color.RED
      }
    })
    viewer.flyTo(plane)
  }
}
// 地形与水波纹加载
const setTerrain = async (status) => {
  if (status === 'add') {
    viewer.terrainProvider = await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    })
  } else {
    viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider()
  }
}

const setTileCoordinates = async (status) => {
  let hasCoord = false
  let index
  viewer.imageryLayers._layers.forEach((item, i) => {
    if (item._imageryProvider.name == 'coord') {
      hasCoord = true
      index = i
    }
  })
  if (status === 'add') {
    if (!hasCoord) {
      const layer = new Cesium.TileCoordinatesImageryProvider()
      layer.name = 'coord'
      viewer.imageryLayers.addImageryProvider(layer)
    }
  } else {
    if (hasCoord) {
      viewer.imageryLayers.remove(viewer.imageryLayers.get(index))
    }
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
