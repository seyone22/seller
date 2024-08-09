'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {fetchStatisticsFromAPI} from "@/services/client/invoice.service";
import InvoiceList from "@/components/invoiceList/invoiceList.component";

export default function Sales() {
    const [statistics, setStatistics] = useState({});

    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleShowModal = () => setShowAddItemModal(true);
    const handleCloseModal = () => setShowAddItemModal(false);

    const handleItemAdded = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    const handleToggleChange = (e) => {
        setShowActiveOnly(e.currentTarget.checked);
        console.log(e.currentTarget.checked);
    }

    useEffect(() => {
        fetchStatisticsFromAPI().then(data => {
            console.log(data);
            setStatistics(data)
        });
    }, []);

    return (
        <main className={styles.main}>
            <div><h2>Sales Data</h2></div>

            <InvoiceList key={refreshKey} showActiveOnly={showActiveOnly}/>

        </main>
    )
}