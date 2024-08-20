'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./page.module.css";
import InventoryList from "@/components/inventoryList/inventoryList.component";
import {Alert, Button, Form, ToggleButton} from "react-bootstrap";
import AddItemModal from "@/components/modals/addItemModal/addItemModal.component";
import {useState} from "react";

export default function Inventory() {
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [refreshKey, setRefreshKey] = useState('');

    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState(false);

    const [key, setKey] = useState(0);

    // Handle Actions
    const handleShowModal = () => setShowAddItemModal(true);
    const handleCloseModal = () => setShowAddItemModal(false);
    const handleItemAdded = () => setRefreshKey(prevKey => prevKey + 1);
    const handleToggleChange = (e) => setShowActiveOnly(e.currentTarget.checked);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authentication': key}
        });

        if (res.ok) {
            setAuthenticated(true)
        } else {
            setAuthenticated(false)
            setError(true)
        }
    };

    return (
        <main>
            {!authenticated && (
                <div>
                    <div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Control
                                className={styles.input}
                                placeholder="Key"
                                type="text"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                required
                            />
                            <Button type="submit" className={styles.button}>Enter</Button>
                            {error && (
                                <Alert variant={error}>
                                    Invalid Credentials.
                                </Alert>
                            )}
                        </Form>
                    </div>
                </div>
            )}


            {authenticated && (
                <>
                    <div className={styles.actionRow}>
                        <Button onClick={handleShowModal}>Add New Item</Button>
                        <div>
                            <ToggleButton
                                value="1"
                                type="checkbox"
                                id="showActiveOnly"
                                checked={showActiveOnly}
                                onChange={handleToggleChange}
                            >
                                Show Active Only
                            </ToggleButton>
                        </div>
                    </div>

                    <InventoryList key={refreshKey} showActiveOnly={showActiveOnly}/>

                    <AddItemModal show={showAddItemModal} handleClose={handleCloseModal} onItemAdded={handleItemAdded}/>
                </>
            )}
        </main>
    );
}
