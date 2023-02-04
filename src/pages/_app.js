import {AppProps} from 'next/app';
import Head from 'next/head';
import {
    MantineProvider,
    Header,
    Group,
    Text,
    SimpleGrid,
    Button,
    ThemeIcon,
    Drawer,
    Timeline,
    Center,
    Avatar, Container, Stack,
    Badge
} from '@mantine/core';
import {IconShoppingCart, IconTrashX, IconChevronLeft, IconChevronRight} from "@tabler/icons-react";
import Link from "next/link";
import styles from "@/styles/Globals.css";
import {useEffect, useState} from "react";
import {centsToCurrency} from "@/service/currency";

export default function App(props) {
    const {Component, pageProps} = props;

    const [cartOpen, setCartOpen] = useState(false);
    const [cartContents, setCartContents] = useState(new Map());

    useEffect(() => {
        let storageSupported = false;
        try {
            storageSupported = (window.localStorage && true);
        } catch (e) {
            console.error(e);
        }
        if (!storageSupported) return;
        const setCart = () => {
            if (localStorage.getItem("cart")) {
                const currentCart = new Map(JSON.parse(window.localStorage.getItem("cart")));
                setCartContents(currentCart);
            }
            if (!localStorage.getItem("cart")) localStorage.setItem("cart", JSON.stringify(Array.from(new Map().entries())));
        }

        setCart();

        window.addEventListener('storage', setCart)

        return () => {
            window.removeEventListener('storage', setCart)
        }


    }, [cartOpen]);

    const localStorageCartUpdate = (newContents) => {
        localStorage.setItem("cart", JSON.stringify(Array.from(newContents)));
        const currentCart = new Map(JSON.parse(window.localStorage.getItem("cart")));
        setCartContents(currentCart);
        if (currentCart.size === 0) setCartOpen(false);
    }

    let cartModals = [];
    let totalCartValue = 0;

    cartContents.forEach((entry, key) => {
        cartModals.push(
            <Group position="apart">
                <Group>
                    <IconTrashX style={{height: 20, color: "red", cursor: "pointer"}}
                                onClick={() => {
                                    const cartContentsCopy = new Map(cartContents);
                                    cartContentsCopy.delete(key);
                                    console.log(cartContentsCopy)
                                    localStorageCartUpdate(cartContentsCopy);
                                }}/>

                    <Stack spacing="xs">
                        <ThemeIcon radius="100%" style={{cursor: "pointer"}} color="red"
                                   onClick={() => {
                                       const cartContentsCopy = new Map(cartContents);
                                       cartContentsCopy.get(key).amount+=1;
                                       console.log(cartContentsCopy)
                                       localStorageCartUpdate(cartContentsCopy);
                                   }}>
                            +
                        </ThemeIcon>
                        <ThemeIcon radius="100%" style={{cursor: "pointer"}} color="red" variant="light"
                                   onClick={() => {
                                       const cartContentsCopy = new Map(cartContents);
                                       cartContentsCopy.get(key).amount===1 ?
                                           cartContentsCopy.delete(key)
                                           :
                                           cartContentsCopy.get(key).amount-=1;
                                       console.log(cartContentsCopy)
                                       localStorageCartUpdate(cartContentsCopy);
                                   }}>
                            -
                        </ThemeIcon>
                    </Stack>
                    <Avatar
                        size={60}
                        radius="50%"
                        src={"images/" + entry.productDetails.image}
                    />
                    <div>
                        <Text>{entry.productDetails.product}</Text>
                        <Text color="dimmed" size="sm">
                            Amount: {entry.amount}
                        </Text>
                    </div>
                </Group>
                <Group>
                    <Badge color="lime">{centsToCurrency(entry.productDetails.price * entry.amount)}</Badge>
                </Group>
            </Group>
        );

        totalCartValue += entry.productDetails.price * entry.amount;
    });

    return (
        <>
            <Head>
                <title>Page title</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    /** Put your mantine theme override here */
                    colorScheme: 'light',
                    colors: {
                        'dark': [
                            '#F4FCE3',
                            '#E9FAC8',
                            '#D8F5A2',
                            '#C0EB75',
                            '#A9E34B',
                            '#94D82D',
                            '#82C91E',
                            '#74B816',
                            '#66A80F',
                            '#5C940D',
                        ]
                    }
                }}
            >

                <Header p="sm">
                    <Group position="apart">
                        <div style={{paddingLeft: "1%", width: "9%"}}></div>
                        <Link href="/">
                            <Text align="center" size="lg" weight={300}>Choose. Click. Order.</Text>
                        </Link>
                        <div style={{paddingRight: "1%", width: "9%"}}>
                            <ThemeIcon radius="xl" size="lg" style={{cursor: "pointer"}} onClick={() => {
                                setCartOpen(true)
                            }}
                                       variant="gradient" gradient={{from: 'teal', to: 'lime', deg: 60}}>
                                <IconShoppingCart size="22"/>
                            </ThemeIcon>
                        </div>
                    </Group>

                </Header>

                <Drawer opened={cartOpen} onClose={() => setCartOpen(false)}
                        size="xl" position="right" overlayBlur={3} overlayOpacity={0.3} withCloseButton={false}>
                    <Stack p="lg">
                        <Group px="md" position="apart" style={{borderBottom: "solid"}}>
                            <div style={{width: "23%"}}>
                                <IconChevronLeft onClick={() => setCartOpen(false)}
                                                 style={{color: "red", cursor: "pointer"}}/>
                            </div>

                            <Text align="center" size="xl" weight={300} p="xs">Cart</Text>

                            <div style={{width: "0", paddingRight: "23%"}}>
                                <Badge color="lime"
                                       hidden={cartModals.length === 0}>total: {centsToCurrency(totalCartValue)}</Badge>
                            </div>
                        </Group>
                        {cartModals.length > 0 ? cartModals : <Text align="center">Your cart is empty</Text>}

                        <Group p="md" position="apart" hidden={cartModals.length === 0}>
                            <Text color="red" style={{cursor: "pointer"}} onClick={() => {
                                localStorageCartUpdate(new Map());
                            }}>Clear Cart</Text>
                            <Link href="/order" passHref>
                                <ThemeIcon style={{cursor: "pointer"}} size="xl" radius="50%" variant="gradient"
                                           gradient={{from: 'teal', to: 'lime', deg: 60}}>
                                    <IconChevronRight onClick={() => setCartOpen(false)}/>
                                </ThemeIcon>
                            </Link>
                        </Group>
                    </Stack>
                </Drawer>

                <Component {...pageProps} setCartOpen={setCartOpen}/>
            </MantineProvider>
        </>
    );
}