import Vue from "vue";

import { LicenseManager } from "ag-grid-enterprise";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
Vue.config.productionTip = false;

import '@/styles/aggrid.scss' // global css

LicenseManager.prototype.isDisplayWatermark = () => false;
LicenseManager.prototype.outputMissingLicenseKey = () => { };

const Apps = {}
function importAll(r) {
  r.keys().forEach(key => {
    let name = key.replace(/^(\.\/)(.+)(.vue)$/, '$2')
    Apps[name] = r(key).default
  });
}

importAll(require.context('@/views', false, /.vue$/))

new Vue({
  render: (h) => h(Apps['App14'])
}).$mount("#app");
