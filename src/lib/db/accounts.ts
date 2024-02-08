import { db } from '$lib/db';
import { getTotal } from '$lib/db/transactions';
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
        .orderBy('name', 'asc')
        .execute();
}

export async function getAccountsWithTotals(user_id: number) {
    const accounts = await getAccounts(user_id);

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