import { GainsResponse, HoldingValue } from '@/src/types/stock';
import { parseNumberToDollars } from '@/src/helper/format';
import MetricStat from '@/src/components/portfolio/MetricStat';
import { AccountsListItem } from '@/src/types/account';
import { HoldingsDataItem, HoldingsPricesData } from '@/src/types/holding';

export default function Metrics({
  holdingsData,
  holdingsPriceData,
  gains,
  accountsData,
}: {
  holdingsData: HoldingsDataItem[];
  holdingsPriceData: HoldingsPricesData;
  gains: GainsResponse;
  accountsData: AccountsListItem[];
}) {
  if (holdingsData.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-400 shadow-xl shadow-black/20">
        Add some holdings to your portfolio to view your metrics.
      </section>
    );
  }

  const totalPortfolioValue =
    holdingsData.reduce((sum: number, holding: HoldingsDataItem) => {
      const price = holdingsPriceData[holding.stock_symbol].current;

      return sum + holding.quantity * price;
    }, 0) +
    accountsData.reduce((sum: number, account: AccountsListItem) => {
      return sum + Number(account.balance); // Prisma decimal is serialised as String so it must be converted
    }, 0);

  const largestPosition = holdingsData.reduce<HoldingValue>(
    (largest: HoldingValue, holding: HoldingsDataItem) => {
      const price = holdingsPriceData[holding.stock_symbol].current;

      const holdingValue = holding.quantity * price;

      if (largest.value < holdingValue) {
        return {
          stock_symbol: holding.stock_symbol,
          value: holdingValue,
        };
      } else {
        return largest;
      }
    },
    {
      stock_symbol: '',
      value: 0,
    },
  );

  const lifetimeCombinedGains =
    gains.lifetime_unrealised_gains + gains.lifetime_realised_gains;
  const todaysCombinedGains =
    gains.todays_unrealised_gains + gains.todays_realised_gains;

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-100">
          Portfolio metrics
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Performance and position summary
        </p>
      </div>
      <div className="overflow-x-auto px-5 py-2">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-white/5">
            <MetricStat
              text="Portfolio value"
              stat={totalPortfolioValue}
              format="currency"
            />
            <MetricStat
              text="Today's gain/loss (combined)"
              stat={todaysCombinedGains}
              format="gain"
            />
            <MetricStat
              text="Today's gain/loss (realised)"
              stat={gains.todays_realised_gains}
              format="gain"
            />
            <MetricStat
              text="Today's gain/loss (unrealised)"
              stat={gains.todays_unrealised_gains}
              format="gain"
            />
            <MetricStat
              text="Lifetime gain/loss (combined)"
              stat={lifetimeCombinedGains}
              format="gain"
            />
            <MetricStat
              text="Lifetime gain/loss (realised)"
              stat={gains.lifetime_realised_gains}
              format="gain"
            />
            <MetricStat
              text="Lifetime gain/loss (unrealised)"
              stat={gains.lifetime_unrealised_gains}
              format="gainWithPercentage"
              portfolioValue={totalPortfolioValue}
            />
            <MetricStat
              text="Largest position"
              stat={`${parseNumberToDollars(largestPosition.value)} of ${largestPosition.stock_symbol}`}
              format="text"
            />
            <MetricStat
              text="Number of holdings"
              stat={holdingsData.length}
              format="text"
            />
          </tbody>
        </table>
      </div>
    </section>
  );
}
