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
    Button
} from "@mantine/core";
import {IconChevronRight, IconTrashX} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import {centsToCurrency} from "@/service/currency";
import {useFocusTrap, useHotkeys} from "@mantine/hooks";

const Order = () => {
    const [count, setCount] = useState(0);
    const [review, setReview] = useState(false);
    const [errorState, setErrorState] = useState("");
    const ref = useRef([]);
    const orderDataRef = useRef(new Map());

    // for usability
    const focusTrapRef= useFocusTrap();
    useHotkeys([
        ['Enter', () => handleContinue()],
    ]);


    useEffect(() => {
        ref.current = ref.current.slice(0, orderInputs.length)
    }, [])


    const handleContinue = () => {
        // TODO: save input

        const currentRef = ref.current[count / 2].value;
        if (currentRef === "" && count < orderInputs.length * 2 - 2) return setErrorState("This field is mandatory");
        if (count === 2 && !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
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
        }, 401);
    }

    const handleCheckout = () => {
        alert("Thank you for your oder");
        // TODO: post to endpoint with data and reroute back to index with thank you popup
    }


    const orderInputs = [
        {
            label: "Full Name",
            placeholder: "Your full name",
            mandatory: true
        },
        {
            label: "Email",
            placeholder: "Your email address",
            mandatory: true
        },
        {
            label: "Full Address",
            placeholder: "Your home address",
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
        const currentCart = new Map(JSON.parse(window.localStorage.getItem("cart")));
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
                <div style={{height: "12vh"}}>
                    {orderInputs.map((orderInput, index) =>
                        <div key={index} ref={focusTrapRef}>
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
                                        <TextInput
                                            p="md"
                                            placeholder={orderInput.placeholder}
                                            label={orderInput.label}
                                            withAsterisk={orderInput.mandatory}
                                            error={errorState}
                                            ref={el => ref.current[index] = el}
                                        />
                                    </div>
                                }
                            </Transition>
                        </div>
                    )}
                </div>
            }


            <Group p="md" position="apart">
                <div>
                    <Text hidden={!review} color="red" style={{cursor: "pointer"}}>Re-enter Details</Text>
                </div>
                {review ?
                    <Button onClick={handleCheckout} rightIcon={<IconChevronRight/>}
                            variant="gradient" gradient={{from: "teal", to: "lime", deg: 60}} radius="xl">
                        Confirm and Order
                    </Button>
                    :
                    <ThemeIcon style={{cursor: "pointer"}} size="xl" radius="50%" variant="gradient"
                               gradient={{from: 'teal', to: 'lime', deg: 60}}>
                        <IconChevronRight onClick={handleContinue}/>
                    </ThemeIcon>
                }

            </Group>

        </Container>
    );
}

export default Order;