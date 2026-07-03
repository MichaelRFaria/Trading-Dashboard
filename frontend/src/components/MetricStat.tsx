import {parseNumberToDollars} from "@/src/helper/format";
import {calculatePortfolioReturnPercentage} from "@/src/helper/helper";

export default function MetricStat({text, stat, portfolioValue}) {
    if (stat > 0) {
        return <p>{text}<span className="text-green-600">+{parseNumberToDollars(stat)} ({calculatePortfolioReturnPercentage(stat, portfolioValue)}%)</span></p>
    } else {
        return <p>{text}<span className="text-red-600">-{parseNumberToDollars(stat)} ({calculatePortfolioReturnPercentage(stat, portfolioValue)}%)</span></p>
    }
}