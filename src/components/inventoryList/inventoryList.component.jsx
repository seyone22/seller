'use client';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useCallback, useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {fetchItemsFromAPI, updateItem} from "@/services/client/item.service";
import styles from './inventoryList.module.css';
import { currencyFormatter } from "@/utils/formatters";

const InventoryList = ({ key, showActiveOnly }) => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);

    useEffect(() => {
        fetchItemsFromAPI('item', showActiveOnly).then(data => {
            setRowData(data);
            setColumnDefs([
                { field: '_id', flex: 2 },
                { field: 'itemCode', flex: 2 },
                { field: 'name', flex: 3 , editable: true },
                { field: 'price', flex: 1, valueFormatter: params => currencyFormatter(params.data.price, 'Rs.'), type: "rightAligned" , editable: true},
                { field: 'quantity', flex: 1, editable: true },
            ]);
        });
    }, [key, showActiveOnly]);  // Refetch when key or showActiveOnly changes

    const onCellValueChanged = useCallback(async (params) => {
        try {
            const updatedItem = {
                _id: params.data._id,
                [params.colDef.field]: params.newValue,
            };
            // Send the updated data to the server
            const response = await updateItem(updatedItem, params.data._id);
            if (!response.success) {
                console.error("Failed to update item:", response.error);
            } else {
                console.log("Item updated successfully!");
            }
        } catch (error) {
            console.error("Error updating item:", error);
        }
    }, []);

    return (
        <div className={styles.itemGridContainer}>
            <div style={{ height: "88vh" }} className={"ag-theme-quartz"}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowSelection={"single"}
                    onCellValueChanged={onCellValueChanged}
                />
            </div>
        </div>
    );
};

export default InventoryList;
