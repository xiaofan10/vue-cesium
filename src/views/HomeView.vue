<script setup>
import {Viewer, Ion} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onMounted } from "vue";


onMounted(() => {
  console.log(document.getElementById('cesiumContainer'))
  Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwODQzYmNiNS1mZjM5LTRmN2UtYmFhNy05ZTdlMWQ3NDg0YTYiLCJpZCI6MTU1NDg2LCJpYXQiOjE2ODk5MDkwNTR9.6yDZWcBPP7Zb6-wU-aMXGTqcuA6yzqg4WEwFc8QD7qY'
  const viewer = new Viewer("cesiumContainer");
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
