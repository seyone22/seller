'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./page.module.css";
import InventoryList from "@/components/inventoryList/inventoryList.component";
import {Button, ToggleButton} from "react-bootstrap";
import AddItemModal from "@/components/modals/addItemModal/addItemModal.component";
import {useState} from "react";

export default function Inventory() {
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

    return (
        <main>
            <div className={styles.actionRow}>
                <Button onClick={handleShowModal}>Add New Item</Button>
                <div>
                    <ToggleButton value="1" type="checkbox" id="showActiveOnly" checked={showActiveOnly}
                                  onChange={handleToggleChange}>
                        Show Active Only
                    </ToggleButton>
                </div>
            </div>

            <InventoryList key={refreshKey} showActiveOnly={showActiveOnly} />

            <AddItemModal show={showAddItemModal} handleClose={handleCloseModal} onItemAdded={handleItemAdded}/>
        </main>
    )
}
