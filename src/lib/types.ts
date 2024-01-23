export type User = {
    id: number;
    email: string;
    password: string;
    name: string;
    created_at: Date;
};

export type Account = { 
    id: string, 
    name: string, 
    mask?: string, 
    official_name?: string,
    type: string, 
    subtype: string,
    institution: string,
    balance_available?: number,
    balance_current?: number,
    balance_limit?: number,
    balance_currency_code?: string,
    created_at: Date,
}

export type Transaction = {
    id: string;
    account_name: string;
    account_id: string;
    name: string;
    merchant_name?: string;
    currency_code?: string;
    category_primary?: string;
    category_detailed?: string;
    category_confidence?: string;
    category_icon?: string;
    amount: number;
    date: Date;
    authorized_date?: Date;
    created_at: Date;
    cash_back?: CashBack;
}

export type CashBack = {
    id: number;
    account_id: string;
    category: string;
    percentage: number;
    start?: Date;
    end?: Date;
    created_at: Date;
}