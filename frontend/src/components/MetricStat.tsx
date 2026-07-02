import {parseNumberToDollars} from "@/src/helper/format";

export default function MetricStat({text, stat}) {
    if (stat > 0) {
        return <p>{text}<span className="text-green-600">{parseNumberToDollars(stat)}</span></p>
    } else {
        return <p>{text}<span className="text-red-600">{parseNumberToDollars(stat)}</span></p>
    }
}