<template>
  <div class="example-wrapper ag-theme-alpine">
    <div class="inner-col">
      <div
        style="height: calc(100vh - 100px)"
        class="inner-col"
        ref="eLeftGrid"
      >
        <ag-grid-vue
          style="height: 100%"
          :defaultColDef="defaultColDef"
          :getRowNodeId="getRowNodeId"
          :rowClassRules="rowClassRules"
          :rowDragManaged="true"
          :suppressMoveWhenRowDragging="true"
          :animateRows="true"
          :rowData="leftRowData"
          :columnDefs="columns"
          @grid-ready="onGridReady($event, 'Left')"
        >
        </ag-grid-vue>
      </div>
    </div>

    <div class="inner-col vertical-toolbar">
      <!-- <span class="bin" ref="eBin">
        <i class="far fa-trash-alt fa-3x" ref="eBinIcon"></i>
      </span> -->
    </div>

    <div class="inner-col">
      <div
        style="height: calc(100vh - 100px)"
        class="inner-col"
        ref="eMiddleGrid"
      >
        <ag-grid-vue
          style="height: 100%"
          :defaultColDef="defaultColDef"
          :getRowNodeId="getRowNodeId"
          :rowClassRules="rowClassRules"
          :rowDragManaged="true"
          :suppressMoveWhenRowDragging="true"
          :animateRows="true"
          :rowData="middleRowData"
          :columnDefs="columns"
          @grid-ready="onGridReady($event, 'Middle')"
        >
        </ag-grid-vue>
      </div>
    </div>

    <div class="inner-col vertical-toolbar">
      <!-- <span class="bin" ref="eBin">
        <i class="far fa-trash-alt fa-3x" ref="eBinIcon"></i>
      </span> -->
    </div>
    <div class="inner-col">
      <div
        style="height: calc(100vh - 100px)"
        class="inner-col"
        ref="eRightGrid"
      >
        <ag-grid-vue
          style="height: 100%"
          :defaultColDef="defaultColDef"
          :getRowNodeId="getRowNodeId"
          :rowClassRules="rowClassRules"
          :rowDragManaged="true"
          :suppressMoveWhenRowDragging="true"
          :animateRows="true"
          :rowData="rightRowData"
          :columnDefs="columns"
          @grid-ready="onGridReady($event, 'Right')"
        >
        </ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

let rowIdSequence = 100;

function createDataItem(color) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}

const createRowBlock = (blocks) =>
  Array.apply(null, Array(blocks || 1))
    .map(() => ["Red", "Green", "Blue"].map((color) => createDataItem(color)))
    .reduce((prev, curr) => prev.concat(curr), []);

export default {
  components: {
    "ag-grid-vue": AgGridVue,
  },
  data: function () {
    return {
      leftRowData: [],
      rightRowData: [],
      middleRowData: [],
      gridApis: [],
      leftApi: null,
      rightApi: null,
      middleApi: null,
      rowClassRules: {
        "red-row": 'data.color == "Red"',
        "green-row": 'data.color == "Green"',
        "blue-row": 'data.color == "Blue"',
      },
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        sortable: true,
        filter: true,
        resizable: true,
      },
      columns: [
        { field: "id", rowDrag: true },
        { field: "color" },
        { field: "value1" },
        { field: "value2" },
      ],
    };
  },
  beforeMount() {
    this.leftRowData = createRowBlock(2);
    this.rightRowData = createRowBlock(2);
    this.middleRowData = createRowBlock(2);
  },
  methods: {
    getRowNodeId(data) {
      return data.id;
    },

    onGridReady(params, side) {
      const api = params.api;
      if (side === "Left") {
        this.leftApi = api;
        this.gridApis.push(this.leftApi);
      } else if (side === "Right") {
        this.rightApi = api;
        this.gridApis.push(this.rightApi);
      } else if (side === "Middle") {
        this.middleApi = api;
        this.gridApis.push(this.middleApi);
      }

      if (this.leftApi && this.rightApi && this.middleApi) {
        this.addGridDropZone("Left", this.leftApi);
        // this.addGridDropZone("Right", this.rightApi);
        // this.addGridDropZone("Middle", this.middleApi);
      }
    },

    addGridDropZone(side, api) {
      let dropZones = this.gridApis.map((api) => api.getRowDropZoneParams());

      this.gridApis.map((api) => {
        dropZones.map((dropZone) => {
          api.removeRowDropZone(dropZone);
          api.addRowDropZone(dropZone);
        });
      });
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