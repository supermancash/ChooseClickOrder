import {AppProps} from 'next/app';
import Head from 'next/head';
import {MantineProvider, Header, Group, Text, SimpleGrid, Button, ThemeIcon, Drawer} from '@mantine/core';
import {IconShoppingCart} from "@tabler/icons-react";
import Link from "next/link";
import styles from "@/styles/Globals.css";
import {useState} from "react";

export default function App(props) {
    const {Component, pageProps} = props;

    const [cartOpen, setCartOpen] = useState(false);

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
                        <div></div>
                        <Link href="/">
                            <Group style={{cursor: "pointer", textDecoration: "none"}}>
                                <Text size="lg" weight={300}>Choose.</Text>
                                <Text size="lg" weight={300}>Click.</Text>
                                <Text size="lg" weight={300}>Order.</Text>
                            </Group>
                        </Link>
                        <div style={{paddingRight: "1%"}}>
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
                </Drawer>
                <Component {...pageProps} setCartOpen={setCartOpen}/>
            </MantineProvider>
        </>
    );
}