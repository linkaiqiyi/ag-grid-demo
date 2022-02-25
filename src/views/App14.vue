<template>
  <div style="height: calc(100vh - 100px)">
    <AgGridVue
      style="width: 100%; height: 100%"
      class="ag-theme-alpine"
      id="myGrid"
    />
    <hr />
  </div>
</template>

<script>
import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import App14Compositions from "@/compositions/App14/index.js";
import { isRef, ref, toRefs } from "@vue/composition-api";

export default {
  components: {
    AgGridVue,
  },
  setup(props, context) {
    const { addCount, count } = App14Compositions().useCount();
    const { addCount: addCount2, count: count2 } = App14Compositions().useCount();
    return { count, addCount, addCount2, count2 };
  },
  methods: {},
};
</script>

<style>
</style>