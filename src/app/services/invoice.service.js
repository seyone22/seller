// services/invoiceService.js
import Invoice from '../models/invoice';
import Item from '../models/item';
import dbConnect from "@/app/utils/dbConnect";

export const createInvoiceAndDeductInventory = async (invoiceData) => {
    try {
        await dbConnect();

        console.log(invoiceData);
        // Check stock and deduct inventory
        for (const item of invoiceData.items) {
            const existingItem = await Item.findById(item._id).exec();
            if (!existingItem) {
                throw new Error(`Item with ID ${item._id} not found`);
            }
            if (existingItem.quantity < item.quantity) {
                throw new Error(`Not enough stock for item with ID ${item._id}`);
            }
            existingItem.quantity -= item.quantity;
            await existingItem.save();
        }

        // Create invoice
        const invoice = new Invoice(invoiceData);
        await invoice.save();

        return invoice;
    } catch (error) {
        throw new Error(`Failed to create invoice and deduct inventory: ${error.message}`);
    }
};

export const getInvoice = async (invoiceId) => {
    try {
        await dbConnect();

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            throw new Error(`Invoice with ID ${invoiceId} not found`);
        }
        return invoice;
    } catch (error) {
        throw new Error('Failed to get invoice');
    }
};

export const getAllInvoices = async () => {
    try {
        await dbConnect();

        return await Invoice.find({});
    } catch (error) {
        throw new Error('Failed to get all invoices');
    }
};

export const cancelInvoice = async (invoiceId) => {
    try {
        await dbConnect();

        // Find the invoice by ID and delete it
        const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId).exec();
        if (!deletedInvoice) {
            throw new Error(`Invoice with ID ${invoiceId} not found`);
        }

        // Roll back inventory changes
        for (const item of deletedInvoice.items) {
            const existingItem = await Item.findById(item._id).exec();
            if (!existingItem) {
                throw new Error(`Item with ID ${item._id} not found`);
            }
            existingItem.quantity += item.quantity; // Increment quantity
            await existingItem.save();
        }

        return deletedInvoice;
    } catch (error) {
        throw new Error('Failed to cancel invoice');
    }
};

export const updateInvoiceAndInventory = async (invoiceId, updatedInvoiceData) => {
    try {
        await dbConnect();

        // Find the existing invoice and update it
        const updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, updatedInvoiceData, { new: true });
        if (!updatedInvoice) {
            throw new Error(`Invoice with ID ${invoiceId} not found`);
        }

        // Roll back inventory changes for the original items
        for (const item of updatedInvoice.items) {
            const existingItem = await Item.findById(item._id).exec();
            if (!existingItem) {
                throw new Error(`Item with ID ${item._id} not found`);
            }
            existingItem.quantity += item.quantity; // Increment quantity, TODO: FIX THIS CODE
            await existingItem.save();
        }

        // Deduct inventory for the updated items
        for (const item of updatedInvoiceData.items) {
            const existingItem = await Item.findById(item._id).exec();
            if (!existingItem) {
                throw new Error(`Item with ID ${item._id} not found`);
            }
            if (existingItem.quantity < item.quantity) {
                throw new Error(`Not enough stock for item with ID ${item._id}`);
            }
            existingItem.quantity -= item.quantity;
            await existingItem.save();
        }

        return updatedInvoice;
    } catch (error) {
        throw new Error('Failed to update invoice and inventory');
    }
};