import styles from './page.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import InvoiceItemsGrid from "@/app/components/invoiceItemsGrid.component";

export default function InvoiceManager() {
    return (
        <main>
            <div>
                <InvoiceItemsGrid />
            </div>
        </main>
    )
}