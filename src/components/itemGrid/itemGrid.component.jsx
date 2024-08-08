'use client'
import styles from './itemGrid.module.css'
import {useEffect, useState} from "react";
import {fetchItemsFromAPI} from "@/services/client/invoice.service";

const ItemGrid = ({onItemClick, onItemContext, purchase}) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItemsFromAPI().then(data => {
            setItems(data)
        });
    }, []);

    const handleItemClick = (item, event) => {
        event.preventDefault();
        if (item.quantity - (purchase.some(p => p._id === item._id) ? purchase.find(p => p._id === item._id).quantity : 0)) {
            onItemClick(item);
        }
    }
    const handleItemContext = (itemId, event) => {
        event.preventDefault();
        onItemContext(itemId);
    }

    return (
        <div className={styles.gridContainer}>
            {items.map(item => (
                <div key={item._id}
                     className={`
  ${styles.gridItem} 
  ${(item.quantity - (purchase.some(p => p._id === item._id) ? purchase.find(p => p._id === item._id).quantity : 0)) === 0 ? styles.itemOut : ''} 
  ${purchase.some(p => p._id === item._id) ? styles.gridItemSelected : ''}
`}

                     onClick={(event) => handleItemClick(item, event)}
                     onContextMenu={(event) => handleItemContext(item._id, event)}>
                    <div>{item.name}</div>
                    <div className={styles.alignRight}>
                        <div>{item.quantity - (purchase.some(p => p._id === item._id) ? purchase.find(p => p._id === item._id).quantity : 0)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemGrid;