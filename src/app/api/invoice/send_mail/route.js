import { sendEmail } from '@/utils/nodemailer';
import {NextResponse} from "next/server";

export async function POST(req, res) {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        const success = await sendEmail(to, subject, text, html);
        if (success) {
            return NextResponse.json({success: true}, {status: 200})
        } else {
            return NextResponse.json({success: false, error: "Error sending email, check Nodemailer configuration"}, {status: 500})
        }
    } catch (error) {
        return NextResponse.json({success: false, error: error.message}, {status: 500})
    }
}