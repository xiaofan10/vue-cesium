<template>
  <div class="container">
    <div class="sheet" ref="sheet"></div>
    <div class="tooltip-trigger" :style="tooltipStyle">sdfsdfsdfs</div>
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
          <p>光照</p>
          <Button size="small" @click="setLight()">开启光照</Button>
          <Button size="small" @click="setFog()">开启雾</Button>
          <Button size="small" @click="setSceneSkyBox()">设置3D背景图片</Button>
          <Button size="small" @click="setMaterial()">设置材质</Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, onBeforeUnmount, ref, reactive, inject } from 'vue'
import { Card, Button, Tooltip } from 'ant-design-vue'
import { getViewerInitConfig } from '../../utils/config'
import { BaiduImageryProvider } from '../../utils/cesiumUtils'
import CesiumNavigation from 'cesium-navigation-es6'

const Cesium = inject('Cesium')

const cardStyle = {
  background: 'rgba(78,118,205,0.5)',
  color: '#fff'
}
const tooltipStyle = reactive({
  display: 'none',
  lett: '100px',
  top: '100px'
})

const tooltipVisible = ref(true)

const sheet = ref(null)
const tooltip = ref(null)
let viewer,
  tilesCollection = []

const setLight = () => {
  viewer.scene.globe.enableLighting = true
}
const setFog = () => {
  viewer.scene.fog.enabled = true
  // // 地球大气效果
  // viewer.scene.fog.minimunBrightness = 0.1
  // viewer.scene.fog.density = 0.0003
  // // 地表大气效果
  // viewer.scene.globe.showGroundAtmosphere = true // 地表大气效果开启
  // viewer.scene.globe.atmosphereLightIntensity = 50 // 地表大气亮度

  // 天空大气效果
  // viewer.scene.skyAtmosphere.show = true // 天空大气效果开启
  // viewer.scene.skyAtmosphere.atmosphereLightIntensity = 50 // 天空大气亮度
  // HDR
  viewer.scene.highDynamicRange = true
  // viewer.scene.post
}

// 获得渐变材质
const getLinearGradintMaterial = (colors, options = {}) => {
  if (!colors) return
  const canvas = document.createElement('canvas')
  const { width = 1, height = 100, materialOptions = {} } = options
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  // 创建渐变色
  const position = [
    [0, 0],
    [0, height]
  ]
  const linearGradient = ctx.createLinearGradient(...position.flat())
  if (Array.isArray(colors)) {
    colors.forEach((color) => {
      if (Array.isArray(color)) {
        linearGradient.addColorStop(...color.flat())
      }
    })
  }
  ctx.fillStyle = linearGradient
  ctx.fillRect(0, 0, 1, 100)

  return new Cesium.ImageMaterialProperty({
    image: canvas,
    transparent: true,
    // repeat: new Cesium.Cartesian2(200,1),
    ...materialOptions
  })
}

const setMaterial = () => {
  const r = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    name: '雷达线',
    ellipse: {
      semiMajorAxis: 1000.0,
      semiMinorAxis: 1000.0,
      material: new Cesium.Scene.RadarLineMaterialProperty({
        color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
        speed: 20.0
      })
    }
  })
  viewer.zoomTo(r)

  // 创建 Wall 图元
  // const material = new Cesium.Scene.DynamicWallMaterialProperty({
  //   color: Cesium.Color.fromBytes(55, 96, 56).withAlpha(0.7),
  //   duration: 3000,
  //   viewer,
  // })
  // console.log(material)
  // const entity = viewer.entities.add({
  //   position: Cesium.Cartesian3.fromDegrees(-100.0, 30.0, 10),

  //   wall: {
  //     positions: Cesium.Cartesian3.fromDegreesArray([-100.0, 30.0, -95.0, 35.0, -90.0, 30.0]),
  //     minimumHeights: [100000, 100000, 100000],
  //     material
  //     // getLinearGradintMaterial([
  //     //   [0, '#000'],
  //     //   [0.5, '#f0f'],
  //     //   [1, '#0f0']
  //     // ]),
  //   },
  //   label: {
  //     horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
  //     fillColor: Cesium.Color.BLUE,
  //     outlineColor: Cesium.Color.GREEN,
  //     text: '北京欢迎您',
  //     showBackground: true
  //   }
  // })

  // // 将视图缩放到 Wall 图元
  // viewer.zoomTo(entity)

  const clock = viewer.clock

  // // 设置起始时间和结束时间
  // clock.startTime = Cesium.JulianDate.fromIso8601('2023-01-01T00:00:00.00Z')
  // clock.stopTime = Cesium.JulianDate.fromIso8601('2023-12-31T23:59:59.99Z')

  // // 设置当前时间
  // clock.currentTime = clock.startTime

  // // 设置时钟速率（例如，1.0 表示正常速率，0.5 表示减慢一半速率）
  // clock.multiplier = 1.0

  // // 设置时钟步长（例如，设置为 10 表示每秒增加 10 秒）

  // // 开始动画
  // clock.shouldAnimate = true
  // 设置每帧更新的回调函数
  // viewer.clock.onTick.addEventListener(function (clock) {
  //   const elapsedSeconds = Cesium.JulianDate.secondsDifference(
  //     clock.currentTime,
  //     viewer.clock.startTime
  //   )
  //   const duration = Cesium.JulianDate.secondsDifference(
  //     viewer.clock.stopTime,
  //     viewer.clock.startTime
  //   )
  //   const percentage = elapsedSeconds / duration
  //   // 更新标签的背景颜色
  //   entity.label.backgroundColor = Cesium.Color.lerp(
  //     new Cesium.Color(1.0, 0.0, 0.0, 1.0), // 起始颜色，红色
  //     new Cesium.Color(0.0, 0.0, 1.0, 1.0), // 结束颜色，蓝色
  //     Math.random(),
  //     new Cesium.Color()
  //   )
  // })
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
  .tooltip-trigger {
    position: absolute;
    border: 1px solid #000;
    background: #000;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
  }
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
