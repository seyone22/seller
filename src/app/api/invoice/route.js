// POST an invoice to the database
import {cancelInvoice, createInvoiceAndDeductInventory, getAllInvoices} from "@/services/server/invoice.service";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    if (req.method === 'GET') {
        try {
            const invoices = await getAllInvoices();
            return NextResponse.json({ success: true, data: invoices }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
    }
}
export async function POST(req, res) {
    if (req.method === 'POST') {
        try {
            console.log('TEST');
            const invoice = await createInvoiceAndDeductInventory(await req.json());
            console.log('TEST');
            return NextResponse.json({ success: true, data: invoice }, { status: 201 })
        } catch (e) {
            return NextResponse.json({ success: false, error: e.message }, { status: 400 })
        }
    } else {
        return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
    }
}

export async function DELETE(req, res) {
    if (req.method === 'DELETE') {
        try {
            const { invoiceId } = req.query;
            const deletedInvoice = await cancelInvoice(invoiceId);
            return NextResponse.json({ success: true, data: deletedInvoice }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 404 });
        }
    } else {
        return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
    }
}