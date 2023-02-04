import Head from 'next/head';
import {products} from "@/data/products";
import {Card, Container, Group, Image, SimpleGrid, Text, Badge, ThemeIcon} from '@mantine/core';
import {IconShoppingCart, IconShoppingCartPlus} from "@tabler/icons-react";
import {centsToCurrency} from "@/service/currency";


export default function Home(props) {

    const handleCartPlus = (productIndex) => {
        const currentCart = new Map(JSON.parse(window.localStorage.getItem("cart")));
        currentCart.has(products[productIndex].product) ?
            currentCart.get(products[productIndex].product).amount += 1
            :
            currentCart.set(products[productIndex].product, {productDetails: products[productIndex], amount: 1})
        window.localStorage.setItem("cart", JSON.stringify(Array.from(currentCart.entries())));
        props.setCartOpen(true);
    }

    return (
        <>
            <Head>
                <title>C.C.O.</title>
                <meta name="description" content="Ecommerce at its finest"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <main style={{background: "#F8F9FA"}}>
                <Container size="xl">
                    <SimpleGrid p="md" cols={1} breakpoints={[{minWidth: "sm", cols: 3, spacing: 'sm'}]}>
                        {products.map((product, index) =>
                            <Card key={index} shadow="md">
                                <Card.Section>
                                    <ThemeIcon
                                        style={{zIndex: 3, position: "absolute", margin: "15px", right: 0}}
                                        radius="xl" size="lg" onClick={() => handleCartPlus(index)}
                                        variant="gradient" gradient={{from: 'teal', to: 'lime', deg: 60}}>
                                        <IconShoppingCartPlus size="22"/>
                                    </ThemeIcon>

                                    <Image src={"/images/" + product.image}
                                           height={400}/>
                                </Card.Section>
                                <Group position="apart">
                                    <Text weight={500} py="xs">{product.product}</Text>
                                    <Badge color="lime" variant="light">{centsToCurrency(product.price)}</Badge>
                                </Group>

                                <Text size="sm" color="dimmed">{product.description}</Text>
                            </Card>
                        )}
                    </SimpleGrid>
                </Container>
            </main>
        </>
    )
}
