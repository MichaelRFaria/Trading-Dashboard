import Dashboard from '@/src/components/main_section/Dashboard';
import Portfolio from '@/src/components/main_section/Portfolio';
import Watchlist from '@/src/components/main_section/Watchlist';
import Trade from '@/src/components/main_section/Trade';
import History from '@/src/components/main_section/History';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AuthenticatedUser } from '@/src/types/user';
import { WatchlistDataItem } from '@/src/types/watchlist';
import { HoldingsDataItem } from '@/src/types/trade';
import {
  FinnhubPriceChangesDataItem,
  FinnhubPriceLookupRequest,
  FinnhubPriceLookupResponse,
  GainsResponse,
  HoldingsPrice,
} from '@/src/types/stock';
import {
  finnhubPriceQuote,
  getAccounts,
  getCurrentUser,
  getGains,
  getHistory,
  getHoldingsData,
  getPriceChanges,
  getWatchlistData,
} from '@/src/helper/api';
import { DashboardActiveSection } from '@/src/types/misc';
import { HistoryDataItem, HistoryRequest } from '@/src/types/history';
import { useNotification } from '@/src/components/common/NotificationProvider';
import Settings from '@/src/components/main_section/Settings';
import { AccountsListItem } from '@/src/types/account';

export default function DashboardPageBody({
  activeSection,
}: {
  activeSection: DashboardActiveSection;
}) {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    {
      sub: 0,
      email: '',
      exp: 0,
      iat: 0,
    },
  );

  const [watchlistData, setWatchlistData] = useState<WatchlistDataItem[]>([]);
  const [holdingsData, setHoldingsData] = useState<HoldingsDataItem[]>([]);
  const [priceChangesData, setPriceChangesData] = useState<
    FinnhubPriceChangesDataItem[]
  >([]);
  const [holdingsPriceData, setHoldingsPriceData] = useState<HoldingsPrice>({});
  const [historyData, setHistoryData] = useState<HistoryDataItem[]>([]);
  const [gains, setGains] = useState<GainsResponse>({
    lifetime_realised_gains: 0,
    lifetime_unrealised_gains: 0,
    todays_realised_gains: 0,
    todays_unrealised_gains: 0,
  });
  const [accountsData, setAccountsData] = useState<AccountsListItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // check if the user is authenticated
  useEffect(() => {
    getCurrentUser().then((user) => {
      console.log('user', user);
      if (user && 'sub' in user) {
        // console.log("user response below")
        setAuthenticatedUser(user);
      } else {
        showNotification('You are not authenticated, please login in.');
        router.push('/home');
      }
    });
  }, [router]);

  const fetchDashboardData = useCallback(async () => {
    console.log('fetching');
    setIsLoading(true);
    try {
      const [watchlist, holdings, priceChanges, history, gainsData, accounts] =
        await Promise.all([
          getWatchlistData(),
          getHoldingsData(),
          getPriceChanges(),
          getHistory({}),
          getGains(),
          getAccounts(),
        ]);

      if (watchlist && 'data' in watchlist) setWatchlistData(watchlist.data);
      if (holdings && 'data' in holdings) setHoldingsData(holdings.data);
      if (priceChanges && 'data' in priceChanges)
        setPriceChangesData(priceChanges.data);
      if (history && 'data' in history) setHistoryData(history.data);
      if (gainsData) setGains(gainsData);
      if (accounts && 'data' in accounts) setAccountsData(accounts.data);
    } catch (error) {
      console.error('Error when fetching dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (request: HistoryRequest) => {
    const history = await getHistory(request);

    console.log('history: ', history);

    if (history && 'data' in history) setHistoryData(history.data);
  }, []);

  // once user has been authenticated, fetch dashboard data
  useEffect(() => {
    if (authenticatedUser.sub !== 0) {
      fetchDashboardData();
    }
  }, [authenticatedUser, fetchDashboardData]);

  useEffect(() => {
    // if holdingsData is empty, then we cannot get the price of each holding
    if (holdingsData.length === 0) return;

    const getHoldingsPricesAsync = async () => {
      console.log('getting price of holdings');
      const prices = await Promise.all(
        holdingsData.map(async (holding: HoldingsDataItem) => {
          const request: FinnhubPriceLookupRequest = {
            stock_symbol: holding.stock_symbol,
          };

          const response: FinnhubPriceLookupResponse | null =
            await finnhubPriceQuote(request);

          let price: number;

          if (response && 'current' in response) {
            price = response.current;
          } else {
            // response is null or service threw NotFoundException
            price = 0;
          }

          // console.log("holding data: " + holding)
          // console.log("price: " + price)

          return [holding.stock_symbol!, price] as const;
        }),
      );

      setHoldingsPriceData(Object.fromEntries(prices));
    };

    getHoldingsPricesAsync();
  }, [holdingsData]);

  if (isLoading) return <p>Loading...</p>;

  switch (activeSection) {
    case 'dashboard':
      return (
        <Dashboard
          holdingsData={holdingsData}
          holdingsPriceData={holdingsPriceData}
          gains={gains}
          accountsData={accountsData}
        />
      );
    case 'portfolio':
      return (
        <Portfolio
          holdingsData={holdingsData}
          holdingsPriceData={holdingsPriceData}
          priceChangesData={priceChangesData}
        />
      );
    case 'watchlist':
      return (
        <Watchlist
          watchlistData={watchlistData}
          getWatchlistDataAsync={fetchDashboardData}
        />
      );
    case 'trade':
      return (
        <Trade
          holdingsData={holdingsData}
          getHoldingsDataAsync={fetchDashboardData}
        />
      );
    case 'history':
      return <History historyData={historyData} fetchHistory={fetchHistory} />;
    case 'settings':
      return <Settings />;
    default:
      return (
        <Dashboard
          holdingsData={holdingsData}
          holdingsPriceData={holdingsPriceData}
          gains={gains}
          accountsData={accountsData}
        />
      );
  }
}
