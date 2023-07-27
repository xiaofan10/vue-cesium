import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'mars3d-cesium/Build/Cesium/Widgets/widgets.css' //依赖的cesium库本身css
import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

import App from './App.vue'
import router from './router'
console.log(mars3d)
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

app.use(createPinia())
app.use(router)

app.mount('#app')
