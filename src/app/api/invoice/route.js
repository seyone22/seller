// POST an invoice to the database
import {cancelInvoice, createInvoiceAndDeductInventory, getAllInvoices} from "@/services/server/invoice.service";
import { NextResponse } from "next/server";
import {getAllItems} from "@/services/server/item.service";

export async function GET(req, res) {
    if (req.method === 'GET') {
        try {
            const { searchParams } = new URL(req.url);
            const date = searchParams.get('date');

            const invoices = await getAllInvoices();

            if (date === "all") {
                return NextResponse.json({ success: true, data: invoices }, { status: 200 });
            } else if (date === "today") {
                const filtered = invoices.filter(item => {
                    const itemDate = new Date(item.date).toISOString().split('T')[0];
                    const today = new Date().toISOString().split('T')[0];
                    return itemDate === today;
                });
                return NextResponse.json({ success: true, data: filtered }, { status: 200 });
            } else {
                return NextResponse.json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
            }
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