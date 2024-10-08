// models/invoice.js
import {model, models, Schema} from "mongoose";

const invoiceSchema = new Schema({
    invoiceNumber: { type: String, required: true },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    customer: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String },
        email: { type: String },
        phone: { type: String }
    },
    items: [{
        _id: { type: Schema.Types.ObjectId, auto: true, },
        name: { type: String, required: true },
        itemCode: { type: String, required: false },
        description: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        total: { type: Number, required: true}
    }],
    subtotal: { type: Number, required: true },
    discount: {
        type: { type: String, enum: ['percent', 'amount'] },
        value: { type: Number }
    },
    tax: { type: Number },
    total: { type: Number, required: true },
    tendered: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'online', 'bank transfer'], required: true },
    paymentInstructions: { type: String },
    status: { type: String, enum: ['sent', 'paid', 'pending'], required: true },
    goodsStatus: { type: String, enum: ['delivered', 'preorder', 'pending'], required: true }
});

const Invoice = models.Invoice || model('Invoice', invoiceSchema);
Invoice.schema.set('collection', 'invoices');

export default Invoice;
