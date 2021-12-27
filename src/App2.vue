<template>
  <ag-grid-vue
    style="width: 100%; height: calc(100vh - 16px)"
    class="ag-theme-alpine"
    id="myGrid"
    :columnDefs="columnDefs"
    @grid-ready="onGridReady"
    :defaultColDef="defaultColDef"
    :rowModelType="rowModelType"
    :serverSideStoreType="serverSideStoreType"
    :animateRows="true"
  ></ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import FullWidthCellRenderer from "./components/fullWidthCellRenderer";
import "ag-grid-enterprise";
import data from "./data.js";
export default {
  components: { AgGridVue },
  data: function () {
    return {
      columnDefs: [
        { field: "athlete", minWidth: 220 },
        { field: "country", minWidth: 200 },
        { field: "year" },
        { field: "sport", minWidth: 200 },
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
      ],
      gridApi: null,
      columnApi: null,
      defaultColDef: {
        sortable: true,
        flex: 1,
        minWidth: 100,
        resizable: true,
        menuTabs: ["filterMenuTab"],
      },
      rowModelType: null,
      serverSideStoreType: null,
    };
  },
  created() {
    this.rowModelType = "serverSide";
    this.serverSideStoreType = "partial";
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      const updateData = (data) => {
        var fakeServer = createFakeServer(data);
        var datasource = createServerSideDatasource(fakeServer);
        params.api.setServerSideDatasource(datasource);
      };
        fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
          .then((resp) => resp.json())
          .then((data) => updateData(data));
    },
  },
};
window.createServerSideDatasource = function createServerSideDatasource(
  server
) {
  console.log(server);
  return {
    getRows: async function (params) {
      var response = await server.getData(params.request);
      if (response.success) {
        params.success({ rowData: response.rows });
      } else {
        params.fail();
      }
    },
  };
};

window.createFakeServer = function createFakeServer(allData) {
  return {
    getData: function (request) {
      var requestedRows = allData.slice();
      return {
        success: true,
        rows: requestedRows,
      };
    },
  };
};
</script>

<style lang="scss">
@import "~ag-grid-community/src/styles/ag-grid.scss";
@import "~ag-grid-community/src/styles/ag-theme-alpine/sass/_ag-theme-alpine-mixin.scss";

.ag-theme-alpine {
  @include ag-theme-alpine();
}
</style>