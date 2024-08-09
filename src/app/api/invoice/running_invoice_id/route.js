import {findLatestInvoice} from "@/services/server/invoice.service";
import {NextResponse} from "next/server";

export async function GET(req, res) {
    try {
        const latest = await findLatestInvoice()

        return NextResponse.json({ success: true, data: latest }, { status: 200 })
    } catch (error) {
        return NextResponse.json({success: false, error: error.message}, {status: 500});
    }
}