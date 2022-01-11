import { defineComponent } from "@vue/composition-api";

import { reactive, ref, nextTick } from "@vue/composition-api"

import olympicWinnersData from "../data4";

export default function compositionApp6() {
    let gridApi = ref(null);
    let columnApi = ref(null);
    let immutableStore = ref([]);

    let gridApiValue = null
    let columnApiValue = null

    const onGridReady = (params) => {
        immutableStore.value = olympicWinnersData
        gridApi.value = params.api;
        columnApi.value = params.columnApi
        gridApiValue = gridApi.value
        columnApiValue = columnApi.value
        params.api.setRowData(immutableStore.value);
    }

    const reverseItems = () => {
        immutableStore.value.sort((a, b) => a.year - b.year);
        gridApiValue.setRowData(immutableStore.value);
    }
    const removeOldClass = () => {
        let oldEles = Array.from(document.querySelectorAll(".hover-over"));
        oldEles.map((ele) => ele.classList.remove("hover-over"));

        let childEles = Array.from(
            document.querySelectorAll(".hover-over-child")
        );
        childEles.map((ele) => ele.classList.remove("hover-over-child"));
    }
    const onRowDragMove = (event) => {
        removeOldClass();
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
    }

    const onRowDragEnd = async (event) => {
        let movingNode = event.node;
        let overNode = event.overNode;
        if (movingNode.group) {
            if (overNode.group) {
                let movingData = movingNode.allLeafChildren.map((v) => v.data);
                let overData = overNode.allLeafChildren[0].data;
                let toUp = true;

                moveRowData(movingData, overData, toUp, true);
            } else {
                let movingData = movingNode.allLeafChildren.map((v) => v.data);
                let lastData =
                    overNode.parent.allLeafChildren[
                        overNode.parent.allLeafChildren.length - 1
                    ].data;
                let toUp = true;

                moveRowData(movingData, lastData, toUp, true);
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

            let selectNodes = gridApiValue.getSelectedNodes();
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

            moveRowData(needMoveData, overData, toUp);
        }
        removeOldClass();
    }
    const moveRowData = async (needMoveData, overData, up = false, groupMove = false) => {
        console.log(gridApi, columnApi);
        const { left } = gridApiValue.getHorizontalPixelRange() || { left: 0 };
        const { top } = gridApiValue.getVerticalPixelRange() || { top: 0 };

        const state = columnApiValue.getColumnState();
        const columnFilterState = gridApiValue.getFilterModel();

        let immutableData = []

        gridApiValue.forEachNode((node) => {
            if (!node.group) {
                if (needMoveData.findIndex((v) => v.id === node.data.id) === -1) {
                    immutableData.push(node.data);
                }
            }
        });

        if (groupMove || !up) {
            let toIndex = immutableData.findIndex(
                (v) => v.id === overData.id
            );
            immutableData.splice(toIndex + 1, 0, ...needMoveData);
        } else {
            let toIndex = immutableData.findIndex(
                (v) => v.groupId === overData.groupId
            );
            immutableData.splice(toIndex, 0, ...needMoveData);
        }

        immutableStore.value = immutableData;

        await gridApiValue.setRowData(immutableStore.value);
        columnApiValue.applyColumnState({ state });
        gridApiValue.setFilterModel(columnFilterState);

        if (left || top) {
            const headerScrollDom = document.querySelector(".ag-header-viewport");
            headerScrollDom && headerScrollDom.scrollTo({ left: left - 1 });
            nextTick(() => {
                const bodyScrollDom = document.querySelector(".ag-body-viewport");
                let t = top;
                bodyScrollDom && bodyScrollDom.scrollTo({ top: t - 1 });
            });
        }
    }

    return { gridApi, columnApi, immutableStore, onGridReady, reverseItems, removeOldClass, onRowDragMove, onRowDragEnd, moveRowData }
}