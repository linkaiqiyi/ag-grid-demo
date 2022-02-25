<template>
  <div style="height: 100%">
    <button @click="addRow">添加行</button>
    <button v-on:click="reverseItems()">Reverse</button>
    <ag-grid-vue
      style="width: 100%; height: calc(100vh - 100px)"
      class="ag-theme-alpine"
      id="myGrid"
      :columnDefs="columnDefs"
      @grid-ready="onGridReady"
      :defaultColDef="defaultColDef"
      :isRowSelectable="handleIsRowSelectable"
      :animateRows="false"
      :gridOptions="gridOptions"
      :groupDisplayType="'groupRows'"
      :rowDragManaged="false"
      :suppressMoveWhenRowDragging="true"
      :groupRowRendererFramework="'FullWidthCellRenderer'"
      :groupDefaultExpanded="groupDefaultExpanded"
      :isFullWidthCell="handleIsFullWidthCell"
      :fullWidthCellRenderer="'FullWidthCellRenderer'"
      :autoGroupColumnDef="autoGroupColumnDef"
      :getRowNodeId="getRowNodeId"
      @row-drag-move="onRowDragMove"
      @rowDragEnd="onRowDragEnd"
    ></ag-grid-vue>
  </div>
</template>

<script>
import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import compositionApp6 from "@/compositions/App6.js";

import olympicWinnersData from "@/mock/data4";
import FullWidthCellRenderer from "@/components/fullWidthCellRenderer.vue";
function throttle(fn, wait) {
  let pre = Date.now();
  return function () {
    let context = this;
    let args = arguments;
    let now = Date.now();
    if (now - pre >= wait) {
      fn.apply(context, args);
      pre = Date.now();
    }
  };
}
function debounce(fn, delay) {
  var timer = null; // 声明计时器
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

export default {
  components: {
    "ag-grid-vue": AgGridVue,
  },

  setup(props, context) {
    const {
      gridApi,
      columnApi,
      onGridReady,
      immutableStore,
      reverseItems,
      removeOldClass,
      onRowDragMove,
      onRowDragEnd,
      moveRowData,
    } = compositionApp6();

    return {
      gridApi,
      columnApi,
      onGridReady,
      immutableStore,
      reverseItems,
      removeOldClass,
      onRowDragMove,
      onRowDragEnd,
      moveRowData,
    };
  },
  data: function () {
    var rowDrag = function (params) {
      return !params.node.group;
    };

    return {
      groupId: 20,
      columnDefs: [
        {
          headerName: "groupId - 1",
          showRowGroup: "groupId",
          cellRenderer: "FullWidthCellRenderer",
          minWidth: 200,
          hide: true,
        },
        {
          field: "groupId",
          rowGroup: true,
          // hide: true,
        },
        { field: "athlete", rowDrag: rowDrag },
        { field: "id" },
        {
          field: "country",
        },
        { field: "year", width: 100 },
        { field: "date" },
        { field: "sport" },
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
      ],
      overNode: null,
      defaultColDef: {
        width: 170,
        sortable: true,
        filter: true,
      },
      autoGroupColumnDef: {
        headerName: "asasdasd",
        minWidth: 0,
        width: 0,
        hide: true,
      },
      gridOptions: {
        rowData: [],
        suppressMoveWhenRowDragging: true,
        enableMultiRowDragging: true, // 多行拖动
        rowSelection: "multiple",
        frameworkComponents: { FullWidthCellRenderer },
      },
      groupDefaultExpanded: null,
    };
    // ag-center-cols-container row-index="1"
  },
  created() {
    this.groupDefaultExpanded = 1;
  },
  methods: {
    handleIsFullWidthCell(rowNode) {
      return rowNode.group;
    },
    getRowNodeId(rowNode) {
      return rowNode.id;
    },
    handleIsRowSelectable(node) {
      return !node.group;
    },
    sleep() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    },
    refreshRows(api, rowsToRefresh) {
      var params = {
        rowNodes: rowsToRefresh,
        force: true,
      };
      api.refreshCells(params);
    },
    addRow() {
      let nodes = this.gridApi.getSelectedNodes();
      if (nodes.length > 0) {
        let selectNode = nodes[0];
        let parent = selectNode.parent;
        let allLeafChildren = parent.allLeafChildren;
        let index = allLeafChildren.indexOf(selectNode);
        let newGroupChild = parent.allLeafChildren.slice(index);
        this.groupId++;
        newGroupChild.map((row) => (row.data.groupId = this.groupId));
        this.gridApi.refreshClientSideRowModel();
      }
    },
  },
};
</script>

<style>
.hover-over-child {
  background-color: #eceaea !important;
}
.hover-over {
  border-bottom: 1px solid #30aa44 !important;
}
</style>