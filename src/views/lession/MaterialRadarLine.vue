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
          <p>Material Setting</p>
          <Button class="button" type="primary" size="small" @click="setMaterialPolyLineLight()"
            >Polyline Light</Button
          >
          <Button class="button" type="primary" size="small" @click="setMaterialRadarLine()"
            >Radar Line</Button
          >
          <Button class="button" type="primary" size="small" @click="setMaterialRadarWave()"
            >Radar Wave</Button
          >
          <Button class="button" type="primary" size="small" @click="setMaterialRadarScan()"
            >Radar Scan</Button
          >
          <Button class="button" type="primary" size="small" @click="setMaterialEllipsoidTrail()"
            >Ellipsoid Trail</Button
          >
          <Button class="button" type="primary" size="small" @click="setMaterialCircleWave()"
            >Circle Wave</Button
          >
          <Button class="button" type="primary" size="small" @click="setMaterialWallDiffuse()"
            >Wall Diffuse</Button
          >
          <Button class="button" type="primary" size="small" @click="setMaterialWallDynamic()"
            >Wall Dynamic</Button
          >
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { getViewerInitConfig } from '@/utils/config'
import { Card, Button } from 'ant-design-vue'

const Cesium = inject('Cesium')

const cardStyle = {
  background: 'rgba(78,118,205,0.5)',
  color: '#fff'
}

const sheet = ref(null)
let viewer

const initCesium = () => {
  viewer = new Cesium.Viewer(sheet.value, getViewerInitConfig())
}

const setMaterialPolyLineLight = () => {
  const m = new Cesium.Scene.PolylineLightMaterialProperty({
    image: './img/colors.png',
    color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
    speed: 20.0,
    duration: 2000
  })
  console.log(m)
  const polylineEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    // polyline: {
    //   positions: [
    //     Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    //     Cesium.Cartesian3.fromDegrees(113.9236839, 22.428061),
    //     Cesium.Cartesian3.fromDegrees(113.8236839, 22.328061)
    //   ],
    //   // PolylineLightMaterialProperty
    //   material: m
    // }
    cylinder: {
      length: 500 / 2,
      topRadius: 0,
      bottomRadius: 10,
      material: new Cesium.Scene.CircleFadeMaterialProperty({
        color: Cesium.Color.fromCssColorString('#02ff00'),
        speed: 20.0
      }),
      slices: 128
    }
    // ellipse: {
    //   semiMajorAxis: 1000,
    //   semiMinorAxis: 1000,
    //   material: new Cesium.Scene.CircleFadeMaterialProperty({
    //     color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
    //     speed: 20.0
    //   })
    // }
  })
  viewer.zoomTo(polylineEntity)
}

const setMaterialRadarLine = () => {
  const radarEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      material: new Cesium.Scene.RadarLineMaterialProperty({
        color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
        speed: 20.0
      })
    }
  })
  const x = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.529161),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      material: new Cesium.Scene.RadarLineMaterialProperty({
        color: Cesium.Color.GREEN,
        speed: 10.0
      })
    }
  })
  viewer.zoomTo(radarEntity)
}

const setMaterialRadarWave = () => {
  const radarEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      material: new Cesium.Scene.RadarWaveMaterialProperty({
        color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
        speed: 20.0
      }),
      outline: true,
      outlineWidth: 5,
      outlineColor: Cesium.Color.RED
    }
  })
  viewer.zoomTo(radarEntity)
}

const setMaterialRadarScan = () => {
  const radarEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      material: new Cesium.Scene.RadarScanMaterialProperty({
        color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
        speed: 20.0
      })
    }
  })
  viewer.zoomTo(radarEntity)
}

const setMaterialEllipsoidTrail = () => {
  const ellipsoidEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, -1000),
    ellipsoid: {
      radii: new Cesium.Cartesian3(1000, 1000, 1000),
      material: new Cesium.Scene.EllipsoidTrailMaterialProperty({
        color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
        speed: 10.0
      })
    }
  })
  viewer.zoomTo(ellipsoidEntity)
}

const setMaterialCircleWave = () => {
  const ellipseEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, -1000),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      material: new Cesium.Scene.CircleWaveMaterialProperty({
        duration: 3000,
        gradient: 0,
        color: new Cesium.Color.fromCssColorString('#f00'),
        count: 4
      })
    }
  })
  viewer.zoomTo(ellipseEntity)
}

const setMaterialWallDiffuse = () => {
  const wallEntity = viewer.entities.add({
    wall: {
      positions: [
        Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 0),
        Cesium.Cartesian3.fromDegrees(114.9236839, 22.528061, 0),
        Cesium.Cartesian3.fromDegrees(114.9236839, 23.528061, 0),
        Cesium.Cartesian3.fromDegrees(113.9236839, 23.528061, 0),
        Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 0)
      ],
      maximumHeights: new Array(5).fill(5000),
      minimunHeights: new Array(5).fill(0),
      material: new Cesium.Scene.WallDiffuseMaterialProperty({
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
      })
    }
  })
  viewer.zoomTo(wallEntity)
}

const setMaterialWallDynamic = () => {
  const positions = [
    Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 0),
    Cesium.Cartesian3.fromDegrees(114.9236839, 22.528061, 0),
    Cesium.Cartesian3.fromDegrees(114.9236839, 23.528061, 0),
    Cesium.Cartesian3.fromDegrees(113.9236839, 23.528061, 0),
    Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 0)
  ]
  const maximumHeight = 5000
  let initHeight = 1000
  const wallEntity = viewer.entities.add({
    wall: {
      positions,
      // maximumHeights: new Cesium.CallbackProperty(() => {
      //   if (initHeight == maximumHeight) {
      //     initHeight = 1000
      //   } else {
      //     initHeight += initHeight * 0.04
      //     if (initHeight > maximumHeight) {
      //       initHeight = maximumHeight
      //     }
      //   }

      //   return new Array(positions.length).fill(initHeight)
      // }, false),
      maximumHeights: new Array(5).fill(10000),
      minimunHeights: new Array(5).fill(10000),
      material: new Cesium.Scene.WallDynamicMaterialProperty({
        image: './img/colors.png',
        freely: 'cross',
        direction: '+',
        count: 0,
        color: Cesium.Color.BLUE,
        duration: 1000
      })
    }
  })
  viewer.zoomTo(wallEntity)
}

onMounted(() => {
  initCesium()
})
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
      .button {
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
