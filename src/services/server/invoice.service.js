// services/invoiceService.js
import Invoice from '@/models/invoice';
import Item from '@/models/item';
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";
import {sendEmail} from "@/utils/nodemailer";

export const createInvoiceAndDeductInventory = async (invoiceData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await dbConnect();

        console.log(invoiceData);
        // Check for invoice validity
        if (invoiceData.items.length === 0) {
            throw new Error('The invoice is empty');
        }

        // Check stock and deduct inventory
        if (invoiceData.goodsStatus !== 'preorder') {
            for (const item of invoiceData.items) {
                const existingItem = await Item.findById(item._id).session(session).exec();
                if (!existingItem) {
                    throw new Error(`Item with ID ${item._id} not found`);
                }
                if ((existingItem.quantity < item.quantity)) {
                    throw new Error(`Not enough stock for item with ID ${item._id}`);
                }
                existingItem.quantity -= item.quantity;
                await existingItem.save({session});
            }
        }

        // Create invoice
        const invoice = new Invoice(invoiceData);
        await invoice.save({session});


        // Send Email Invoice
        const emailSent = await sendEmail(invoiceData)

        if (!emailSent) {
            throw new Error("Email not sent");
        }

        await session.commitTransaction();
        await session.endSession();

        return invoice;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
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
        const updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, updatedInvoiceData, {new: true});
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

export const getSalesStatistics = async (range) => {
    try {
        await dbConnect;
        let filteredInvoices = [];

        // Fetch all invoices
        const invoices = await getAllInvoices(); // Assuming getAllInvoices is an async function

        // Get today's and yesterday's date in UTC
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]; // Subtract 1 day in milliseconds

        // Filter based on the range
        if (range === "today") {
            filteredInvoices = invoices.filter(item => {
                const itemDate = new Date(item.date).toISOString().split('T')[0];
                return itemDate === today;
            });
        } else if (range === "yesterday") {
            filteredInvoices = invoices.filter(item => {
                const itemDate = new Date(item.date).toISOString().split('T')[0];
                return itemDate === yesterday;
            });
        } else {
            // If range is 'all' or any other value, use all invoices
            filteredInvoices = invoices;
        }

        // Calculate sales statistics
        const salesStats = filteredInvoices.reduce((acc, invoice) => {
            acc.salesDiscount += invoice.discount.value || 0;
            acc.salesGross += invoice.total || 0;
            acc.salesNet += invoice.subtotal || 0;
            acc.salesCount += 1;
            return acc;
        }, { salesDiscount: 0, salesGross: 0, salesNet: 0, salesCount: 0 });

        return salesStats;
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};


export const findLatestInvoice = async () => {
    try {
        await dbConnect();

        const latestInvoice = await Invoice.findOne({})
            .sort({createdAt: -1})
            .exec()

        if (!latestInvoice) {
            throw new Error(`No invoices in system!`);
        }

        return parseInt(latestInvoice.invoiceNumber.replace(/\D/g, ''), 10);
    } catch (error) {
        return -1;
    }
}