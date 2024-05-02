'use client'
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useCallback, useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {fetchItemsFromAPI, pushInvoiceToAPI} from "../services/client/invoice.service"
import {Toast} from "react-bootstrap";
import styles from './invoiceItemsGrid.module.css'

const InvoiceItemsGrid = () => {
    const gridRef = useRef();

    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);

    const [responseData, setResponseData] = useState([]);
    const [itemDescriptions, setItemDescriptions] = useState([]);
    const [globalTotal, setGlobalTotal] = useState(0);

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 3000); // Assuming you want to reset success after 3 seconds (adjust as needed)
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        fetchItemsFromAPI().then(data => {
            const otherData = data;
            setResponseData(otherData);
            data = otherData;

            const names = data.map(item => item.name);
            setItemDescriptions(names);

            setColumnDefs([
                {
                    field: 'description',
                    cellEditor: 'agSelectCellEditor',
                    cellEditorPopup: true,
                    cellEditorParams: {
                        values: names,
                    },
                    editable: true,
                    flex: 5
                },
                {field: 'quantity', cellEditor: 'agNumberCellEditor', editable: true, resizable: false, flex: 1},
                {field: 'price', cellEditor: 'agNumberCellEditor', resizable: false, flex: 1},
                {field: 'total', valueGetter: "data.quantity * data.price", resizable: false, flex: 1},
            ]);
        });
    }, []);

    const add_row = useCallback((addIndex = 1) => {

        const res = gridRef.current.api.applyTransaction({
            add: [''],
            addIndex: addIndex,
        });
    }, []);

    const delete_selected_rows = useCallback(() => {

        const selectedData = gridRef.current.api.getSelectedRows();
        const res = gridRef.current.api.applyTransaction({remove: selectedData});
    }, [gridRef]);

    const onCellValueChanged = useCallback(
        (d) => async (params) => {
            const {colDef, newValue, data} = params;

            // Calculate subtotal when rowData changes
            let total = 0;
            gridRef.current.api.forEachNode(node => {
                total += (node.data.quantity * node.data.price);
            });
            setGlobalTotal(total);
            console.log(total)

            if (colDef.field === 'description') {
                params.node.setDataValue("price", d.find(i => i.name === newValue)?.price || 0);
            } else if (colDef.field === "quantity") {

            }
        },
        [rowData]
    );

    const push_invoice = useCallback(() => {
        const invoiceData = {
            invoiceNumber: "INV001",
            date: new Date(),
            dueDate: new Date(),
            customer: {
                id: "POSCUST",
                name: "POSCUST",
                address: "",
                email: "",
                phone: ""
            },
            items: [],
            subtotal: 0,
            discount: {},
            total: 0,
            currency: "LKR",
            paymentMethod: "cash",
            paymentInstructions: "Paid at point of sale.",
            status: "paid"
        };

        let subtotal = 0;
        gridRef.current.api.forEachNode(node => {
            const invoiceItem = node.data;
            subtotal += (invoiceItem.price * invoiceItem.quantity);
            invoiceData.items.push({
                _id: responseData.find(i => i.name === invoiceItem.description)?._id,
                name: invoiceItem.description,
                price: invoiceItem.price,
                quantity: invoiceItem.quantity,
                total: (invoiceItem.quantity * invoiceItem.price)
            });
        });
        invoiceData.subtotal = subtotal;
        invoiceData.total = subtotal;

        pushInvoiceToAPI(invoiceData).then(r => {
            setSuccess(true)
        })

    }, [responseData, gridRef]);

    return (
        <div style={{height: "100%", width: "60%", display: "flex", flexDirection: "column"}}>
            <div style={{marginBottom: "4px"}}>
                <button onClick={add_row}>Add Item</button>
                <button onClick={delete_selected_rows}>Remove Selected</button>
                <button onClick={() => push_invoice(responseData)}>Push Invoice</button>
            </div>
            <div style={{flexGrow: "1"}}>
                <div
                    style={{height: 500}}
                    className={
                        "ag-theme-quartz"
                    }
                >
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        rowSelection={"multiple"}
                        onCellValueChanged={onCellValueChanged(responseData)}
                    />
                    <div className={styles.totalsRow}>
                        <span>Invoice Total</span>
                        <span>{currencyFormatter(globalTotal,'Rs.')}</span>
                    </div>


                    {success && (
                        <Toast>
                            <Toast.Header>
                                <strong className="mr-auto">Success!</strong>
                            </Toast.Header>
                            <Toast.Body>Invoiced Posted.</Toast.Body>
                        </Toast>
                    )}
                </div>
            </div>
        </div>
    );

    function currencyFormatter(currency, sign) {
        if (currency == undefined) {
            currency = 0
        }

        const sansDec = currency.toFixed(2);
        const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return sign + `${formatted}`;
    }
}

export default InvoiceItemsGrid;