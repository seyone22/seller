'use client'
import styles from './itemGrid.module.css'
import {useEffect, useState} from "react";
import {fetchItemsFromAPI} from "@/app/services/client/invoice.service";

const ItemGrid = ({onItemClick, onItemContext}) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItemsFromAPI().then(data => {
            setItems(data)
        });
    }, []);

    const handleItemClick = (item) => {
        onItemClick(item);
    }
    const handleItemContext = (itemId, event) => {
        event.preventDefault();
        onItemContext(itemId);
    }

    return (
        <div className={styles.gridContainer}>
            {items.map(item => (
                <div key={item._id} className={styles.gridItem} onClick={() => handleItemClick(item)}
                     onContextMenu={(event) => handleItemContext(item._id, event)}>
                    <div>{item.name}</div>
                </div>
            ))}
        </div>
    );
};

export default ItemGrid;