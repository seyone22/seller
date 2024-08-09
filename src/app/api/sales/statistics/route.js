import {NextResponse} from "next/server";
import {getSalesStatistics} from "@/services/server/invoice.service";

export async function GET(req, res) {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range');

    try {
        const statistics = await getSalesStatistics(range)
        return NextResponse.json({success: true, data: statistics}, {status: 200})
    } catch (error) {
        return NextResponse.json({success: false, error: error.message}, {status: 500});
    }

}