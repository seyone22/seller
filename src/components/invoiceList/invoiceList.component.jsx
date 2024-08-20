'use client'
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {fetchInvoicesFromAPI} from "@/services/client/invoice.service"
import styles from './invoiceList.module.css'
import {currencyFormatter, dateFormatter} from "@/utils/formatters";

const InvoiceList = ({ key, showToday }) => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);

    useEffect(() => {
        fetchInvoicesFromAPI('invoice', showToday ? 'today' : 'all').then(data => {
            setRowData(data);
            setColumnDefs([
                { field: 'invoiceNumber', flex: 1 },
                { field: 'customer.name', flex: 1 },
                { field: 'date', flex: 2, valueFormatter: params => dateFormatter(params.data.date) },
                { field: 'paymentMethod', flex: 1 },
                { field: 'tendered', flex: 1, valueFormatter: params => currencyFormatter(params.data.tendered, 'Rs.'), type: "rightAligned" },
                { field: 'total', flex: 1, valueFormatter: params => currencyFormatter(params.data.total, 'Rs.'), type: "rightAligned" },
            ]);
        });
    }, [key, showToday]);  // Refetch when key changes

    return (
        <div className={styles.itemGridContainer}>
            <div style={{ height: "80vh" }} className={"ag-theme-quartz"}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowSelection={"multiple"}
                />
            </div>
        </div>
    );
};

export default InvoiceList;