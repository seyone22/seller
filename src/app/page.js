'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";
import styles from "./page.module.css";
import ItemGrid from "./components/itemGrid.component.jsx";
import {useState} from "react";

export default function Home() {
    const [purchase, setPurchase] = useState([]);

    const handleItemClick = (itemId) => {
        // Check if the item already exists in the purchase list
        const existingItemIndex = purchase.findIndex(item => item._id === itemId);

        if (existingItemIndex !== -1) {
            // If the item exists, update its quantity
            const updatedPurchase = purchase.map((item, index) => {
                if (index === existingItemIndex) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            setPurchase(updatedPurchase);
        } else {
            // If the item doesn't exist, add it as a new element
            const newItem = {
                _id: itemId,
                quantity: 1
            };
            setPurchase(prevPurchase => [...prevPurchase, newItem]);
        }
    };

    const handleItemContext = (itemId) => {
        // Find the index of the item in the purchase list
        const existingItemIndex = purchase.findIndex(item => item._id === itemId);

        if (existingItemIndex !== -1) {
            // Get the item from the purchase list
            const currentItem = purchase[existingItemIndex];

            // If the item's quantity is greater than 0, decrement the quantity
            if (currentItem.quantity > 1) {
                const updatedPurchase = purchase.map((item, index) => {
                    if (index === existingItemIndex) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                });
                setPurchase(updatedPurchase);
            } else {
                // If the quantity is already 0, remove the item from the purchase list
                const updatedPurchase = purchase.filter(item => item._id !== itemId);
                setPurchase(updatedPurchase);
            }
        }
    };

    return (
        <main>
            <div className={styles.container}>
                <a href={`/pos`}>
                    <Button className={styles.mainButton} variant={"primary"}>Go to POS</Button>
                </a>
                <a href={`/inventory`}>
                    <Button className={styles.mainButton} variant={"secondary"}>View Inventory</Button>
                </a>
                <a href={`/invoice`}>
                    <Button className={styles.mainButton} variant={"secondary"}>Invoice Manager</Button>
                </a>
                <a href={`/cash`}>
                    <Button className={styles.mainButton} variant={"secondary"}>Cash Manager</Button>
                </a>
            </div>
        </main>
    );
}