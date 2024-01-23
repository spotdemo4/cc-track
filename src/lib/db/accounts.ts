import { db } from '$lib/db';
import { plaidClient } from '$lib/plaid';
import type { Account } from '$lib/types';

export async function getBalance(user_id: number) {
    let accounts_db = await db
        .select('balance_available')
        .from('accounts')
        .where('user_id', user_id)
        .andWhere('type', 'depository');

    let balance = 0;
    for (let account of accounts_db) {
        if (account.balance_available) {
            balance += Number(account.balance_available);
        }
    }

    return balance;
}

export async function getDebt(user_id: number) {
    let accounts_db = await db
        .select('balance_current')
        .from('accounts')
        .where('user_id', user_id)
        .andWhere('type', 'credit');

    let debt = 0;
    for (let account of accounts_db) {
        if (account.balance_current) {
            debt += Number(account.balance_current);
        }
    }

    return debt * -1;
}

export async function getNetWorth(user_id: number) {
    let balance = await getBalance(user_id);
    let debt = await getDebt(user_id);

    return balance + debt;
}

export async function getAccount(account_id: string) {
    let account_db = await db
        .select(
            'id', 
            'name', 
            'mask', 
            'official_name', 
            'type', 
            'subtype', 
            'institution', 
            'balance_available', 
            'balance_current', 
            'balance_limit', 
            'balance_currency_code', 
            'created_at')
        .from('accounts')
        .where('id', account_id)
        .first();
    
    let account: Account = {
        id: account_db.id,
        name: account_db.name,
        mask: account_db.mask,
        official_name: account_db.official_name,
        type: account_db.type,
        subtype: account_db.subtype,
        institution: account_db.institution,
        balance_available: account_db.balance_available ? Number(account_db.balance_available) : undefined,
        balance_current: account_db.balance_current ? Number(account_db.balance_current) : undefined,
        balance_limit: account_db.balance_limit ? Number(account_db.balance_limit) : undefined,
        balance_currency_code: account_db.balance_currency_code,
        created_at: account_db.created_at,
    };

    return account;
}

export async function getAccounts(user_id: number) {
    let accounts_db = await db
        .select(
            'id', 
            'name', 
            'mask', 
            'official_name', 
            'type', 
            'subtype', 
            'institution', 
            'balance_available', 
            'balance_current', 
            'balance_limit', 
            'balance_currency_code', 
            'created_at')
        .from('accounts')
        .where('user_id', user_id)
        .orderBy('created_at', 'desc');
    
    let accounts: Account[] = accounts_db.map((account) => {
        return {
            id: account.id,
            name: account.name,
            mask: account.mask,
            official_name: account.official_name,
            type: account.type,
            subtype: account.subtype,
            institution: account.institution,
            balance_available: account.balance_available ? Number(account.balance_available) : undefined,
            balance_current: account.balance_current ? Number(account.balance_current) : undefined,
            balance_limit: account.balance_limit ? Number(account.balance_limit) : undefined,
            balance_currency_code: account.balance_currency_code,
            created_at: account.created_at,
        }
    });

    return accounts;
}

export async function syncAccounts(user_id: number) {
    console.log("Syncing accounts for user " + user_id);
    let accounts = await db.select('id', 'name', 'mask', 'official_name', 'type', 'subtype', 'institution', 'access_token', 'created_at').from('accounts').where('user_id', user_id);

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

        let account_data = response.data.accounts.at(0);

        await db('accounts').update({
            official_name: account.official_name ?? account_data?.official_name,
            balance_available: account_data?.balances.available,
            balance_current: account_data?.balances.current,
            balance_limit: account_data?.balances.limit,
            balance_currency_code: account_data?.balances.iso_currency_code ?? account.details.balances.unofficial_currency_code,
        }).where('id', account.id);
    }

    return true;
}