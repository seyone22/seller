// models/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    customer: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    discount: {
        type: { type: String, enum: ['percent', 'amount'], required: true },
        value: { type: Number, required: true }
    },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentInstructions: { type: String, required: true },
    status: { type: String, enum: ['sent', 'paid', 'pending'], required: true }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
