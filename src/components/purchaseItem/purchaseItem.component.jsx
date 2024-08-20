import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import currencyFormatter from "@/utils/formatters";
import styles from "./purchaseItem.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";

const PurchaseItem = ({item, onContextMenu, onIncrement, onDecrement, purchase}) => {

    const handleItemClick = (i, event) => {
        event.preventDefault();

        if (item.quantity < item.availableQuantity) {
            onIncrement(i);
        }
    };

    const handleItemContext = (itemId, event) => {
        event.preventDefault();
        onDecrement(itemId);
    }

    return (
        <div key={item._id} className={styles.invoiceItem} onContextMenu={(event) => {
            event.preventDefault();
            onContextMenu(item._id);
        }}>
            <div className={styles.invoiceItemDescription}>
                <div className={styles.invoiceItemTitle}>{item.itemCode}</div>
                <div className={styles.invoiceItemSubtitle}>{item.name}</div>
            </div>

            <div>
                <Button className={styles.incrementer} variant="outline-secondary"
                        onClick={(event) => handleItemContext(item._id, event)} type="button">
                    <FontAwesomeIcon className={styles.none} icon={faMinus}/>
                </Button>
            </div>
            <div className={styles.invoiceItemQuantity}>{item.quantity}</div>
            <div>
                <Button className={styles.incrementer} variant="outline-secondary"
                        onClick={(event) => handleItemClick(item, event)} type="button">
                    <FontAwesomeIcon className={styles.none} icon={faPlus}/>
                </Button>
            </div>

            <div className={styles.invoiceItemPrice}>{currencyFormatter(item.total, 'Rs. ')}</div>
        </div>
    );
};

export default PurchaseItem;