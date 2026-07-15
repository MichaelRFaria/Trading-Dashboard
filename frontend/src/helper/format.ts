// formats a positive number to have a dollar sign and commas for every 3rd number
export function parseNumberToDollars(num: number): string {
    const fixedNum = num.toFixed(2) // format number to 2 decimal places
    const localeNum = fixedNum.toLocaleString() // convert number to LocalString (quick way to format commas into the number)

    return `$${localeNum}`
}