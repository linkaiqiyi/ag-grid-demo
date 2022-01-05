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
      :isRowSelectable="handleIsRowSelectable"
      :animateRows="false"
      :gridOptions="gridOptions"
      :groupDisplayType="'groupRows'"
      :rowDragManaged="false"
      :immutableData="true"
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

import olympicWinnersData from "./data4";
import FullWidthCellRenderer from "./components/fullWidthCellRenderer";

export default {
  components: {
    "ag-grid-vue": AgGridVue,
  },
  data: function () {
    var rowDrag = function (params) {
      return !params.node.group;
    };

    return {
      groupId: 20,
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
    removeOldClass() {
      let oldEles = Array.from(document.querySelectorAll(".hover-over"));
      oldEles.map((ele) => ele.classList.remove("hover-over"));

      let childEles = Array.from(
        document.querySelectorAll(".hover-over-child")
      );
      childEles.map((ele) => ele.classList.remove("hover-over-child"));
    },
    handleIsRowSelectable(node) {
      return !node.group
    },
    onRowDragMove(event) {
      this.removeOldClass();
      if (event.node.group) {
        if (event.overNode.group) {
          let el = document.querySelector(
            `.ag-full-width-container .ag-row[row-index="${event.overNode.rowIndex}"]`
          );
          el && el.classList.add("hover-over");
          const dom = document.querySelector(".ag-dnd-ghost");
          if (dom) {
            dom.style.backgroundColor = "#ffffff";
          }
        } else {
          if (event.overNode && event.overNode.data) {
            let overNodes = event.overNode.parent.allLeafChildren;
            let lastNode = overNodes[overNodes.length - 1];
            let el = document.querySelector(
              `.ag-center-cols-container .ag-row[row-index="${lastNode.rowIndex}"]`
            );
            el && el.classList.add("hover-over");
            overNodes.map((v) => {
              let childel = document.querySelector(
                `.ag-center-cols-container .ag-row[row-index="${v.rowIndex}"]`
              );
              if (childel && !childel.classList.contains("hover-over-child")) {
                childel.classList.add("hover-over-child");
              }
            });
          }
        }
        return;
      }
      if (event.overNode && event.overNode.data) {
        let el = document.querySelector(
          `.ag-center-cols-container .ag-row[row-index="${event.overNode.rowIndex}"]`
        );
        el && el.classList.add("hover-over");
      } else {
        let el = document.querySelector(
          `.ag-full-width-container .ag-row[row-index="${event.overNode.rowIndex}"]`
        );
        el && el.classList.add("hover-over");
      }
    },
    sleep() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 2000);
      })
    },
   async onRowDragEnd(event) {
    //  await this.sleep()
      let movingNode = event.node;
      let overNode = event.overNode;
      if (movingNode.group) {
        if (overNode.group) {
          let movingData = movingNode.allLeafChildren.map((v) => v.data);
          let overData = overNode.allLeafChildren[0].data;
          let toUp = true;

          this.moveRowData(movingData, overData, toUp, true);
        } else {
          let movingData = movingNode.allLeafChildren.map((v) => v.data);
          let lastData =
            overNode.parent.allLeafChildren[
              overNode.parent.allLeafChildren.length - 1
            ].data;
          let toUp = true;

          this.moveRowData(movingData, lastData, toUp, true);
        }
      } else if (overNode !== movingNode) {
        let movingData = movingNode.data;
        let overData = overNode.data;
        let toUp = false;
        if (!overData) {
          overData = overNode.allLeafChildren[0].data;
          toUp = true;
        }
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

        needMoveData.map((v) => {
          v.groupId = overData.groupId;
        });

        this.moveRowData(needMoveData, overData, toUp);
      }
      this.removeOldClass();
    },
    async moveRowData(needMoveData, overData, up = false, groupMove = false) {
      const { left } = this.gridApi.getHorizontalPixelRange() || { left: 0 };
      const { top } = this.gridApi.getVerticalPixelRange() || { top: 0 };

      const state = this.gridColumnApi.getColumnState();
      const columnFilterState = this.gridApi.getFilterModel();

      let immutableStore = [];
      this.gridApi.forEachNode((node) => {
        if (!node.group) {
          if (needMoveData.findIndex((v) => v.id === node.data.id) === -1) {
            immutableStore.push(node.data);
          }
        }
      });

      if (groupMove || !up) {
        let toIndex = immutableStore.findIndex((v) => v.id === overData.id);
        immutableStore.splice(toIndex + 1, 0, ...needMoveData);
      } else {
        let toIndex = immutableStore.findIndex(
          (v) => v.groupId === overData.groupId
        );
        immutableStore.splice(toIndex, 0, ...needMoveData);
      }

      await this.gridApi.setRowData(immutableStore);
      this.gridColumnApi.applyColumnState({ state });
      this.gridApi.setFilterModel(columnFilterState);

      if (left || top) {
        const headerScrollDom = document.querySelector(".ag-header-viewport");
        headerScrollDom && headerScrollDom.scrollTo({ left: left - 1 });
        this.$nextTick(() => {
          const bodyScrollDom = document.querySelector(".ag-body-viewport");
          let t = top;
          bodyScrollDom && bodyScrollDom.scrollTo({ top: t - 1 });
          // setTimeout(() => {
          //   bodyScrollDom && bodyScrollDom.scrollTo({ top: t + 1 });
          // }, 0);
        });
      }
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
.hover-over-child {
  background-color: #eceaea !important;
}
.hover-over {
  border-bottom: 1px solid #30aa44 !important;
}
</style>