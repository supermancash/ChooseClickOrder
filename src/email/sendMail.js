import {render} from '@react-email/render';
import nodemailer from 'nodemailer';
import Email from '../email/templates/confirmationMail';

const sendMail = async (customerDetails, cartDetails) => {
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
                console.error(error);
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
        subject: 'Your order at Choose. Click. Order.',
        html: emailHtml,
    };

    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });

    });

    await new Promise((resolve, reject) => {
        // send mail to admin
        transporter.sendMail({
            from: process.env.STRATO_MAIL_USER,
            to: process.env.ADMIN_MAIL,
            subject: 'New Order ' + customerDetails.get("First Name") + '' + customerDetails.get("Email"),
            html: emailHtml,
        }, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });

    });


}

export default sendMail;