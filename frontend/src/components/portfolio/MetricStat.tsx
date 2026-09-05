import {parseNumberToDollars} from "@/src/helper/format";
import {MetricFormat} from "@/src/types/misc";
import {calculatePortfolioReturnPercentage} from "@/src/helper/helper";

export default function MetricStat({text, stat, format, portfolioValue}: {
    text: string,
    stat: string | number,
    format: MetricFormat,
    portfolioValue?: number,
}) {
    switch (format) {
        case "text":
            return <tr>
                <td>{text}</td>
                <td>{stat}</td>
            </tr>
        case "currency":
            return <tr>
                <td>{text}</td>
                <td>{parseNumberToDollars(stat as number)}</td>
            </tr>
        case "gain":    {/* case fallthrough used as these two cases are essentially the same other than the percentage section at the end. using case fallthrough gives no duplicated code */}
        case "gainWithPercentage":
            const gain = stat as number
            const positive = gain >= 0

            return <tr>
                <td>{text}</td>
                <td className={positive ? "text-green-600" : "text-red-600"}>
                    {positive ? "+" : "-"}
                    {parseNumberToDollars(Math.abs(gain))}

                    {format === "gainWithPercentage" && portfolioValue !== undefined && (
                        <> ({calculatePortfolioReturnPercentage(gain, portfolioValue)}%)</>
                    )}
                </td>
            </tr>
    }
}