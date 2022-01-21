<template>
  <div style="height: calc(100vh - 100px)">
    <button @click="reverseAgGridData">reverseAgGridData</button>
    <button @click="addAgGridData">addAgGridData</button>
    <button @click="addTitle1">addTitle1</button>
    <button @click="deleteTitle1">deleteTitle1</button>
    <button @click="changeGroup">changeGroup</button>
    <AgGridVue
      style="width: 100%; height: 100%"
      class="ag-theme-alpine"
      id="myGrid"
      :gridOptions="gridOptions"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import useAgGrid from "./compositions/App13/useAgGrid";

export default {
  components: {
    AgGridVue,
  },
  setup(props, context) {
    const {
      gridAPi,
      columnApi,
      onGridReady,
      gridOptions,
      reverseAgGridData,
      addAgGridData,
      addTitle1,
      deleteTitle1,
      changeGroup,
    } = useAgGrid();
    return {
      gridAPi,
      columnApi,
      onGridReady,
      gridOptions,
      reverseAgGridData,
      addAgGridData,
      addTitle1,
      deleteTitle1,
      changeGroup,
    };
  },
  methods: {},
};
</script>

<style>
</style>