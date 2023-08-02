<script setup>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'
import mapJson from '../assets/map/map'

let map
function mctGeo() {
  var mctXX = document.getElementById('mctX').value
  var mctYY = document.getElementById('mctY').value
  var mctXY = new BMap.Pixel(mctXX, mctYY)

  var projection2 = map.getMapType().getProjection()
  var LngLat = projection2.pointToLngLat(mctXY)

  document.getElementById('pointX').innerHTML = '经纬度lng: ' + LngLat.lng
  document.getElementById('pointY').innerHTML = '经纬度lat: ' + LngLat.lat
}
onMounted(async () => {
  map = new BMap.Map('map')
  const projection = map.getMapType().getProjection()

  const content = mapJson.content
  const profile_geo = content[0].profile_geo || content[0].geo
  console.log(profile_geo.split(';')[1])

  const allArr = profile_geo.split(';')
  const startPoint = allArr[0].split('|')[1]
  const centerPoint = allArr[1].split('|')[0]
  const endPoint = allArr[1].split('|')[1]
  const mkCoor = (startPoint + centerPoint + endPoint).split(',')
  console.log(mkCoor, 'mkcoor')
  const mapGroup = []
  mkCoor.forEach((item, i) => {
    if (i > 0 && i % 2 == 0) {
      const mctYY = mkCoor[i - 1]
      const mctXX = item
      const mctXY = new BMap.Pixel(mctXX, mctYY)
      const LngLat = projection.pointToLngLat(mctXY)
      mapGroup.push([LngLat.lng, LngLat.lat])
    }
  })
  console.log(JSON.stringify(mapGroup))
})
</script>

<template>
  <main>
    <div class="cesiumContainer" id="cesiumContainer">
      <div id="map"></div>
      <div style="width: 500px; height: 270px; float: left; margin: 30px 0 0 10px">
        <p>墨卡托坐标x:<input type="text" value="12128773.43" id="mctX" /></p>
        <p>墨卡托坐标y:<input type="text" value="4040249.00" id="mctY" /></p>
        <p id="pointX"></p>
        <p id="pointY"></p>
        <p id="entertaiment"></p>
        <p>
          <input
            style="width: 400px; height: 80px; font-size: 30px"
            type="button"
            value="墨卡托坐标转经纬度坐标"
            @click="mctGeo"
          />
        </p>
        <div id="panel"></div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.cesiumContainer {
  width: 100%;
  height: 100vh;
}
</style>
