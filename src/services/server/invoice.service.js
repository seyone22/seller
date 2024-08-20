// services/invoiceService.js
import { startOfDay, endOfDay, subDays } from 'date-fns';
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
                await existingItem.save({ session });
            }
        }

        // Create invoice
        const invoice = new Invoice(invoiceData);
        await invoice.save({ session });



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

        let dateFilter = {};

        console.log(range)

        // Set the date range filter based on the input range
        if (range === 'today') {
            dateFilter = {
                $gte: startOfDay(new Date()),
                $lte: endOfDay(new Date())
            };
        } else if (range === 'yesterday') {
            dateFilter = {
                $gte: startOfDay(subDays(new Date(), 1)),
                $lte: endOfDay(subDays(new Date(), 1))
            };
        }

        // Calculate sales statistics
        const salesStats = await Invoice.aggregate([
            {
                $match: {
                    'goodsStatus': 'delivered',
                    'status': 'paid',
                    ...(range !== 'all' && { createdAt: dateFilter }) // Apply date filter only if not 'all'
                }
            },
            {
                $group: {
                    _id: null, // Use null to group all documents together
                    salesDiscount: { $sum: '$discount.value' },
                    salesGross: { $sum: '$total' },
                    salesNet: { $sum: '$subtotal' },
                    salesCount: { $count: {} }
                }
            }
        ]);

        // Handle case when no sales data is found
        if (!salesStats.length) {
            return { salesGross: 0, salesNet: 0, salesCount: 0, salesDiscount: 0 };
        }

        const { salesGross, salesNet, salesCount, salesDiscount } = salesStats[0];
        return { salesGross, salesNet, salesCount, salesDiscount };
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};

export const findLatestInvoice = async () => {
    try {
        await dbConnect();

        const latestInvoice = await Invoice.findOne({})
            .sort({ createdAt: -1 })
            .exec()

        if (!latestInvoice) {
            throw new Error(`No invoices in system!`);
        }

        return parseInt(latestInvoice.invoiceNumber.replace(/\D/g, ''), 10);
    } catch (error) {
        return -1;
    }
}