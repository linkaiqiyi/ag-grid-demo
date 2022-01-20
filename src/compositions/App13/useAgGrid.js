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
                { field: "gold" },
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
            }, 2000);
        })
    }

    const reverseAgGridData = function () {
        let data = immutableStore.value.slice().reverse()
        immutableStore.value = data

        gridApi.value.setRowData(immutableStore.value)
    }

    const addAgGridData = function () {
        let data = olympicWinnersData.sort(() => [-1, 0, 1][Math.floor(Math.random() * 3)]).slice()
        console.log(data.map(v => v.id));
        let temp = {
            athlete: '',
            age: 0,
            country: '',
            year: 0,
            date: '',
            sport: '',
            gold: 0,
            silver: 0,
            bronze: 0,
            total: 0,
            id: data.length + 1
        }

        data.splice(Math.floor(Math.random() * data.length), 0, temp)

        immutableStore.value = data
        gridApi.value.setRowData(immutableStore.value)

        gridApi.value.forEachNode(node => {
            if (node.data.id === temp.id) {
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

    const gridOptions = reactive({
        rowDragManaged: true,
        immutableData: true,
        columnDefs: columnDefs,
        getRowNodeId: getRowNodeId
    })

    const addTitle1 = function () {
        const columns = columnDefs
        const title2 = columns.find(v => v.headerName === 'title2')
        title2.children.push({ field: "date" })
        gridApi.value.setColumnDefs(columnDefs)
    }

    return {
        gridApi, columnApi, gridOptions, immutableStore, onGridReady, reverseAgGridData, addAgGridData, addTitle1, deleteTitle1
    }
}
