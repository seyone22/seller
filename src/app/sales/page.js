'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {fetchStatisticsFromAPI} from "@/services/client/invoice.service";
import InvoiceList from "@/components/invoiceList/invoiceList.component";
import {ToggleButton} from "react-bootstrap";

export default function Sales() {
    const [statistics, setStatistics] = useState({});

    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [showToday, setShowToday] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleShowModal = () => setShowAddItemModal(true);
    const handleCloseModal = () => setShowAddItemModal(false);

    const handleItemAdded = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    const handleToggleChange = (e) => {
        setShowToday(e.currentTarget.checked);
    }

    useEffect(() => {
        fetchStatisticsFromAPI().then(data => {
            console.log(data);
            setStatistics(data)
        });
    }, []);

    return (
        <main>
            <div><h2>Sales Data</h2></div>

            <div className={styles.actionRow}>
                <div>
                    <ToggleButton value="1" type="checkbox" id="showToday" checked={showToday}
                                  onChange={handleToggleChange}>
                        Show Today&apos;s Activity
                    </ToggleButton>
                </div>
            </div>

            <InvoiceList key={refreshKey} showToday={showToday}/>

        </main>
    )
}