import Vue from "vue";
import App from "@/views/App.vue";
import App2 from "@/views/App2.vue";
import App3 from "@/views/App3.vue";
import App4 from "@/views/App4.vue";
import App5 from "@/views/App5.vue";
import App6 from "@/views/App6.vue";
import App7 from "@/views/App7.vue";
import App9 from "@/views/App9.vue";
import App11 from "@/views/App11.vue";
import App12 from "@/views/App12.vue";
import App13 from "@/views/App13.vue";

import { LicenseManager } from "ag-grid-enterprise";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
Vue.config.productionTip = false;

LicenseManager.prototype.isDisplayWatermark = () => false;
LicenseManager.prototype.outputMissingLicenseKey = () => {};

new Vue({
  render: (h) => h(App13)
}).$mount("#app");
