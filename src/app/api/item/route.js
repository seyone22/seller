import {deleteItem, getAllItems, insertItem} from "@/services/server/item.service";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    if (req.method === 'GET') {
        try {
            const items = await getAllItems();
            return NextResponse.json({ success: true, data: items }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
    }
}

// POST an item
export async function POST(req, res) {
    if (req.method === 'POST') {
        try {
            const newItem = await insertItem(req.json());
            return NextResponse.json({ success: true, data: newItem }, { status: 201 });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
    } else {
        return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
    }
}

// DELETE an item by itemId
export async function DELETE(req, res) {
    if (req.method === 'DELETE') {
        try {
            const { itemId } = req.query;
            const deletedItem = await deleteItem(itemId);
            return NextResponse.json({ success: true, data: deletedItem }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 404 });
        }
    } else {
        return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
    }
}
