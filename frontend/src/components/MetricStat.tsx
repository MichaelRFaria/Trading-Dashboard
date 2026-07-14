import {parseNumberToDollars} from "@/src/helper/format";
import {calculatePortfolioReturnPercentage} from "@/src/helper/helper";

export default function MetricStat({text, stat, portfolioValue, percentage}: {
    text: string,
    stat: number,
    portfolioValue: number,
    percentage: boolean
}) {
    if (stat > 0) {
        return <>
            <td>{text}</td>
            <td
                className="text-green-600">+{parseNumberToDollars(stat)} {percentage && <>({calculatePortfolioReturnPercentage(stat, portfolioValue)}%)</>}
            </td>
        </>
    } else {
        return <>
            <td>{text}</td>
            <td
                className="text-red-600">-{parseNumberToDollars(stat)} ({calculatePortfolioReturnPercentage(stat, portfolioValue)}%)
            </td>
        </>
    }
}