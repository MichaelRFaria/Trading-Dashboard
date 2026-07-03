export function calculatePortfolioReturnPercentage(gain: number, portfolioValue: number) {
    return ((gain / portfolioValue) * 100).toFixed(2)
}