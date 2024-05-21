import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";
import styles from "./page.module.css";
import InventoryList from "@/components/inventoryList.component";

export default function Inventory() {
    return (
        <main>
            <div>
                <InventoryList />
            </div>
        </main>
    )
}