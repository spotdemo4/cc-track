import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Accounts {
  access_token: string;
  balance_available: Numeric | null;
  balance_currency_code: string | null;
  balance_current: Numeric | null;
  balance_limit: Numeric | null;
  created_at: Generated<Timestamp | null>;
  cursor: string | null;
  funding_account_id: string | null;
  id: string;
  institution: string;
  limit: Numeric | null;
  limit_timeframe: string | null;
  mask: string | null;
  name: string;
  official_name: string | null;
  subtype: string | null;
  type: string;
  user_id: number;
}

export interface Authenticator {
  counter: Int8;
  credentialBackedUp: boolean;
  credentialDeviceType: string;
  credentialID: string;
  credentialPublicKey: Buffer;
  transports: string | null;
  user_id: number;
}

export interface CashBack {
  account_id: string;
  category: string;
  created_at: Generated<Timestamp | null>;
  end: Timestamp | null;
  id: Generated<number>;
  percentage: Numeric;
  start: Timestamp | null;
}

export interface Transactions {
  account_id: string;
  amount: Numeric;
  authorized_date: Timestamp | null;
  category_confidence: string | null;
  category_detailed: string | null;
  category_icon: string | null;
  category_primary: string | null;
  created_at: Generated<Timestamp | null>;
  currency_code: string | null;
  date: Timestamp;
  id: string;
  merchant_name: string | null;
  name: string;
}

export interface Users {
  created_at: Generated<Timestamp | null>;
  currentChallenge: string | null;
  email: string;
  id: Generated<number>;
  name: string;
  password: string;
}

export interface DB {
  accounts: Accounts;
  authenticator: Authenticator;
  cash_back: CashBack;
  transactions: Transactions;
  users: Users;
}
