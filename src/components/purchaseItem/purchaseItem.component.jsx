import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import currencyFormatter from "@/utils/formatters";
import styles from "./purchaseItem.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";

const PurchaseItem = ({ item, onContextMenu, onIncrement, onDecrement }) => {
    return (
        <div key={item._id} className={styles.invoiceItem} onContextMenu={() => onContextMenu(item._id)}>
            <div className={styles.invoiceItemDescription}>
                <div className={styles.invoiceItemTitle}>{item.itemCode}</div>
                <div className={styles.invoiceItemSubtitle}>{item.name}</div>
            </div>

            <div>
                <Button className={styles.incrementer} variant="outline-secondary" onClick={() => onIncrement(item)}>
                    <FontAwesomeIcon className={styles.none} icon={faPlus} />
                </Button>
            </div>
            <div className={styles.invoiceItemQuantity}>{item.quantity}</div>
            <div>
                <Button className={styles.incrementer} variant="outline-secondary" onClick={() => onDecrement(item._id)}>
                    <FontAwesomeIcon className={styles.none} icon={faMinus} />
                </Button>
            </div>

            <div className={styles.invoiceItemPrice}>{currencyFormatter(item.total, 'Rs. ')}</div>
        </div>
    );
};

export default PurchaseItem;
