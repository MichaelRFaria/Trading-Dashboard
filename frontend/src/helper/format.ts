export function parseNumberToDollars(num: number) {
    const fixedNum = num.toFixed(2) // format number to 2 decimal places
    const localeNum = fixedNum.toLocaleString() // convert number to LocalString (quick way to format commas into the number)

    // return the formatted number with a dollar sign
    // if the number was negative we remove the negative sign and place it at the start of the string
    return (num >= 0) ? `+$${localeNum}` : `-$${localeNum.slice(1)}`
}