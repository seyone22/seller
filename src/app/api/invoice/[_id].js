import {getInvoice} from "@/services/server/invoice.service";
import {NextResponse} from "next/server";

export async function GET(req, res) {
    if (req.method === 'GET') {
        try {
            const { _id } = req.query;
            const invoice = await getInvoice(_id);
            return NextResponse.json({ success: true, data: invoice }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 404 });
        }
    } else {
        return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
    }
}
// TODO: DON'T USE THIS, CRASHES IRRECOVERABLY