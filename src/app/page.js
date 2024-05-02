import Image from "next/image";
import styles from "./page.module.css";
import InvoiceItemsGrid from "@/app/components/invoiceItemsGrid.component";

export default function Home() {
  return (
    <main>
      <div>
          <InvoiceItemsGrid />
      </div>
    </main>
  );
}
