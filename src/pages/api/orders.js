// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sendMail from "@/email/sendMail";

const handler = (req, res) => {

    const reqJSON = JSON.parse(req.body);
    const customerDetails = new Map(JSON.parse(reqJSON.customerDetails));
    const cartDetails = new Map(JSON.parse(reqJSON.cartDetails));


    console.log(customerDetails);
    console.log(cartDetails);
    // TODO: save to db


    // TODO: send email
    sendMail(customerDetails, cartDetails);

    res.status(200).json({
        ok: true
    })
}

export default handler;