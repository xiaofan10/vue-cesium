<script setup>
import { Button, Card } from 'ant-design-vue'

import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../utils/config'

const cardStyle = {
  background: 'rgba(78,118,205,0.5)',
  color: '#fff'
}

const root = ref(null)
let viewer

const ceatePolylineFun = (dataSource, points) => {
  // 制作路径
  const polylinePoints = points

  return dataSource.entities.add({
    name: 'polyline',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(polylinePoints.flat()),
      material: Cesium.Color.RED,
      width: 5
    }
  })
}

const JLTime = (start, end) => {
   // 中国时间
   const startDate = start ? new Date(start) : new Date()
  // time的时间戳
  let startTimestamp = startDate.getTime()
  let startTime = startDate
   // 朱利安时间
  let startJLTime = Cesium.JulianDate.fromDate(startDate)

  const stopDate = end ? new Date(end) : startDate
  // time的时间戳
  let stopTimestamp = stopDate.getTime()
  let stopTime = stopDate
   // 朱利安时间
  let stopJLTime = Cesium.JulianDate.fromDate(stopDate)
 
  return {
    startTime,
    startTimestamp,
    startJLTime,
    stopTime,
    stopTimestamp,
    stopJLTime
  }
}

onMounted(async () => {
  viewer = new Cesium.Viewer(root.value, getViewerInitConfig())

  // 管理一组entity
  const dataSource = new Cesium.CustomDataSource('testData')
  // 将该组自定义dataSource添加到Viewer中
  viewer.dataSources.add(dataSource)
  const polylinePoints = [
    [117.46, 31.1438, 11.1478],
    [117.459, 31.1437, 11.1477],
    [117.459, 31.1457, 11.1477],
    [117.458, 31.1435, 11.1475],
    [117.457, 31.1434, 11.1474]
  ]
  // 创建polyline
  const polyline = ceatePolylineFun(dataSource, polylinePoints)
  viewer.zoomTo(polyline)
  const timeObj = JLTime()

  // 简单的位置属性，用来做路径回放,移动entity的position属性
  const property = new Cesium.SampledPositionProperty()
  // 将位置添加到属性里
  polylinePoints.forEach((pos, i) => {
    const posTimestamp = timeObj.startTimestamp + i * 5000
    const posTime = new Date(posTimestamp)
    timeObj.stopTime = posTime
    property.addSample(Cesium.JulianDate.fromDate(posTime), Cesium.Cartesian3.fromDegrees(...pos))
  })

  // 设置差值，每次变化的度数
  property.setInterpolationOptions({
    interpolationDegree: 0.1, // 插值变化度数
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation // 插值规则（默认的）
  })

// // pinBuilder 小工具
  const pinBuilder = new Cesium.PinBuilder();
  const pinText = pinBuilder.fromText('这是一个飞机', Cesium.Color.RED, 150)
  const pinUrl = pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL()

//   //  改变朝向


  const path = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: Cesium.JulianDate.fromDate(timeObj.startTime),
        stop: Cesium.JulianDate.fromDate(timeObj.stopTime)
      })
    ]),
    position: property,
    billboard: {
      image: pinText,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },
    label: {
      text: '',
      fillColor: Cesium.Color.GREEN,
      pixelOffset: new Cesium.Cartesian2(100, -205)
    },
    model: {
      uri: './glb/air.glb'
    },
    path: {
      leadTime: 0,
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.1,
        color: Cesium.Color.GREEN
      }),
      width: 20
    },
    orientation: new Cesium.VelocityOrientationProperty(property) // 朝向
  })

  // 时间调整
  viewer.clock.onTick.addEventListener((tick) => {

      const pathTick = path.position.getValue(tick.currentTime)
      if(pathTick) {
        const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pathTick)
        cartographic.longitude = Cesium.Math.toDegrees(cartographic.longitude)
        cartographic.latitude = Cesium.Math.toDegrees(cartographic.latitude)
        path.label.text =  cartographic.longitude ? Number(cartographic.longitude).toFixed(4) : ''
      }
  })

  viewer.clock.currentTime = Cesium.JulianDate.fromDate(timeObj.startTime)
  viewer.clock.stopTime = Cesium.JulianDate.fromDate(timeObj.stopTime)
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
  viewer.clock.shouldAnimate = true
  viewer.trackedEntity = path
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
