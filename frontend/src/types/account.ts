export type AccountsResponse = {
  data: AccountsListItem[];
};

export type AccountsListItem = {
  id: number;
  user_id: number;
  balance: number;
  selected: boolean;
};

export type BalanceUpdateRequest = {
  amount: number;
};

export type BalanceUpdateResponse = {
  message: string;
};
