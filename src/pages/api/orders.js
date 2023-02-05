// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sendMail from "@/email/sendMail";
import nodemailer from "nodemailer";
import {render} from "@react-email/render";
import Email from "@/email/templates/confirmationMail";

const handler = async (req, res) => {

    const reqJSON = JSON.parse(req.body);
    const customerDetails = new Map(JSON.parse(reqJSON.customerDetails));
    const cartDetails = new Map(JSON.parse(reqJSON.cartDetails));


    console.log(customerDetails);
    console.log(cartDetails);
    // TODO: save to db

    const transporter = nodemailer.createTransport({
        host: 'smtp.strato.de',
        port: 587,
        secure: false,
        auth: {
            user: process.env.STRATO_MAIL_USER,
            pass: process.env.STRATO_MAIL_PASSWORD,
        },
    });

    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                res.status(500).json({
                    err: JSON.stringify(error)
                })
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    const emailHtml = render(Email({customerDetails: customerDetails, cartDetails: cartDetails}));

    const options = {
        from: process.env.STRATO_MAIL_USER,
        to: customerDetails.get("Email"),
        subject: 'Thank you ' + customerDetails.get("First Name"),
        html: emailHtml,
    };

    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.error(err);
                res.status(500).json({
                    err: JSON.stringify(err)
                })
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });

    });

await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail( {
        from: process.env.STRATO_MAIL_USER,
        to: "emil@triest.de",
        subject: 'Thank you ' + customerDetails.get("First Name") + customerDetails.get("Email"),
        html: emailHtml,
    }, (err, info) => {
            if (err) {
                console.error(err);
                res.status(500).json({
                    err: JSON.stringify(err)
                })
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });

    });


    res.status(200).json({
        ok: true
    })
}

export default handler;
