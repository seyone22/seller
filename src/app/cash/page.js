'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {fetchStatisticsFromAPI} from "@/services/client/invoice.service";
import { currencyFormatter } from "@/utils/formatters";
import Card from "@/components/card/card.component";
import {Button, ButtonGroup} from "react-bootstrap";

export default function Cash() {
    const [statistics, setStatistics] = useState({
        salesGross: 0,
        salesNet: 0,
        salesCount: 0,
        salesDiscount: 0,
        returns: 0
    });
    const [range, setRange] = useState('today');

    const handleFilterChange = (newFilter) => {
        setRange(newFilter);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchStatisticsFromAPI(range);
                setStatistics(data || {}); // Default to an empty object if data is null/undefined
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setStatistics({
                    salesGross: 0,
                    salesNet: 0,
                    salesCount: 0,
                    salesDiscount: 0,
                    returns: 0
                });
            }
        };
        fetchData().then(r => { });
    }, [range]);

    return (
        <main className={styles.main}>
            <div>
                <div><h2>Cash Manager</h2></div>

                <div className={styles.actionRow}>
                    <ButtonGroup>
                        <Button
                            variant={range === 'today' ? 'primary' : 'secondary'}
                            onClick={() => handleFilterChange('today')}
                        >
                            Today
                        </Button>
                        <Button
                            variant={range === 'yesterday' ? 'primary' : 'secondary'}
                            onClick={() => handleFilterChange('yesterday')}
                        >
                            Yesterday
                        </Button>
                        <Button
                            variant={range === 'all' ? 'primary' : 'secondary'}
                            onClick={() => handleFilterChange('all')}
                        >
                            All
                        </Button>
                    </ButtonGroup>
                </div>
                <div className={styles.statRow}>
                    <Card>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesGross || 0, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Gross Sales</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>{statistics.salesCount || 0}</div>
                        <div className={styles.statSubtitle}>Number of Sales</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>
                            {currencyFormatter(
                                statistics.salesCount > 0 ? statistics.salesGross / statistics.salesCount : 0,
                                'Rs.'
                            )}
                        </div>
                        <div className={styles.statSubtitle}>Average Sale</div>
                    </Card>
                </div>
                <div className={styles.statRow}>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesNet || 0, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Net Sales</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.returns || 0, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Returns</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statValue}>{currencyFormatter(statistics.salesDiscount || 0, 'Rs.')}</div>
                        <div className={styles.statSubtitle}>Total Discounts</div>
                    </Card>
                </div>
            </div>
        </main>
    )
}
