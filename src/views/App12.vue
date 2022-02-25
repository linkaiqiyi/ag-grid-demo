<template>
  <div style="height: calc(100vh - 100px)">
    <ag-grid-vue
      style="width: 100%; height: 100%"
      class="ag-theme-alpine"
      id="myGrid"
      :columnDefs="columnDefs"
      @grid-ready="onGridReady"
      :defaultColDef="defaultColDef"
      :rowDragManaged="true"
      :rowDragMultiRow="true"
      :suppressMoveWhenRowDragging="true"
      :rowSelection="rowSelection"
      :animateRows="true"
      :rowData="rowData"
      :enableMultiRowDragging="true"
      :suppressPropertyNamesCheck="true"
    ></ag-grid-vue>
  </div>
</template>

<script>
import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

export default {
  components: {
    "ag-grid-vue": AgGridVue,
  },
  data: function () {
    return {
      columnDefs: [
        { field: "athlete", rowDrag: true },
        { field: "country" },
        { field: "year", width: 100 },
        { field: "date" },
        { field: "sport" },
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
      ],
      gridApi: null,
      columnApi: null,
      defaultColDef: {
        width: 170,
        sortable: true,
        filter: true,
      },
      rowSelection: null,
      rowData: null,
    };
  },
  created() {
    this.rowSelection = "multiple";
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      const updateData = (data) => params.api.setRowData(data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    },
  },
};
</script>

<style>
.example-wrapper {
  display: flex;
  height: 100%;
}

.inner-col {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}

.inner-col.vertical-toolbar {
  display: flex;
  flex: none;
  width: 100px;
  align-items: center;
  justify-content: center;
}

.toolbar {
  height: 30px;
  white-space: nowrap;
}

.vertical-toolbar > span {
  padding: 10px;
  margin: 10px;
  cursor: default;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-modify: none;
}

button.factory {
  height: 25px;
  border-radius: 5px;
  border: none;
  color: white;
  outline: none;
  cursor: pointer;
  margin-right: 2px;
}

button i {
  margin-right: 10px;
}

.bin i {
  transform: scale(1);
  transition: transform 500ms;
}

.factory-red {
  background-color: indianred;
}

.factory-green {
  background-color: darkseagreen;
}

.factory-blue {
  background-color: cornflowerblue;
}

.green-row {
  background-color: #ddffdd !important;
}

.red-row {
  background-color: #ffdddd !important;
}

.blue-row {
  background-color: #ddddff !important;
}
</style>