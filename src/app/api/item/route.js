import { deleteItem, getAllItems, insertItem } from "@/services/server/item.service";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const items = await getAllItems();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        if (type === "all") {
            return NextResponse.json({ success: true, data: items }, { status: 200 });
        } else if (type === "active") {
            const filtered = items.filter(item => item.active === true);
            return NextResponse.json({ success: true, data: filtered }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const newItem = await insertItem(await req.json());
        return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get('itemId');

        if (!itemId) {
            return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
        }

        const deletedItem = await deleteItem(itemId);
        return NextResponse.json({ success: true, data: deletedItem }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }
}
