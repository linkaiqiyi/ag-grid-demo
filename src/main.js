import Vue from 'vue'
import App from './App.vue'
import App2 from './App2.vue'
import App3 from './App3.vue'
import App4 from './App4.vue'
import App5 from './App5.vue'
import App6 from './App6.vue'
import App7 from './App7.vue'
import App9 from './App9.vue'
import App11 from './App11.vue'
import App12 from './App12.vue'

import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
Vue.config.productionTip = false

import { LicenseManager } from 'ag-grid-enterprise'

LicenseManager.prototype.isDisplayWatermark = () => false
LicenseManager.prototype.outputMissingLicenseKey = () => {}

new Vue({
  render: h => h(App12),
}).$mount('#app')
