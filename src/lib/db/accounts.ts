import { db } from '$lib/db';
import { plaidClient } from '$lib/plaid';

export async function getBalance(user_id: number) {
    const accounts = await db.selectFrom('accounts')
        .select('balance_available')
        .where('user_id', '=', user_id)
        .where('type', '=', 'depository')
        .execute();

    let balance = 0;
    for (let account of accounts) {
        if (account.balance_available) {
            balance += Number(account.balance_available);
        }
    }

    return balance;
}

export async function getDebt(user_id: number) {
    const accounts = await db.selectFrom('accounts')
        .select('balance_current')
        .where('user_id', '=', user_id)
        .where('type', '=', 'credit')
        .execute();

    let debt = 0;
    for (let account of accounts) {
        if (account.balance_current) {
            debt += Number(account.balance_current);
        }
    }

    return debt * -1;
}

export async function getNetWorth(user_id: number) {
    return await getBalance(user_id) + await getDebt(user_id);
}

export async function getAccount(id: string) {
    return await db.selectFrom('accounts')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
}

export async function getAccounts(user_id: number) {
    return await db.selectFrom('accounts')
        .selectAll()
        .where('user_id', '=', user_id)
        .execute();
}

export async function getAccountsWithTotals(user_id: number) {
    let accounts_db = db.selectFrom('accounts')
        .selectAll()
        .where('user_id', '=', user_id)
        .execute();
    
    const accounts = await accounts_db;

    let n_accounts = [];
    for (let account of accounts) {
        let naccount: typeof account & { total: number | undefined } = { ...account, total: undefined };
        if (naccount.limit_timeframe) {
            const total = await getTotal(account.id, naccount.limit_timeframe);
            naccount.total = total ? total.amount : 0;
        }
        
        n_accounts.push(naccount);
    }

    return n_accounts;
}

export async function syncAccounts(user_id: number) {
    console.log("Syncing accounts for user " + user_id);
    let accounts = await db.selectFrom('accounts')
        .selectAll()
        .where('user_id', '=', user_id)
        .execute();

    for (let account of accounts) {
        let response;
        try {
            response = await plaidClient.accountsGet({
                access_token: account.access_token,
                options: {
                    account_ids: [account.id],
                }
            });
        } catch (err: any) {
            return false;
        }

        const account_data = response.data.accounts.at(0);

        await db.updateTable('accounts')
            .set({
                official_name: account.official_name ?? account_data?.official_name,
                balance_available: account_data?.balances.available,
                balance_current: account_data?.balances.current,
                balance_limit: account_data?.balances.limit,
                balance_currency_code: account_data?.balances.iso_currency_code ?? account_data?.balances.unofficial_currency_code,
            })
            .where('id', '=', account.id)
            .execute();
    }

    return true;
}

export async function getTotal(account_id: string, timeframe: string) {
    let query = db.selectFrom('transactions')
        .select(({ fn }) => [
            fn.sum<number>('amount').as('amount')
        ])
        .where('account_id', '=', account_id)
        .where('amount', '>', '0')
        .groupBy('account_id');

    const date = new Date();
    if (timeframe === 'month') {
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        query = query
            .where('date', '>=', firstDay)
            .where('date', '<=', lastDay);
    } else if (timeframe === 'year') {
        let firstDay = new Date(date.getFullYear(), 0, 1);
        let lastDay = new Date(date.getFullYear(), 11, 31);
        console.log(firstDay);
        console.log(lastDay);
        query = query
            .where('date', '>=', firstDay)
            .where('date', '<=', lastDay);
    } else if (timeframe === 'quarter') {
        let firstDay = new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
        let lastDay = new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3 + 3, 0);
        console.log(firstDay);
        console.log(lastDay);
        query = query
            .where('date', '>=', firstDay)
            .where('date', '<=', lastDay);
    }

    return await query.executeTakeFirst();
}