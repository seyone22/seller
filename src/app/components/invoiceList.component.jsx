import styles from './invoiceList.module.css';
import { useState } from 'react';

const InvoiceList = ({ items }) => {
    const [invoiceItems, setInvoiceItems] = useState(items);

    return (
        <div>
            {invoiceItems.map(item => (
                <div key={item._id} className={styles.invoiceItem}>
                    {/* Render your item details here */}
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    {/* Add more item details as needed */}
                </div>
            ))}
        </div>
    );
};

export default InvoiceList;
