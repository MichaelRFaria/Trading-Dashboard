import { GainsResponse, HoldingsPrice, HoldingValue } from '@/src/types/stock';
import { parseNumberToDollars } from '@/src/helper/format';
import MetricStat from '@/src/components/portfolio/MetricStat';
import { HoldingsDataItem } from '@/src/types/trade';
import { AccountsListItem } from '@/src/types/account';

export default function Metrics({
  holdingsData,
  holdingsPriceData,
  gains,
  accountsData,
}: {
  holdingsData: HoldingsDataItem[];
  holdingsPriceData: HoldingsPrice;
  gains: GainsResponse;
  accountsData: AccountsListItem[];
}) {
  if (holdingsData.length === 0) {
    return <p>Add some holdings to your portfolio to view your metrics!</p>;
  }

  const totalPortfolioValue =
    holdingsData.reduce((sum: number, holding: HoldingsDataItem) => {
      const price = holdingsPriceData[holding.stock_symbol] ?? 0;

      return sum + holding.quantity * price;
    }, 0) +
    accountsData.reduce((sum: number, account: AccountsListItem) => {
      return sum + Number(account.balance); // Prisma decimal is serialised as String so it must be converted
    }, 0);

  const largestPosition = holdingsData.reduce<HoldingValue>(
    (largest: HoldingValue, holding: HoldingsDataItem) => {
      const holdingValue =
        holding.quantity * (holdingsPriceData[holding.stock_symbol] ?? 0);

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
    <table>
      <tbody>
        <MetricStat
          text={'Portfolio Value:'}
          stat={totalPortfolioValue}
          format="currency"
        />
        <MetricStat
          text={`Today's Gain/Loss (combined):`}
          stat={todaysCombinedGains}
          format="gain"
        />
        <MetricStat
          text={`Today's Gain/Loss (realised):`}
          stat={gains.todays_realised_gains}
          format="gain"
        />
        <MetricStat
          text={`Today's Gain/Loss (unrealised):`}
          stat={gains.todays_unrealised_gains}
          format="gain"
        />
        <MetricStat
          text={'Lifetime Gain/Loss (combined):'}
          stat={lifetimeCombinedGains}
          format="gain"
        />
        <MetricStat
          text={'Lifetime Gain/Loss (realised):'}
          stat={gains.lifetime_realised_gains}
          format="gain"
        />
        <MetricStat
          text={'Lifetime Gain/Loss (unrealised):'}
          stat={gains.lifetime_unrealised_gains}
          format="gainWithPercentage"
          portfolioValue={totalPortfolioValue}
        />
        <MetricStat
          text={'Largest Position:'}
          stat={
            parseNumberToDollars(largestPosition.value) +
            ' of ' +
            largestPosition.stock_symbol
          }
          format="text"
        />
        <MetricStat
          text={'Number of Holdings:'}
          stat={holdingsData.length}
          format="text"
        />
      </tbody>
    </table>
  );
}
