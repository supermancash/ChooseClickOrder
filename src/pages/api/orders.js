// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sendMail from "@/email/sendMail";
import nodemailer from "nodemailer";
import {render} from "@react-email/render";
import Email from "@/email/templates/confirmationMail";

const handler = (req, res) => {

    const reqJSON = JSON.parse(req.body);
    const customerDetails = new Map(JSON.parse(reqJSON.customerDetails));
    const cartDetails = new Map(JSON.parse(reqJSON.cartDetails));


    console.log(customerDetails);
    console.log(cartDetails);
    // TODO: save to db


    // TODO: send email
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


    res.status(200).json({
        ok: true
    })
}

export default handler;