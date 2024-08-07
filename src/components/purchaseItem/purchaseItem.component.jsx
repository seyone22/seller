import React from "react";
import currencyFormatter from "@/utils/formatters";
import styles from "./purchaseItem.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const PurchaseItem = ({ item, onContextMenu }) => {
    return (
        <div key={item._id} className={styles.invoiceItem} onContextMenu={() => onContextMenu(item._id)}>
            <div className={styles.invoiceItemDescription}>
                <div className={styles.invoiceItemTitle}>{item.name}</div>
                <div className={styles.invoiceItemSubtitle}>{item.itemCode}</div>
            </div>
            <div className={styles.invoiceItemQuantity}>{item.quantity}</div>
            <div className={styles.invoiceItemPrice}>{currencyFormatter(item.total, 'Rs. ')}</div>
        </div>
    );
};

export default PurchaseItem;
