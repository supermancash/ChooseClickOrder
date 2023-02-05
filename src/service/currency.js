

export const centsToCurrency = (number) => {
    return "$ " + (number/100).toFixed(2);
}