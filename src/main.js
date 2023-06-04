import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { router } from "./router"
import VueResizeObserver from 'vue-resize-observer'

import { createPinia } from "pinia"
const Pinia = createPinia()


const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(Pinia)
app.use(VueResizeObserver)

import 'virtual:windi.css'
import "nprogress/nprogress.css"
import "./permission.js"
app.mount('#app')
