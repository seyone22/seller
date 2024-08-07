import styles from './page.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import InvoiceItemsGrid from "@/components/inventoryItemGrid/invoiceItemsGrid.component";

export default function InvoiceManager() {
    return (
        <main>
            <div>
                <InvoiceItemsGrid />
            </div>
        </main>
    )
}