import styles from "./page.module.css";
import { getInvoice } from "@/services/server/invoice.service";

export default async function InvoiceDetail({ params }) {
    let invoice = await getInvoice(params.invoiceId);

    return (
        <main className={styles.container}>
            <h1 className={styles.h1}>Your Awesome Anime Merch Receipt</h1>
            <p>Hi {invoice.customer.name},</p>
            <p>
                Thank you for shopping with us at The Anime.lk Shop! We&apos;re thrilled you found some amazing anime
                merch to add to your collection. Below are the details of your purchase:
            </p>

            <h3>Receipt Details:</h3>
            <ul>
                <li><strong>Receipt Number:</strong> {invoice.invoiceNumber}</li>
                <li><strong>Date of Purchase:</strong> {new Date(invoice.date).toLocaleString()}</li>
                <li><strong>Phone Number:</strong> {invoice.customer.telephone}</li>
            </ul>

            <h3>Your Loot:</h3>
            <div className="table-responsive">
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th className={styles.th}>Item Code</th>
                        <th className={styles.th}>Quantity</th>
                        <th className={styles.th}>Unit Price</th>
                        <th className={styles.th}>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoice.items.map(item => (
                        <tr key={item.itemCode}>
                            <td className={styles.td}>{item.itemCode}</td>
                            <td className={styles.td}>{item.quantity}</td>
                            <td className={styles.td}>{item.price}</td>
                            <td className={styles.td}>{item.total}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="3"><strong>Subtotal</strong></td>
                        <td>{invoice.subtotal}</td>
                    </tr>
                    <tr>
                        <td colSpan="3"><strong>Discount</strong></td>
                        <td>-{invoice.discount.value}</td>
                    </tr>
                    <tr>
                        <td colSpan="3"><strong>Total Paid</strong></td>
                        <td>{invoice.total}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <p><strong>Payment Method: </strong>{invoice.paymentMethod}</p>

            <p><em>Please note: All sales are final.</em></p>

            <div className={styles.footer}>
                <p>
                    We hope you enjoy your new merch! If you have any questions or just want to chat about anime, feel
                    free to reach out to us at <a href='mailto:info@anime.lk'>info@anime.lk</a>
                </p>
                <p><strong>Stay awesome, and happy watching!</strong></p>
                <p>Best regards,<br /><strong>The Anime.lk Shop Team</strong></p>
            </div>

            <img alt="Anime.lk Shop Logo" className={styles.logo} src="https://iili.io/dMF0cYb.md.png" />
        </main>
    );
}
