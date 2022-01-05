<template>
  <div style="height: calc(100vh - 100px)">
    <div
      style="height: 100%; width: 100%; display: flex; flex-direction: column"
    >
      <div style="margin-bottom: 5px; min-height: 30px">
        <button v-on:click="reverseItems()">Reverse</button>
        <button v-on:click="addFiveItems(true)">Append</button>
        <button v-on:click="addFiveItems(false)">Prepend</button>
        <button v-on:click="removeSelected()">Remove Selected</button>
        <button v-on:click="updatePrices()">Update Prices</button>
        <button id="groupingOn" v-on:click="onGroupingEnabled(true)">
          Grouping On
        </button>
        <button id="groupingOff" v-on:click="onGroupingEnabled(false)">
          Grouping Off
        </button>
        <span
          style="
            border: 1px solid lightgrey;
            margin-left: 20px;
            padding: 8px;
            white-space: nowrap;
            display: inline-block;
          "
        >
          Group:
          <button v-on:click="setSelectedToGroup('A')">A</button>
          <button v-on:click="setSelectedToGroup('B')">B</button>
          <button v-on:click="setSelectedToGroup('C')">C</button>
        </span>
      </div>
      <div style="flex: 1 1 0px">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          id="myGrid"
          :columnDefs="columnDefs"
          @grid-ready="onGridReady"
          :defaultColDef="defaultColDef"
          :immutableData="true"
          :animateRows="true"
          :rowDragManaged="true"
          :rowSelection="rowSelection"
          :autoGroupColumnDef="autoGroupColumnDef"
          :statusBar="statusBar"
          :groupDefaultExpanded="groupDefaultExpanded"
          :getRowNodeId="getRowNodeId"
        ></ag-grid-vue>
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
window.getInitialData = function getInitialData() {
  var data = [];
  for (var i = 0; i < 5; i++) {
    data.push(createItem());
  }
  return data;
};

window.filter = function filter(list, callback) {
  var filteredList = [];
  list.forEach(function (item) {
    if (callback(item)) {
      filteredList.push(item);
    }
  });
  return filteredList;
};

window.createItem = function createItem() {
  var item = {
    group: "A",
    symbol: createUniqueRandomSymbol(),
    price: Math.floor(Math.random() * 100),
  };
  return item;
};

window.setGroupingEnabled = function setGroupingEnabled(enabled, columnApi) {
  if (enabled) {
    columnApi.applyColumnState({
      state: [
        {
          colId: "group",
          rowGroup: true,
          hide: true,
        },
        {
          colId: "symbol",
          hide: true,
        },
      ],
    });
  } else {
    columnApi.applyColumnState({
      state: [
        {
          colId: "group",
          rowGroup: false,
          hide: false,
        },
        {
          colId: "symbol",
          hide: false,
        },
      ],
    });
  }
  setItemVisible("groupingOn", !enabled);
  setItemVisible("groupingOff", enabled);
};

window.setItemVisible = function setItemVisible(id, visible) {
  var element = document.querySelector("#" + id);
  element.style.display = visible ? "inline" : "none";
};

window.createUniqueRandomSymbol = function createUniqueRandomSymbol() {
  var symbol;
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var isUnique = false;
  while (!isUnique) {
    symbol = "";
    for (var i = 0; i < 3; i++) {
      symbol += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    isUnique = true;
    immutableStore.forEach(function (oldItem) {
      if (oldItem.symbol === symbol) {
        isUnique = false;
      }
    });
  }
  return symbol;
};

var immutableStore;
export default {
  components: {
    "ag-grid-vue": AgGridVue,
  },
  data: function () {
    return {
      columnDefs: [
        { headerName: "Symbol", field: "symbol", rowDrag: true },
        { headerName: "Price", field: "price" },
        { headerName: "Group", field: "group" },
      ],
      gridApi: null,
      columnApi: null,
      defaultColDef: {
        width: 250,
        sortable: true,
        resizable: true,
      },
      rowSelection: null,
      autoGroupColumnDef: null,
      statusBar: null,
      groupDefaultExpanded: null,
      getRowNodeId: null,
    };
  },
  created() {
    this.rowSelection = "multiple";
    this.autoGroupColumnDef = {
      headerName: "Symbol",
      cellRenderer: "agGroupCellRenderer",
      field: "symbol",
    };
    this.statusBar = {
      statusPanels: [{ statusPanel: "agAggregationComponent", align: "right" }],
    };
    this.groupDefaultExpanded = 1;
    this.getRowNodeId = (data) => {
      return data.symbol;
    };
  },
  methods: {
    addFiveItems(append) {
      var newStore = immutableStore.slice();
      for (var i = 0; i < 5; i++) {
        var newItem = createItem();
        if (append) {
          newStore.push(newItem);
        } else {
          newStore.splice(0, 0, newItem);
        }
      }
      immutableStore = newStore;
      this.gridApi.setRowData(immutableStore);
    },
    removeSelected() {
      var selectedRowNodes = this.gridApi.getSelectedNodes();
      var selectedIds = selectedRowNodes.map(function (rowNode) {
        return rowNode.id;
      });
      immutableStore = immutableStore.filter(function (dataItem) {
        return selectedIds.indexOf(dataItem.symbol) < 0;
      });
      this.gridApi.setRowData(immutableStore);
    },
    setSelectedToGroup(newGroup) {
      var selectedRowNodes = this.gridApi.getSelectedNodes();
      var selectedIds = selectedRowNodes.map(function (rowNode) {
        return rowNode.id;
      });
      immutableStore = immutableStore.map(function (dataItem) {
        var itemSelected = selectedIds.indexOf(dataItem.symbol) >= 0;
        if (itemSelected) {
          return {
            symbol: dataItem.symbol,
            price: dataItem.price,
            group: newGroup,
          };
        } else {
          return dataItem;
        }
      });
      this.gridApi.setRowData(immutableStore);
    },
    updatePrices() {
      var newStore = [];
      immutableStore.forEach(function (item) {
        newStore.push({
          symbol: item.symbol,
          group: item.group,
          price: Math.floor(Math.random() * 100),
        });
      });
      immutableStore = newStore;
      this.gridApi.setRowData(immutableStore);
    },
    onGroupingEnabled(enabled) {
      setGroupingEnabled(enabled, this.gridColumnApi);
    },
    reverseItems() {
      // immutableStore.reverse();
      let f = immutableStore[0]
      immutableStore.splice(0, 1);
      immutableStore.push(f)
      this.gridApi.setRowData(immutableStore);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      immutableStore = [];
      immutableStore = getInitialData();
      params.api.setRowData(immutableStore);
      setGroupingEnabled(false, params.columnApi);
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