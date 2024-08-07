'use client'
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useCallback, useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {fetchItemsFromAPI, pushInvoiceToAPI} from "@/services/client/invoice.service"
import {Button, Toast} from "react-bootstrap";
import styles from './inventoryList.module.css'

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
                { field: 'name', flex: 3 },
                { field: 'price', flex: 1, valueFormatter: params => currencyFormatter(params.data.price, 'Rs.'), type: "rightAligned" },
                { field: 'quantity', flex: 1 },
            ]);
        });
    }, [key, showActiveOnly]);  // Refetch when key changes

    return (
        <div className={styles.itemGridContainer}>
            <div style={{ height: "98vh" }} className={"ag-theme-quartz"}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowSelection={"multiple"}
                />
            </div>
        </div>
    );

    function currencyFormatter(currency, sign) {
        if (currency === undefined) {
            currency = 0;
        }
        const sansDec = currency.toFixed(2);
        const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return sign + `${formatted}`;
    }
};

export default InventoryList;