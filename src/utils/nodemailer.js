// lib/nodemailer.js
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendEmail = async (invoiceData) => {
    try {
        // Load HTML Template
        const templatePath = path.join(process.cwd(), 'templates', 'invoiceTemplate.html');
        let template = fs.readFileSync(templatePath, 'utf-8');

        const formattedDate = new Date(invoiceData.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true // To use 12-hour format with AM/PM
        });

        template = template.replace('{{customerName}}', invoiceData.customer.name)

        template = template.replace('{{recieptId}}', invoiceData.invoiceNumber)
        template = template.replace('{{purchaseDate}}', formattedDate)
        template = template.replace('{{customerTelephone}}', invoiceData.customer.phone);

        // Item Table Data
        const itemsTable = invoiceData.items.map(item => `
            <tr>
                <td>${item.itemCode}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.total}</td>
            </tr>
        `).join('');
        template = template.replace('{{itemsTable}}', itemsTable)

        template = template.replace('{{subtotal}}', invoiceData.subtotal)
        template = template.replace('{{discount}}', invoiceData.discount.value)
        template = template.replace('{{total}}', invoiceData.total)

        template = template.replace('{{paymentMethod}}', invoiceData.paymentMethod)


        const mailOptions = {
            from: process.env.MAIL_USER,
            to: invoiceData.customer.email,
            subject: "Anime.lk Merch Reciept",
            html: template
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
