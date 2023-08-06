import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Cesium from 'cesium'
import INSTALL_CESIUM_EXTEND from './lib/install'


import App from './App.vue'
import router from './router'

INSTALL_CESIUM_EXTEND(Cesium)
const app = createApp(App)

// MarsUIInstall(app, {
//   dialog: {
//     position: {
//       left: 50,
//       bottom: 50
//     },
//     warpper: '#mars-main-view'
//   }
// })
// 初始化Cesium

app.provide('Cesium', INSTALL_CESIUM_EXTEND(Cesium))

app.use(createPinia())
app.use(router)

app.mount('#app')
