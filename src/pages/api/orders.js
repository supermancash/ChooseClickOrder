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

    await (sendMail(customerDetails, cartDetails));

    res.status(200).json({
        ok: true
    })
}

export default handler;
