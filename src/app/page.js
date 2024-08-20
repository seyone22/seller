import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.container}>
                <a href={`/pos`}>
                    <Button className={styles.mainButton} variant={"primary"}>Go to POS</Button>
                </a>
                <a href={`/inventory`}>
                    <Button className={styles.mainButton} variant={"secondary"}>View Inventory</Button>
                </a>
                <a href={`/sales`}>
                    <Button className={styles.mainButton} variant={"secondary"}>Sales</Button>
                </a>
                <a href={`/cash`}>
                    <Button className={styles.mainButton} variant={"secondary"}>Cash Manager</Button>
                </a>
        </main>
    );
}