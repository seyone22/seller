import Item from '../models/item';
import dbConnect from "@/app/utils/dbConnect";

export const getItemById = async (itemId) => {
    try {
        await dbConnect();

        const item = await Item.findById(itemId).exec();
        if (!item) {
            throw new Error(`Item with ID ${itemId} not found`);
        }
        return item;
    } catch (error) {
        throw new Error('Failed to get item by ID');
    }
};

export const getAllItems = async () => {
    try {
        await dbConnect();

        return await Item.find({}).exec();
    } catch (error) {
        throw new Error('Failed to get all items');
    }
};

export const deleteItem = async (itemId) => {
    try {
        await dbConnect();

        const deletedItem = await Item.findByIdAndDelete(itemId).exec();
        if (!deletedItem) {
            throw new Error(`Item with ID ${itemId} not found`);
        }
        return deletedItem;
    } catch (error) {
        throw new Error('Failed to delete item');
    }
};

export const updateItem = async (itemId, newItemData) => {
    try {
        await dbConnect();

        const updatedItem = await Item.findByIdAndUpdate(itemId, newItemData, { new: true }).exec();
        if (!updatedItem) {
            throw new Error(`Item with ID ${itemId} not found`);
        }
        return updatedItem;
    } catch (error) {
        throw new Error('Failed to update item');
    }
};

export const insertItem = async (itemData) => {
    try {
        await dbConnect();

        const newItem = new Item(itemData);
        return await newItem.save();
    } catch (error) {
        throw new Error('Failed to insert item');
    }
};
