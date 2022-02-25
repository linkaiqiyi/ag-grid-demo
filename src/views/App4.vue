<template>
  <div style="height: 100%">
    <ag-grid-vue
      style="width: 100%; height: calc(100vh - 16px)"
      class="ag-theme-alpine"
      id="myGrid"
      :columnDefs="columnDefs"
      @grid-ready="onGridReady"
      :defaultColDef="defaultColDef"
      :animateRows="true"
      :gridOptions="gridOptions"
      :groupDisplayType="'groupRows'"
      :rowDragManaged="true"
      :suppressMoveWhenRowDragging="true"
      :row-data="gridOptions.rowData"
      :groupRowRendererFramework="'FullWidthCellRenderer'"
      :groupDefaultExpanded="groupDefaultExpanded"
      :isFullWidthCell="handleIsFullWidthCell"
      :fullWidthCellRenderer="'FullWidthCellRenderer'"
      :autoGroupColumnDef="autoGroupColumnDef"
      :immutableData="true"
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

import olympicWinnersData from "@/mock/data4";
import FullWidthCellRenderer from "@/components/fullWidthCellRenderer";
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
  data: function () {
    var rowDrag = function (params) {
      return !params.node.group;
    };

    return {
      immutableStore: [],
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
          hide: true,
        },
        { field: "athlete", rowDrag: rowDrag },
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
    onRowDragMove: debounce(function (event) {
      //   var movingNode = event.node;
      //   var overNode = event.overNode;
      //   this.gridOptions.rowDragManaged = false;
      //   console.log(event);
      //   this.gridApi.forEachNode((node, index) => {
      //       if(node === overNode) {
      //           console.log(node, index);
      //       }
      //       }
      //   })
      //   if (movingNode !== overNode) {
    //   this.gridOptions.rowDragManaged = true;
      //     var movingData = movingNode.data;
      //     var overData = overNode.data;
      //     if (movingData && overData) {
      //       if (movingData.groupId !== overData.groupId) {
      //         if (event.nodes) {
      //           event.nodes.map((node) => {
      //             this.changeGroup(node, overNode);
      //           });
      //         }
      //         this.changeGroup(movingNode, overNode);
      //       }
      //     }
      //   }
    }, 10),
    onRowDragEnd: function (event) {
      //   this.gridOptions.rowDragManaged = false;
      console.log(event);
      var movingNode = event.node;
      var overNode = event.overNode;
      if (movingNode && overNode) {
        // let movingData = movingNode.data;
        // let overData = overNode.data;
        // if (overData) {
        //   if (movingData.groupId !== overData.groupId) {
        //     movingData.groupId = overData.groupId;
        //   } else if (overData.groupId === overData.groupId) {
        //     this.gridOptions.rowDragManaged = true;
        //   }
        // }
        // if (overData && movingData.groupId !== overData.groupId) {
        //   this.gridApi.refreshClientSideRowModel();
        //   this.gridApi.setRowData(this.gridOptions.rowData);
        //   //   this.gridApi.applyTransaction({ update: [movingData] });
        // }
      }
    },
    changeGroup(movingNode, overNode) {
      let moveData = movingNode.data;
      let overData = overNode.data;
      moveData.groupId = overData.groupId;
    },
    moveRowData(movingData, overData) {
      let immutableStore = this.gridOptions.rowData;
      let fromIndex = immutableStore.indexOf(movingData);
      let toIndex = immutableStore.indexOf(overData);
      let newStore = immutableStore.slice();
      moveInArray(newStore, fromIndex, toIndex);
      this.gridOptions.rowData = newStore;
      this.gridApi.setRowData(newStore);
      this.gridApi.clearFocusedCell();
      //   this.gridApi.applyTransaction({update: this.gridOptions.rowData});
      this.gridApi.refreshClientSideRowModel();

      function moveInArray(arr, fromIndex, toIndex) {
        let element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      this.immutableStore = JSON.parse(JSON.stringify(olympicWinnersData));
      //   params.api.setRowData(this.immutableStore);
      this.gridOptions.rowData = this.immutableStore;
    },
  },
};
</script>

<style>
</style>