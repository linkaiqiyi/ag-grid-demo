import { defineComponent } from "@vue/composition-api";

import { reactive, ref, nextTick } from "@vue/composition-api"
import olympicWinnersData from "../../data4";

export default function useAgGrid() {
    const gridApi = ref(null);
    const columnApi = ref(null);
    const immutableStore = reactive([])
    const columnDefs = reactive([
        {
            headerName: 'title1',
            children: [
                { field: "athlete", rowDrag: true },
                { field: "id", sortable: true },
            ]
        },
        {
            headerName: 'title2',
            children: [
                { field: "country", filter: true, editable: true },
                { field: "year", width: 100 },
            ]
        },
        {
            headerName: 'title3',
            children: [
                { field: "sport" },
                { field: "gold", rowGroup: true},
                { field: "silver" },
                { field: "bronze" },
            ]
        }
    ])

    const getRowNodeId = function (rowNodeData) {
        return rowNodeData.id
    }

    const getData = function () {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(olympicWinnersData.slice())
            }, 500);
        })
    }

    const reverseAgGridData = function () {
        let data = immutableStore.value.slice().reverse()
        immutableStore.value = data

        gridApi.value.setRowData(immutableStore.value)
    }

    const addAgGridData = function () {
        let data = olympicWinnersData.sort(() => [-1, 0, 1][Math.floor(Math.random() * 3)]).slice()
        let temp = {
            athlete: '',
            age: 0,
            country: '',
            year: 2000 + Math.floor(Math.random() * 5),
            date: '',
            sport: '',
            gold: 0,
            silver: 0,
            bronze: 0,
            total: 0,
            id: data.length + 1
        }

        // data.splice(Math.floor(Math.random() * data.length), 0, temp)
        data.unshift(temp)

        immutableStore.value = data
        gridApi.value.setRowData(immutableStore.value)

        gridApi.value.forEachNode(node => {
            if (node.data && node.data.id === temp.id) {
                node.setSelected(true)
                gridApi.value.ensureNodeVisible(node)
            } else {
                node.setSelected(false)
            }
        })
    }

    const deleteTitle1 = function () {
        const columns = columnDefs
        const title2 = columns.find(v => v.headerName === 'title2')
        let index = title2.children.findIndex(v => v.field === 'date')
        if (index !== -1) {
            title2.children.splice(index, 1)
            gridApi.value.setColumnDefs(columnDefs)
        }
    }

    const onGridReady = async function (params) {
        gridApi.value = params.api
        columnApi.value = params.columnApi

        immutableStore.value = await getData()

        params.api.setRowData(immutableStore.value)
    }

    const onRowDragMove = (event) => {
        var movingNode = event.node;
        var overNode = event.overNode;
        var rowNeedsToMove = movingNode !== overNode;
        if (rowNeedsToMove) {
            var movingData = movingNode.data;
            var overData = overNode.data;
            var fromIndex = immutableStore.value.indexOf(movingData);
            var toIndex = immutableStore.value.indexOf(overData);
            var newStore = immutableStore.value.slice();
            moveInArray(newStore, fromIndex, toIndex);
            immutableStore.value = newStore;
            gridApi.value.setRowData(newStore);
            gridApi.value.refreshClientSideRowModel('group')
        }
        function moveInArray(arr, fromIndex, toIndex) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }
    }

    const gridOptions = reactive({
        rowDragManaged: false,
        immutableData: true,
        columnDefs: columnDefs,
        getRowNodeId: getRowNodeId,
        suppressMoveWhenRowDragging: true,
        onRowDragEnd: onRowDragMove
    })

    const addTitle1 = function () {
        const columns = columnDefs
        const title2 = columns.find(v => v.headerName === 'title2')
        title2.children.push({ field: "date" })
        gridApi.value.setColumnDefs(columnDefs)
    }

    const changeGroup = function () {
        let item = immutableStore.value[0]
        item.year = '2022'
        gridApi.value.setRowData(immutableStore.value)
        console.log(immutableStore.value.map(v => v.year))
    }

    return {
        gridApi, columnApi, gridOptions, immutableStore, onGridReady, reverseAgGridData, addAgGridData, addTitle1, deleteTitle1, changeGroup
    }
}
