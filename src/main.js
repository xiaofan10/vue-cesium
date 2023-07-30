import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'
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
