<template>
  <div style="height: 100%">
    <button @click="addRow">添加行</button>
    <ag-grid-vue
      style="width: 100%; height: calc(100vh - 100px)"
      class="ag-theme-alpine"
      id="myGrid"
      :columnDefs="columnDefs"
      @grid-ready="onGridReady"
      :defaultColDef="defaultColDef"
      :animateRows="false"
      :gridOptions="gridOptions"
      :groupDisplayType="'groupRows'"
      :rowDragManaged="false"
      :suppressMoveWhenRowDragging="true"
      :row-data="gridOptions.rowData"
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
      groupId: 7,
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
        {
          field: "country",
          cellClassRules: {
            "hover-over": (params) => {
              return params.node === this.overNode;
            },
          },
        },
        { field: "year", width: 100 },
        { field: "date" },
        { field: "sport" },
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
      ],
      overNode: null,
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
    onRowDragMove(event) {
      // console.log(event.overNode);
      if (event.overNode && event.overNode.data) {
        this.overNode = event.overNode;
        let oldEles = Array.from(document.querySelectorAll(".hover-over"));
        oldEles.map((ele) => ele.classList.remove("hover-over"));
        let el = document.querySelector(
          `.ag-center-cols-container .ag-row[row-index="${event.overNode.rowIndex}"]`
        );
        el.classList.add("hover-over");
      }
    },
    onRowDragEnd(event) {
      let movingNode = event.node;
      let overNode = event.overNode;

      if (overNode !== movingNode) {
        let movingData = movingNode.data;
        let overData = overNode.data;
        if (overData) {
          let needMoveData = [];

          let selectNodes = this.gridApi.getSelectedNodes();
          let selectDatas = selectNodes
            .filter((v) => !v.group)
            .map((v) => v.data);

          if (selectDatas.indexOf(movingData) > -1) {
            needMoveData = selectDatas;
          } else {
            needMoveData = [movingData];
          }

          this.moveRowData(needMoveData, overData);

          // this.gridApi.forEachNode((node) => {
          //   if (node.isSelected()) {
          //     node.setSelected(false);
          //   }
          // });
        }
      }
      let oldEles = Array.from(document.querySelectorAll(".hover-over"));
      oldEles.map((ele) => ele.classList.remove("hover-over"));
    },
   async moveRowData(needMoveData, overData) {
      let immutableStore = this.gridOptions.rowData.slice();
      // const { left } = (this.gridApi &&
      //   this.gridApi.getHorizontalPixelRange()) || { left: 0 };
      // const { top } = (this.gridApi &&
      //   this.gridApi.getVerticalPixelRange()) || { top: 0 };
      let removeIds = [];

      needMoveData.map((v) => {
        v.groupId = overData.groupId;
        let fromIndex = immutableStore.indexOf(v);
        immutableStore.splice(fromIndex, 1);
        removeIds.push({ id: v.id });
      });

      let toIndex = immutableStore.indexOf(overData);

      // this.gridOptions.rowData = newStore; // 可保持拖动后的顺序 但为造成滚动条问题

      this.gridApi.applyTransaction({
        remove: [...removeIds],
        add: [...needMoveData],
        addIndex: toIndex + 1,
      });

      this.gridApi.clearFocusedCell();
      // this.gridApi.refreshClientSideRowModel();

      let nodeDatas = [];
      this.gridApi.forEachNode((node) => {
        if (!node.group) {
          nodeDatas.push(node.data);
        }
      });
      console.log(nodeDatas.map((v) => v.id));
      // await this.gridApi.setRowData(nodeDatas);

      // this.gridApi.applyTransaction({update: nodeDatas})

      // setTimeout(() => {
      //   if (left || top) {
      //     const headerScrollDom = document.querySelector(".ag-header-viewport");
      //     headerScrollDom && headerScrollDom.scrollTo({ left });
      //     this.$nextTick(() => {
      //       const bodyScrollDom = document.querySelector(".ag-body-viewport");
      //       bodyScrollDom && bodyScrollDom.scrollTo({ top });
      //     });
      //   }
      // }, 0);
      this.gridApi.refreshClientSideRowModel();
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
      console.log(nodes);
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

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      this.gridOptions.rowData = olympicWinnersData;
      // params.api.setRowData(olympicWinnersData);
    },
  },
};
</script>

<style>
.hover-over {
  border-bottom: 1px solid #30aa44 !important;
}
</style>