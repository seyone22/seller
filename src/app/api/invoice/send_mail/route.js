import {sendEmail} from '@/utils/nodemailer';
import {NextResponse} from "next/server";

export async function POST(req, res) {
    const requestData = await req.json();

    console.log(requestData);


    if (!requestData.to || !requestData.subject || !requestData.text || !requestData.html) {
        return NextResponse.json({success: false, error: 'Missing required fields.'}, {status: 400})
    }

    try {
        const success = await sendEmail(requestData.to, requestData.subject, requestData.text, requestData.html);
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