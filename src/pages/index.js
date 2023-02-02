import Head from 'next/head';
import {products} from "@/data/products";
import {Card, Container, Group, Image, SimpleGrid, Text, Badge, ThemeIcon} from '@mantine/core';
import {IconShoppingCart, IconShoppingCartPlus} from "@tabler/icons-react";


export default function Home(props) {


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
                                        radius="xl" size="lg" onClick={() => {
                                        props.setCartOpen(true)
                                    }}
                                               variant="gradient" gradient={{from: 'teal', to: 'lime', deg: 60}}>
                                        <IconShoppingCartPlus size="22"/>
                                    </ThemeIcon>

                                    <Image src={"/images/" + product.image}
                                           height={400}/>
                                </Card.Section>
                                <Group position="apart">
                                    <Text weight={500} py="xs">{product.product}</Text>
                                    <Badge color="lime" variant="light">{(product.price/100).toLocaleString("en-US", {style:"currency", currency:"USD"})}</Badge>
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
