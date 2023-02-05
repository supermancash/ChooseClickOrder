import {
    Avatar, Badge,
    Container,
    Group,
    SimpleGrid,
    Space,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Transition,
    Button,
    FocusTrap,
    Center, Progress
} from "@mantine/core";
import {IconChevronRight, IconTrashX} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import {centsToCurrency} from "@/service/currency";
import {getHotkeyHandler, useFocusTrap, useHotkeys} from "@mantine/hooks";

const Order = () => {
    // TODO: progress bar

    console.log(process.env.VERCEL_URL)

    const [count, setCount] = useState(0);
    const [progressValue, setProgressValue] = useState(5)
    const [review, setReview] = useState(false);
    const [errorState, setErrorState] = useState("");
    const [currentCart, setCurrentCart] = useState(new Map());
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const ref = useRef([]);
    const orderDataRef = useRef(new Map());


    // for usability
    useHotkeys([
        ['Enter', () => handleContinue()],
    ]);


    useEffect(() => {
        ref.current = ref.current.slice(0, orderInputs.length);
        setCurrentCart(new Map(JSON.parse(window.localStorage.getItem("cart"))));
    }, [])


    const handleContinue = () => {

        const currentRef = ref.current[count / 2].value;
        if (currentRef === "" && count < orderInputs.length * 2 - 2) return setErrorState("This field is mandatory");
        if (count === 10 && !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
            .test(currentRef)) return setErrorState("Please enter a valid email");
        // input checked

        orderDataRef.current.set(orderInputs[count / 2].label, currentRef);

        setErrorState("");
        if (count >= (orderInputs.length * 2) - 2) {
            return setReview(true);
        }
        setCount(count + 1);
        setTimeout(() => {
            setCount(count + 2);
            setProgressValue(progressValue+(1/orderInputs.length*100));
        }, 401);
    }

    const handleCheckout = () => {
        setLoadingCheckout(true);
        localStorage.setItem("cart", JSON.stringify(Array.from(new Map())));

        fetch("/api/orders", {
            method: 'POST',
            body: JSON.stringify({
                customerDetails: JSON.stringify(Array.from(orderDataRef.current)),
                cartDetails: JSON.stringify(Array.from(currentCart))
            }),
        }).then(res => res.json())
            .then(res => {
                if (res.ok) {
                    setLoadingCheckout(false);
                    window.location = "/?thankyou=true&email=" + orderDataRef.current.get("Email");
                }
            })
    }


    const orderInputs = [
        {
            label: "First Name",
            placeholder: "Your First Name",
            mandatory: true
        },
        {
            label: "Second Name",
            placeholder: "Your Second Name",
            mandatory: true
        },
        {
            label: "Address",
            placeholder: "Your home address",
            mandatory: true
        },
        {
            label: "Postal Code",
            placeholder: "Your postal code",
            mandatory: true
        },
        {
            label: "City",
            placeholder: "The city in which your home is",
            mandatory: true
        },
        {
            label: "Email",
            placeholder: "Your email address",
            mandatory: true
        },
        {
            label: "Phone Number",
            placeholder: "Your phone number",
            mandatory: false
        },

    ];

    const orderReview = [];
    const cartItems = [];
    let cartTotal = 0;

    if (review) {
        currentCart.forEach((entry, key) => {
            cartItems.push(
                <>
                    <Group position="apart">
                        <Group>
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
                </>
            );
            cartTotal += entry.productDetails.price * entry.amount;
        });


        orderDataRef.current.forEach((entry, key) => orderReview.push(
            <>
                <Text weight={300}>{key}</Text>
                <Text>{entry === "" ? "-" : entry}</Text>
            </>
        ));
    }

    if (currentCart.size === 0) return (
        <Container p="md">
            <Center>
                Your Cart is empty, please add items to your cart to order
            </Center>
        </Container>
    )

    // TODO: Rabbattcode
    return (
        <Container>
            <Group spacing="xs" style={{borderBottom: "solid"}} position="apart">
                <Text p="md" size="xl" weight={500}>{review ? "Review your order" : "Your Details"}</Text>
                <Group hidden={review}>
                    <Text color="red">*</Text>
                    <Text color="dimmed" size="xs">mandatory</Text>
                </Group>
            </Group>

            {review ?
                <div>
                    <Group position="apart">
                        <Text weight={500} p="md">Your Cart</Text>
                        <Badge color="lime">total: {centsToCurrency(cartTotal)}</Badge>
                    </Group>
                    <Stack p="md">
                        {cartItems}
                    </Stack>

                    <Text weight={500} p="md">Your Details</Text>
                    <SimpleGrid style={{width: "80vw"}} cols={2} p="xl">
                        {orderReview}
                    </SimpleGrid>
                </div>
                :
                <div>
                    <div style={{paddingLeft: "15px", paddingRight: "15px"}}>
                        <Progress
                            mt="md"
                            size="xl"
                            value={progressValue}
                            radius="xl"
                            color="teal"
                            animate
                        />
                    </div>
                    <div style={{height: "12vh"}}>
                        {orderInputs.map((orderInput, index) =>
                            <div key={index}>
                                <Transition
                                    transition={
                                        {
                                            in: {transform: "scaleX(1)"},
                                            out: {transform: "scaleX(0)"},
                                            transitionProperty: 'transform',
                                        }
                                    }
                                    duration={400} timingFunction="ease"
                                    mounted={count === (index * 2)}
                                    hidden={count !== (index * 2)}
                                >
                                    {(styles) =>
                                        <div style={{...styles}}>
                                            <FocusTrap active={count === (index * 2)}>
                                                <TextInput
                                                    p="md"
                                                    placeholder={orderInput.placeholder}
                                                    label={orderInput.label}
                                                    withAsterisk={orderInput.mandatory}
                                                    error={errorState}
                                                    ref={el => ref.current[index] = el}
                                                    onKeyDown={getHotkeyHandler([
                                                        ['Enter', handleContinue],
                                                    ])}
                                                />
                                            </FocusTrap>
                                        </div>
                                    }
                                </Transition>
                            </div>
                        )}
                    </div>
                </div>
            }


            <Group position="apart" p="md">
                {review ?
                    <>
                        <Text onClick={() => {
                            setCount(0);
                            setReview(false);
                            setProgressValue(5)
                        }} color="red" style={{cursor: "pointer"}}>Re-enter Details</Text>
                        <Button p="xs" onClick={handleCheckout} rightIcon={<IconChevronRight/>} size="xs"
                                loading={loadingCheckout}
                                variant="gradient" gradient={{from: "teal", to: "lime", deg: 60}} radius="xl">
                            <Text size="sm">Confirm & Order</Text>
                        </Button>
                    </>
                    :
                    <>
                        <div>
                            <Text
                                hidden={count === 0}
                                onClick={() => {
                                    setCount(count - 2);
                                    setProgressValue(progressValue-(1/orderInputs.length*100))
                                }} color="red" style={{cursor: "pointer"}}
                            >
                                Back
                            </Text>
                        </div>
                        <ThemeIcon style={{cursor: "pointer"}} size="xl" radius="50%" variant="gradient"
                                   gradient={{from: 'teal', to: 'lime', deg: 60}}>
                            <IconChevronRight onClick={handleContinue}/>
                        </ThemeIcon>
                    </>
                }

            </Group>

        </Container>
    );
}

export default Order;