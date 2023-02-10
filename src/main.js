import Vue from 'vue'
import App from './App.vue'
import LineChart from '@/components/charts/LineChart/LineChart.vue';

import './assets/main.css'

Vue.component('LineChart', LineChart)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
