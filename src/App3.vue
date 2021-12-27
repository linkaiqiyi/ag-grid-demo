<template>
  <ag-grid-vue
    style="width: 100%; height: calc(100vh - 16px)"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    :rowData="rowData"
    :gridOptions="gridOptions"
    :rowDragManaged="true"
    :isFullWidthCell="handleIsFullWidthCell"
    :fullWidthCellRenderer="fullWidthCellRenderer"
    :defaultColDef="defaultColDef"
    :postSort="postSort"
    :doesExternalFilterPass="doesExternalFilterPass"
    :isExternalFilterPresent="isExternalFilterPresent"
    :groupDisplayType="'custom'"
    @grid-ready="onGridReady"
    @sortChanged="handleSortChanged"
    @filterChanged="handleFilterChanged"
  >
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import FullWidthCellRenderer from "./components/fullWidthCellRenderer";
import "ag-grid-enterprise";
import data from "./data.js";

export function debounce(fn, delay) {
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
  name: "App",
  components: {
    AgGridVue,
    fullWidthCellRenderer: FullWidthCellRenderer,
  },

  data: function () {
    const _this = this;
    return {
      columnDefs: [
        {
          headerName: "Country",
          children: [
            {
              field: "country",
              minWidth: 200,
              sortable: true,
              rowDrag: true,
            },
          ],
        },
        {
          headerName: "Athlete",
          children: [
            {
              field: "athlete",
              filter: "agTextColumnFilter",
              minWidth: 200,
            },
            {
              field: "age",
              sortable: true,
            },
          ],
        },
        {
          headerName: "Competition",
          children: [{ field: "year" }, { field: "date", minWidth: 180 }],
        },
        { field: "sport", minWidth: 200 },
        {
          headerName: "Medals",
          children: [
            { field: "gold" },
            { field: "silver" },
            { field: "bronze" },
            { field: "total" },
          ],
        },
      ],
      gridApi: null,
      gridColumnApi: null,
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        sortable: true,
        filter: true,
        menuTabs: ['filterMenuTab'],
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
          if (
            valueA == valueB ||
            (nodeA && nodeA.data.isfull) ||
            (nodeB && nodeB.data.isfull)
          ) {
            return 0;
          }
          _this.sortchange = true;
          return valueA > valueB ? 1 : -1;
        },
      },
      country: null,
      sortchange: false,
      gridOptions: {},
      fullWidthCellRenderer: null,
      sideBar: null,
      rowData: null,
    };
  },
  watch: {
    sortchange: debounce(function (newValue) {
      if (newValue) {
        let state = this.gridColumnApi.getColumnState();
        let temp = false;
        state.map((v) => {
          if (v.sort && v.colId !== "country") {
            v.sortIndex++;
            temp = true;
          }
        });
        if (temp) {
          let s = state.find((v) => v.colId === "country");
          s.sort = "asc";
          s.sortIndex = 0;
        }
        this.gridColumnApi.applyColumnState({ state });
        this.sortchange = false;
      }
    }, 0),
  },
  created() {
    this.fullWidthCellRenderer = "fullWidthCellRenderer";
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      const updateData = (data) => {
        this.country = data.reduce((a, b) => {
          if (!a.includes(b.country)) {
            a.push(b.country);
          }
          return a;
        }, []);

        let temp = [];
        this.country.map((y) => {
          temp = [...temp, { isfull: true, country: y }];
        });
        data = [...data, ...temp].sort((a, b) =>
          a.country > b.country ? 0 : -1
        );
        params.api.setRowData(data);
      };

      updateData(data);
    },
    postSort(rowNodes) {
      if (rowNodes.length) {
          // this.sortchange = true;
      }
    },
    handleIsFullWidthCell(rowNode) {
      return rowNode.data.isfull;
    },
    isExternalFilterPresent() {
      // return this.gridApi && this.gridApi.getFilterModel();
    },
    doesExternalFilterPass(rowNode) {
      // console.log(rowNode);
      // if (rowNode.data && rowNode.data.isfull) {
      //   return true;
      // }
      // return true;
    },
    handleFilterChanged() {
      // let k = 0;
      // this.gridApi.forEachNode((rowNode) => {
      //   if (rowNode.data && rowNode.data.isfull) {
      //     rowNode.setDisplayed(true);
      //     rowNode.setRowIndex(parseInt(rowNode.rowTop / rowNode.rowHeight));
      //     console.log(rowNode);
      //   }
      // });
      // this.sortchange = true;
    },
    handleSortChanged(params) {
      // let rows = params.api.rowData
      // console.log(params, rows);
      // console.log(1212);
      // setTimeout(() => {
      //   let state = this.gridColumnApi.getColumnState();
      //   let temp = false;
      //   state.map((v) => {
      //     if (v.sort && v.colId !== "country") {
      //       v.sortIndex++;
      //       temp = true;
      //     }
      //   });
      //   console.log(2, state);
      //   if (temp) {
      //     let s = state.find((v) => v.colId === "country");
      //     s.sort = "asc";
      //     s.sortIndex = 0;
      //   }
      //   this.gridColumnApi.applyColumnState({ state });
      // }, 0);
    },
  },
};
</script>

<style lang="scss">
@import "~ag-grid-community/src/styles/ag-grid.scss";
@import "~ag-grid-community/src/styles/ag-theme-alpine/sass/_ag-theme-alpine-mixin.scss";

.ag-theme-alpine {
  @include ag-theme-alpine();
}
</style>
