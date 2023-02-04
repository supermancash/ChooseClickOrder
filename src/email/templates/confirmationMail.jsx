import {Button} from '@react-email/button';
import {Container} from '@react-email/container';
import {Head} from '@react-email/head';
import {Heading} from '@react-email/heading';
import {Column} from '@react-email/column';
import {Hr} from '@react-email/hr';
import {Html} from '@react-email/html';
import {Img} from '@react-email/img';
import {Link} from '@react-email/link';
import {Preview} from '@react-email/preview';
import {Section} from '@react-email/section';
import {Text} from '@react-email/text';
import * as React from 'react';


const baseUrl = process.env.VERCEL_URL;

export default function Email(props) {
    const previewText = `View your order details now`;

    const {customerDetails, cartDetails} = props;
    const customerDetailsCopy = new Map(customerDetails)
    customerDetailsCopy.delete("Email");
    customerDetailsCopy.delete("Phone Number");

    const cartItemsModals = [];
    cartDetails.forEach((entry, key) => cartItemsModals.push(
        <Section key={key} style={{display: "inline-block"}}>
            <Column>
                <Img style={avatar} src={baseUrl + "/images/" + entry.productDetails.image} width="48" height="48"/>
            </Column>
            <Column>
                <Text style={text}>{entry.productDetails.product}</Text>
                <Text style={text}>Amount: {entry.amount}</Text>
            </Column>
        </Section>
    ));

    const customerDetailsModals = [];
    customerDetailsCopy.forEach((entry, key) => customerDetailsModals.push(
        <div key={key}>
            <Section style={{display: "inline-block"}}>
                <Column>
                    <div>{entry}</div>
                </Column>
            </Section>
        </div>
    ));

    return (
        <Html>
            <Head/>
            <Preview>{previewText}</Preview>
            <Section style={main}>
                <Container style={container}>
                    <Heading style={h1}>
                        Thank you <strong>{customerDetails.get("First Name")}</strong> for shopping at <Text style={{fontWeight: 100, fontSize: "20px"}}>Choose. Click.
                        Order.</Text>
                    </Heading>

                    <Hr/>

                    <Text>Your Items:</Text>
                    {cartItemsModals}

                    <Hr/>

                    <Text>Will be sent to the following address:</Text>
                    {customerDetailsModals}

                    <Hr/>

                    <Section style={{textAlign: 'center'}}>
                        <Button pX={20} pY={12} style={btn} href={"https://example.org"}>
                            Payment
                        </Button>
                    </Section>
                </Container>
            </Section>
        </Html>
    );
}

const main = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
};

const container = {
    border: '1px solid #eaeaea',
    borderRadius: '5px',
    margin: '40px auto',
    padding: '20px',
    width: '465px',
};

const logo = {
    margin: '0 auto',
};

const h1 = {
    color: '#000',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '24px',
    fontWeight: 'normal',
    textAlign: 'center',
    margin: '30px 0',
    padding: '0',
};

const avatar = {
    borderRadius: '100%',
    marginRight: '50px'
};

const link = {
    color: '#067df7',
    textDecoration: 'none',
};

const text = {
    color: '#000',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '14px',
    lineHeight: '16px',
};

const black = {
    color: 'black',
};

const center = {
    verticalAlign: 'middle',
};

const btn = {
    backgroundColor: '#000',
    borderRadius: '5px',
    color: '#fff',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '50px',
    textDecoration: 'none',
    textAlign: 'center',
};

const spacing = {
    marginBottom: '26px',
};

const hr = {
    border: 'none',
    borderTop: '1px solid #eaeaea',
    margin: '26px 0',
    width: '100%',
};

const footer = {
    color: '#666666',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '12px',
    lineHeight: '24px',
};
