<template>
  <div>
    <button @click="addRow">添加行</button>
    <ag-grid-vue
      style="width: 100%; height: calc(100vh - 100px)"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
      :framework-components="gridOptions.frameworkComponents"
      :rowDragManaged="true"
      :isFullWidthCell="handleIsFullWidthCell"
      :fullWidthCellRenderer="'FullWidthCellRenderer'"
      :defaultColDef="defaultColDef"
      :postSort="postSort"
      :doesExternalFilterPass="doesExternalFilterPass"
      :isExternalFilterPresent="isExternalFilterPresent"
      :groupDisplayType="'custom'"
      :immutableData="true"
      :getRowNodeId="getRowNodeId"
      @grid-ready="onGridReady"
      @sortChanged="handleSortChanged"
      @filterChanged="handleFilterChanged"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import FullWidthCellRenderer from "@/components/fullWidthCellRenderer";
import "ag-grid-enterprise";
import data from "@/mock/data.js";

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
              sortable: false,
              rowDrag: true,
              // hide: true,
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
        // enableValue: true,
        // enableRowGroup: true,
        // enablePivot: true,
        sortable: true,
        filter: true,
        comparator: () => 0,
        menuTabs: ["filterMenuTab"]
      },
      country: null,
      sortchange: false,
      gridOptions: {
        frameworkComponents: { FullWidthCellRenderer },
      },
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
  methods: {
    createFullRow(node) {
      const newData = {
        isfull: true,
      };
    },
    addRow(node) {
      this.gridApi.applyTransaction({ add: [{ isfull: true }], addIndex: 3 });
    },
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
      // fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      //   .then((resp) => resp.json())
      //   .then((data) => updateData(data));
    },
    postSort(rowNodes) {
      console.log(rowNodes);
    },
    getRowNodeId(node) {
      return node.age + node.country + node.date;
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
      let rows = [];
      this.gridApi.forEachNode((rowNode) => {
        if (rowNode.displayed) {
          rows.push(JSON.parse(JSON.stringify(rowNode.data)));
        } else if (rowNode.data && rowNode.data.isfull) {
          rows.push(JSON.parse(JSON.stringify(rowNode.data)));
        }
        // if(rowNode.data && rowNode.data.isfull) {
        //   console.log(rowNode);
        //   rowNode.setDisplayed = () => {}
        //   rowNode.setRowIndex = () => {}
        // }
      });
      // this.country.map((y) => {
      //     temp = [...temp, { isfull: true, country: y }];
      //   });
      //   data = [...data, ...temp].sort((a, b) =>
      //     a.country > b.country ? 0 : -1
      //   );
      //   params.api.setRowData(data);
      this.gridApi.setRowData(rows);
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
