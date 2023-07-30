<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue'
import { getViewerInitConfig } from '../utils/config'
const root = ref(null)
let viewer

onMounted(async () => {
  viewer = new Cesium.Viewer(root.value, {
    infoBox: false, //Disable InfoBox widget
    selectionIndicator: true, //Disable selection indicator
    shouldAnimate: true, // Enable animations
    terrain: Cesium.Terrain.fromWorldTerrain()
  })

  //Enable lighting based on the sun position
  viewer.scene.globe.enableLighting = true

  //Enable depth testing so things behind the terrain disappear.
  viewer.scene.globe.depthTestAgainstTerrain = true

  //Set the random number seed for consistent results.
  Cesium.Math.setRandomNumberSeed(3)

  //Set bounds of our simulation time
  const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16))
  const stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate())

  //设置查看器当前时间与结束时间
  viewer.clock.startTime = start.clone() // 开始时间
  viewer.clock.stopTime = stop.clone()  // 结束时间
  viewer.clock.currentTime = start.clone() // 当前时间
  viewer.clock.clockRange = Cesium.ClockRange.CLAMPED //Loop at the end
  viewer.clock.multiplier = 10

  //Set timeline to simulation bounds
  viewer.timeline.zoomTo(start, stop)

  //Generate a random circular pattern with varying heights.
  function computeCirclularFlight(lon, lat, radius) {
    const property = new Cesium.SampledPositionProperty()
    for (let i = 0; i <= 360; i += 45) {
      const radians = Cesium.Math.toRadians(i)
      const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate())
      const position = Cesium.Cartesian3.fromDegrees(
        lon + radius * 1.5 * Math.cos(radians),
        lat + radius * Math.sin(radians),
        Cesium.Math.nextRandomNumber() * 500 + 1750
      )
      property.addSample(time, position)

      //Also create a point for each sample we generate.
      viewer.entities.add({
        position: position,
        point: {
          pixelSize: 8,
          color: Cesium.Color.TRANSPARENT,
          outlineColor: Cesium.Color.RED,
          outlineWidth: 3
        }
      })
    }
    return property
  }

  //Compute the entity position property.
  const position = computeCirclularFlight(-112.110693, 36.0994841, 0.03)

  //Actually create the entity
  const entity = viewer.entities.add({
    //Set the entity availability to the same interval as the simulation time.
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: start,
        stop: stop
      })
    ]),

    //Use our computed positions
    position: position,

    //Automatically compute orientation based on position movement.
    orientation: new Cesium.VelocityOrientationProperty(position),

    //Load the Cesium plane model to represent the entity
    model: {
      uri: './glb/air.glb',
      minimumPixelSize: 64
    },

    //Show the path as a pink line sampled in 1 second increments.
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.1,
        color: Cesium.Color.YELLOW
      }),
      width: 10
    }
  })

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
