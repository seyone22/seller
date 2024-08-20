import {createInvoiceAndDeductInventory} from "@/services/server/invoice.service";
import {NextResponse} from "next/server";

export async function POST(req, res) {
    try {
        const authKey = req.headers.get('Authentication');

        console.log(process.env.UNSAFE_AUTH_KEY);

        if (authKey === process.env.UNSAFE_AUTH_KEY) {
            return NextResponse.json({success: true}, {status: 200})
        } else {
            return NextResponse.json({success: false}, {status: 401})
        }
    } catch (e) {
        return NextResponse.json({success: false, error: e.message}, {status: 500})
    }
}