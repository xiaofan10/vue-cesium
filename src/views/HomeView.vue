<script setup>
import { Viewer, Ion, Cartesian3,Color ,LabelStyle,Cartesian2, VerticalOrigin} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

onMounted(() => {
  console.log(document.getElementById('cesiumContainer'))
  Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwODQzYmNiNS1mZjM5LTRmN2UtYmFhNy05ZTdlMWQ3NDg0YTYiLCJpZCI6MTU1NDg2LCJpYXQiOjE2ODk5MDkwNTR9.6yDZWcBPP7Zb6-wU-aMXGTqcuA6yzqg4WEwFc8QD7qY'
  const viewer = new Viewer('cesiumContainer')
  viewer.scene.debugShowFramesPerSecond = true
  var redBox = viewer.entities.add({
    name: 'Red box with black outline',
    position: Cartesian3.fromDegrees(-107.0, 40.0, -50000.0),
    box: {
      dimensions: new Cartesian3(400000.0, 300000.0, 100000.0),
      material: Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Color.BLACK
    },
    label: {
    text: "Citizens Bank Park",
    font: "14pt monospace",
    style: LabelStyle.FILL_AND_OUTLINE,
    outlineWidth: 2,
    verticalOrigin: VerticalOrigin.BOTTOM,
    pixelOffset: new Cartesian2(0, -9),
  }
  })

  viewer.zoomTo(viewer.entities)
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
