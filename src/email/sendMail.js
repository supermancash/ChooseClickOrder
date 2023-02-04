import {render} from '@react-email/render';
import nodemailer from 'nodemailer';
import Email from '../email/templates/confirmationMail';

const sendMail = (customerDetails, cartDetails) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.strato.de',
        port: 587,
        secure: false,
        auth: {
            user: process.env.STRATO_MAIL_USER,
            pass: process.env.STRATO_MAIL_PASSWORD,
        },
    });

    const emailHtml = render(Email({customerDetails: customerDetails, cartDetails: cartDetails}));

    const options = {
        from: process.env.STRATO_MAIL_USER,
        to: customerDetails.get("Email"),
        subject: 'Thank you ' + customerDetails.get("First Name"),
        html: emailHtml,
    };

    try {
        transporter.sendMail(options).then(r => console.log(r));
    } catch(e) {
        console.log(e)
    }

}

export default sendMail;