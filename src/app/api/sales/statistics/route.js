import {NextResponse} from "next/server";
import {getSalesStatistics} from "@/services/server/invoice.service";

export async function GET(req, res) {
    if (req.method === 'GET') {
        try {
            const statistics = await getSalesStatistics()
            return NextResponse.json({success: true, data: statistics}, {status: 200})
        } catch (error) {
            return NextResponse.json({success: false, error: error.message}, {status: 500});
        }
    } else {
        return NextResponse.json({success: false, error: 'Method not allowed'}, {status: 405});
    }
}