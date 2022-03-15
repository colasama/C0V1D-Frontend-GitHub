import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import store from './store'
import animate from 'animate.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ECharts from 'vue-echarts'
import AV from 'leancloud-storage'
import Chat from 'vue-beautiful-chat'


const APP_ID = "l4G34TglylQxfQiM4q56Y3Ig-gzGzoHsz";
const APP_KEY = "I90Put9mSH7vtNScLBs28pBi";
const SERVER_URL = "https://l4g34tgl.lc-cn-n1-shared.com";
AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
    serverURLs: SERVER_URL
})

Vue.use(VueAxios, axios)
Vue.use(Antd)
Vue.use(animate) //动画库插件
Vue.use(Chat) // chat chat
Vue.component('v-chart', ECharts)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$AV = AV

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')