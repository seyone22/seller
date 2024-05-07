'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {fetchItemsFromAPI, fetchStatisticsFromAPI} from "@/app/services/client/invoice.service";
import currencyFormatter from "@/app/utils/formatters";

export default function Cash() {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        fetchStatisticsFromAPI().then(data => {
            console.log(data);
            setStatistics(data)
        });
    }, []);

    return (
        <main>
            <div>
                <div><h2>Sales Overview</h2></div>
                <div className={styles.statRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesGross, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Gross Sales</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{statistics.salesCount}</div>
                        <div className={styles.statSubtitle}>Number of Sales</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesGross / statistics.salesCount, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Average Sale</div>
                    </div>
                </div>
                <div className={styles.statRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesNet, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Net Sales</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.returns, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Returns</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesDiscount, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Total Discounts</div>
                    </div>
                </div>
            </div>
        </main>
    )
}