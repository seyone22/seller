'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./page.module.css";
import {useCallback, useEffect, useState} from "react";
import ItemGrid from "@/components/itemGrid/itemGrid.component";
import currencyFormatter from "@/utils/formatters";
import {Button, FloatingLabel, Form, InputGroup, Toast} from "react-bootstrap";
import {pushInvoiceToAPI, sendReceiptEmail} from "@/services/client/invoice.service";
import PurchaseItem from "@/components/purchaseItem/purchaseItem.component";

export default function Pos() {
    const [purchase, setPurchase] = useState([]);
    const [purchaseTotal, setPurchaseTotal] = useState(0)
    const [goodsStatus, setGoodsStatus] = useState('delivered')
    const [discount, setDiscount] = useState({type: 'amount', value: 0})
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [cashTendered, setCashTendered] = useState(0)
    const [activeButton, setActiveButton] = useState('amount');
    const [numericValue, setNumericValue] = useState(0)

    const [isValid, setIsValid] = useState(false)

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [customerInfo, setCustomerInfo] = useState({
        id: 'POSCUST',
        name: 'POSCUST',
        address: '',
        email: 'invoices@anime.lk',
        phone: ''
    })

    const [apiMessage, setApiMessage] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleCheckboxChange = (event) => {
        if (goodsStatus === 'delivered') {
            setGoodsStatus('preorder')
        } else if (goodsStatus === 'preorder') {
            setGoodsStatus('delivered')
        }
    };


    useEffect(() => {
        const fetchLatestInvoiceID = async () => {
            try {
                const response = await fetch('/api/invoice/running_invoice_id'); // Adjust the path if necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                if (result.success) {
                    setNumericValue(result.data); // Default to 1 if no data
                } else {

                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestInvoiceID();
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000); // Assuming you want to reset success after 3 seconds (adjust as needed)
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleItemClick = (clickedItem) => {
        // Check if the item already exists in the purchase list
        const existingItemIndex = purchase.findIndex(item => item._id === clickedItem._id);

        if (existingItemIndex !== -1) {
            // If the item exists, update its quantity
            const updatedPurchase = purchase.map((item, index) => {
                if (index === existingItemIndex) {
                    const newQuantity = item.quantity + 1
                    const newPrice = item.price * newQuantity
                    setPurchaseTotal(purchaseTotal + item.price)
                    return {...item, quantity: newQuantity, total: newPrice};
                }
                return item;
            });
            setPurchase(updatedPurchase);
        } else {
            // If the item doesn't exist, add it as a new element
            const newItem = {
                _id: clickedItem._id,
                itemCode: clickedItem.itemCode,
                name: clickedItem.name,
                quantity: 1,
                total: clickedItem.price,
                price: clickedItem.price
            };
            setPurchaseTotal(purchaseTotal + newItem.price)
            setPurchase(prevPurchase => [...prevPurchase, newItem]);
        }
    };

    const handleItemContext = (itemId) => {
        // Find the index of the item in the purchase list
        const existingItemIndex = purchase.findIndex(item => item._id === itemId);

        if (existingItemIndex !== -1) {
            // Get the item from the purchase list
            const currentItem = purchase[existingItemIndex];

            // If the item's quantity is greater than 0, decrement the quantity
            if (currentItem.quantity > 1) {
                const updatedPurchase = purchase.map((item, index) => {
                    if (index === existingItemIndex) {
                        const newQuantity = item.quantity - 1;
                        setPurchaseTotal(purchaseTotal - item.price)
                        const newPrice = item.price * newQuantity
                        return {...item, quantity: newQuantity, total: newPrice};
                    }
                    return item;
                });
                setPurchase(updatedPurchase);
            } else {
                // If the quantity is already 0, remove the item from the purchase list
                const updatedPurchase = purchase.filter(item => item._id !== itemId);
                setPurchaseTotal(purchaseTotal - currentItem.price)
                setPurchase(updatedPurchase);
            }
        }
    };

    const reset = () => {
        setPurchaseTotal(0)
        setPurchase([])
        setGoodsStatus('delivered')
        setDiscount({value: 0, type: 'amount'})
        setCashTendered(0)
    }

    const push_invoice = useCallback(() => {
        const fourDigitValue = (numericValue + 1).toString().padStart(4, '0'); // Converts to a four-digit string
        const resultString = `INV${fourDigitValue}`; // Append to your desired string

        const invoiceData = {
            invoiceNumber: resultString,
            date: new Date(),
            dueDate: new Date(),
            customer: customerInfo,
            items: purchase,
            subtotal: purchaseTotal,
            discount: discount,
            total: purchaseTotal - discount.value,
            tendered: cashTendered,
            currency: "LKR",
            paymentMethod: paymentMethod,
            paymentInstructions: "Paid at point of sale.",
            status: "paid",
            goodsStatus: goodsStatus
        };

        pushInvoiceToAPI(invoiceData).then(async e => {
            setShowToast(true)
            setApiMessage("Invoice Posted.")
            const success = await sendReceiptEmail(invoiceData.customer.email);
            if (!success) {
                throw Error("Could not send email receipt.")
            }
            setNumericValue(numericValue + 1)
            reset()
        }).catch(error => {
            console.log(invoiceData)
            setShowToast(true)
            setApiMessage(error)
        })

    }, [purchase, purchaseTotal, goodsStatus]);

    const handleDiscountChange = (event) => {
        setDiscount({...discount, value: event.target.value})
    }

    const handleDiscountTypeButtonClick = (type) => {
        setActiveButton(type);
        setDiscount({...discount, type});
    };

    const handleCashTendered = (event) => {
        setCashTendered(event.target.value)
    }

    const handleSelect = (method) => {
        setPaymentMethod(method); // Update the paymentMethod variable
    };

    const handleCustomerData = (event) => {
        const {name, value} = event.target;
        setCustomerInfo({...customerInfo, [name]: value});

        console.log(customerInfo)
    };

    return (
        <main>
            {showToast && (
                <Toast className={styles.toast}>
                    <Toast.Header>
                        <strong className="mr-auto">Note:</strong>
                    </Toast.Header>
                    <Toast.Body>{apiMessage.toString()}</Toast.Body>
                </Toast>
            )}
            <div className={styles.flexRow}>
                <div className={styles.itemGrid}>
                    <ItemGrid onItemClick={handleItemClick} onItemContext={handleItemContext} purchase={purchase}/>
                </div>
                <div className={styles.sidebar}>
                    <div className={styles.customerInput}>
                        <Form>
                            <Form.Group className={styles.flexRow} controlId="exampleForm.ControlInput1">
                                <FloatingLabel controlId="customerName" label="Customer Name">
                                    <Form.Control value={customerInfo.name} onChange={handleCustomerData} type="text"
                                                  name='name' placeholder="Customer Name"/>
                                </FloatingLabel>
                                <FloatingLabel controlId="customerPhone" label="Telephone">
                                    <Form.Control value={customerInfo.phone} onChange={handleCustomerData} type="text"
                                                  name='phone' placeholder="Telephone"/>
                                </FloatingLabel>
                                <FloatingLabel controlId="customerEmail" label="Email">
                                    <Form.Control value={customerInfo.email} onChange={handleCustomerData} type="text"
                                                  name='email' placeholder="Email"/>
                                </FloatingLabel>
                            </Form.Group>
                        </Form>
                    </div>
                    <div className={styles.invoiceItemsList}>
                        {purchase.map(item => (
                            <PurchaseItem
                                key={item._id}
                                item={item}
                                onContextMenu={handleItemContext}
                                onIncrement={handleItemClick}
                                onDecrement={handleItemContext}
                            />
                        ))}
                    </div>
                    <div className={styles.discountArea}>

                        <InputGroup className={styles.inputArea}>
                            <Button variant={activeButton === 'percent' ? "primary" : "outline-secondary"}
                                    onClick={() => handleDiscountTypeButtonClick('percent')}>%</Button>
                            <Button variant={activeButton === 'amount' ? "primary" : "outline-secondary"}
                                    onClick={() => handleDiscountTypeButtonClick('amount')}>#</Button>
                            <Form.Control
                                aria-label="Example text with two button addons"
                                value={discount.value}
                                onChange={handleDiscountChange}
                                type={'number'}
                            />
                        </InputGroup>
                        <span>Discount: </span>
                    </div>
                    <div className={styles.invoiceItemsTotalArea}>
                        <div className={styles.payableText}>Total:</div>
                        <div
                            className={styles.payableValue}>{currencyFormatter(purchaseTotal - discount.value, 'Rs. ')}</div>
                    </div>
                    <div className={styles.discountArea}>
                        <InputGroup className={styles.inputArea}>
                            <Form.Control
                                aria-label="Example text with two button addons"
                                value={cashTendered}
                                onChange={handleCashTendered}
                                type={'number'}
                            />
                        </InputGroup>
                        <span>Tendered: </span>
                    </div>
                    <div className={styles.invoiceItemsTotalArea}>
                        <div className={styles.payableText}>Balance:</div>
                        <div
                            className={styles.payableValue}>{currencyFormatter(((cashTendered - (purchaseTotal - discount.value)) >= 0 ? (cashTendered - (purchaseTotal - discount.value)) : 0), 'Rs. ')}</div>
                    </div>


                    <div className={styles.preorderArea}>
                        <Form.Check
                            type="checkbox"
                            id="status-checkbox"
                            label="Mark as Preorder"
                            checked={goodsStatus === 'preorder'} // Checked if goodsStatus is 'preorder'
                            onChange={handleCheckboxChange}
                        />
                    </div>
                    <div className={styles.actionArea}>
                        <Button
                            variant={"outline-primary"}
                            onClick={() => push_invoice()}
                            disabled={(!((cashTendered - (purchaseTotal - discount.value)) >= 0)) || purchase.length === 0}>
                            Submit
                        </Button>
                        <Button variant={"outline-danger"} onClick={() => reset()}>Reset</Button>
                        <Form.Select onChange={(e) => handleSelect(e.target.value)} size="sm"
                                     aria-label="Default select example" style={{width: 150}}>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="bank transfer">Bank Transfer</option>
                        </Form.Select>
                    </div>
                </div>
            </div>
        </main>
    );
}