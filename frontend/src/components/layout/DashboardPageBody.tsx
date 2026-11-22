import Dashboard from '@/src/components/main_section/Dashboard';
import Portfolio from '@/src/components/main_section/Portfolio';
import Watchlist from '@/src/components/main_section/Watchlist';
import Trade from '@/src/components/main_section/Trade';
import History from '@/src/components/main_section/History';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AuthenticatedUser } from '@/src/types/user';
import { WatchlistDataItem, WatchlistPricesData } from '@/src/types/watchlist';
import { GainsResponse } from '@/src/types/stock';
import {
  getAccounts,
  getCurrentUser,
  getGains,
  getHistory,
  getHoldingsData,
  getHoldingsPrices,
  getWatchlistData,
  getWatchlistPrices,
} from '@/src/helper/api';
import { DashboardActiveSection } from '@/src/types/misc';
import { HistoryDataItem, HistoryRequest } from '@/src/types/history';
import { useNotification } from '@/src/components/common/NotificationProvider';
import Settings from '@/src/components/main_section/Settings';
import { AccountsListItem } from '@/src/types/account';
import { HoldingsDataItem, HoldingsPricesData } from '@/src/types/holding';

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
  const [watchlistPricesData, setWatchlistPricesData] =
    useState<WatchlistPricesData>({});
  const [holdingsData, setHoldingsData] = useState<HoldingsDataItem[]>([]);
  const [holdingsPricesData, setHoldingsPricesData] =
    useState<HoldingsPricesData>({});
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
  }, [router, showNotification]);

  const fetchDashboardData = useCallback(async () => {
    console.log('fetching');
    setIsLoading(true);
    try {
      const [
        watchlist,
        watchlistPrices,
        holdings,
        holdingsPrices,
        history,
        gainsData,
        accounts,
      ] = await Promise.all([
        getWatchlistData(),
        getWatchlistPrices(),
        getHoldingsData(),
        getHoldingsPrices(),
        getHistory({}),
        getGains(),
        getAccounts(),
      ]);

      if (watchlist && 'data' in watchlist) setWatchlistData(watchlist.data);
      if (watchlistPrices && 'data' in watchlistPrices)
        setWatchlistPricesData(watchlistPrices.data);
      if (holdings && 'data' in holdings) setHoldingsData(holdings.data);
      if (holdingsPrices && 'data' in holdingsPrices)
        setHoldingsPricesData(holdingsPrices.data);
      if (history && 'data' in history) setHistoryData(history.data);
      if (gainsData) setGains(gainsData);
      if (accounts && 'data' in accounts) setAccountsData(accounts.data);
    } catch (error) {
      console.error('Error when fetching dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // method to refetch history when filtering the trade history
  const fetchHistory = useCallback(
    async (request: HistoryRequest) => {
      const history = await getHistory(request);

      console.log('history: ', history);

      if (history) {
        if ('data' in history) setHistoryData(history.data);
        else if ('statusCode' in history && history.statusCode) {
          showNotification('No trades found with the current filters applied.');
        }
      }
    },
    [showNotification],
  );

  // once user has been authenticated, fetch dashboard data
  useEffect(() => {
    if (authenticatedUser.sub !== 0) {
      fetchDashboardData();
    }
  }, [authenticatedUser, fetchDashboardData]);

  if (isLoading) return <p>Loading...</p>;

  switch (activeSection) {
    case 'dashboard':
      return (
        <Dashboard
          holdingsData={holdingsData}
          priceData={holdingsPricesData}
          gains={gains}
          accountsData={accountsData}
        />
      );
    case 'portfolio':
      return (
        <Portfolio holdingsData={holdingsData} priceData={holdingsPricesData} />
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
          priceData={holdingsPricesData}
          gains={gains}
          accountsData={accountsData}
        />
      );
  }
}
