'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {fetchItemsFromAPI, fetchStatisticsFromAPI} from "@/services/client/invoice.service";
import currencyFormatter from "@/utils/formatters";
import Card from "@/components/card/card.component";

export default function Cash() {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        fetchStatisticsFromAPI().then(data => {
            console.log(data);
            setStatistics(data)
        });
    }, []);

    return (
        <main className={styles.main}>
            <div>
                <div><h2>Cash Manager</h2></div>
                <div className={styles.statRow}>
                    <Card>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesGross, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Gross Sales</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>{statistics.salesCount}</div>
                        <div className={styles.statSubtitle}>Number of Sales</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesGross / statistics.salesCount, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Average Sale</div>
                    </Card>
                </div>
                <div className={styles.statRow}>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesNet, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Net Sales</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.returns, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Returns</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesDiscount, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Total Discounts</div>
                    </Card>
                </div>
            </div>
        </main>
    )
}