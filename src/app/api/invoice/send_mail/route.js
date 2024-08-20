import {sendEmail} from '@/utils/nodemailer';
import {NextResponse} from "next/server";

export async function POST(req, res) {
    const requestData = await req.json();

    if (!requestData.invoiceData) {
        return NextResponse.json({success: false, error: 'Missing required fields.'}, {status: 400})
    }

    try {
        const success = await sendEmail(requestData.invoiceData);
        if (success) {
            return NextResponse.json({success: true}, {status: 200})
        } else {
            return NextResponse.json({
                success: false,
                error: "Error sending email, check Nodemailer configuration"
            }, {status: 500})
        }
    } catch (error) {
        return NextResponse.json({success: false, error: error.message}, {status: 500})
    }
}