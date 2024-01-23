import { db } from '$lib/db';
import { plaidClient } from '$lib/plaid';
import { getCashBack } from '$lib/db/cash_back';
import type { Transaction } from '$lib/types';
import type { CashBack } from '$lib/types';

function formatCategory(category: string) {
    return category.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export async function getRevenue(user_id: number, start: Date, end: Date) {
    let accounts = await db.select('id').from('accounts').where('user_id', user_id);
    accounts = accounts.map((account) => account.id);
    let transactions: any = await db.select(db.raw('SUM(amount) as revenue')).from('transactions').whereIn('account_id', accounts).andWhere('amount', '<', 0).andWhereBetween('date', [start, end]).first();
    return transactions.revenue * -1;
}

export async function getExpenses(user_id: number, start: Date, end: Date) {
    let accounts = await db.select('id').from('accounts').where('user_id', user_id);
    accounts = accounts.map((account) => account.id);
    let transactions: any = await db.select(db.raw('SUM(amount) as expenses')).from('transactions').whereIn('account_id', accounts).andWhere('amount', '>', 0).andWhereBetween('date', [start, end]).first();
    return transactions.expenses * -1;
}

export async function getProfit(user_id: number, start: Date, end: Date) {
    let accounts = await db.select('id').from('accounts').where('user_id', user_id);
    accounts = accounts.map((account) => account.id);
    let transactions: any = await db.select(db.raw('SUM(amount) as profit')).from('transactions').whereIn('account_id', accounts).andWhereBetween('date', [start, end]).first();
    return transactions.profit * -1;
}

export async function getCategories(user_id: number, start: Date, end: Date) {
    let accounts = await db.select('id').from('accounts').where('user_id', user_id);
    accounts = accounts.map((account) => account.id);
    let categories_db = await db
        .select('category_primary', db.raw('SUM(amount) as amount'))
        .from('transactions')
        .whereIn('account_id', accounts)
        .andWhereBetween('date', [start, end])
        .groupBy('category_primary')
        .orderBy('amount', 'desc');

    let categories: { name: string, real_name: string, amount: number }[] = categories_db.map((category) => {
        return {
            name: formatCategory(category.category_primary),
            real_name: category.category_primary,
            amount: Number(category.amount) * -1
        }
    });

    return categories;
}

export async function getTransactions(user_id: number, start: Date, end: Date, merchants_filter: string = '', accounts_filter: string[] = [], categories_filter: string[] = [], page_size: number = 10, page_current: number = 1) {
    let accounts = await db.select('id').from('accounts').where('user_id', user_id);
    accounts = accounts.map((account) => account.id);
    let transactions_query = db
        .select(
            'transactions.id',
            'transactions.account_id',
            'transactions.name',
            'transactions.merchant_name',
            'transactions.currency_code',
            'transactions.category_primary',
            'transactions.category_detailed',
            'transactions.category_confidence',
            'transactions.category_icon',
            'transactions.amount',
            'transactions.date',
            'transactions.authorized_date',
            'transactions.created_at',
            'accounts.name as account_name',
        )
        .from('transactions')
        .leftJoin('accounts', (e) => {
            e.on('accounts.id', '=', 'transactions.account_id')
        })
        .limit(page_size)
        .offset((page_current - 1) * page_size)
        .orderBy('date', 'desc')
        .whereIn('account_id', accounts)
        .andWhereBetween('date', [start, end]);

    if (merchants_filter) {
        transactions_query = transactions_query.andWhereLike('transactions.merchant_name', '%' + merchants_filter + '%');
    }

    if (accounts_filter.length > 0) {
        transactions_query = transactions_query.whereIn('account_id', accounts_filter);
    }

    if (categories_filter.length > 0) {
        transactions_query = transactions_query.whereIn('category_primary', categories_filter);
    }

    let transactions_db = await transactions_query;

    let transactions: Transaction[] = await Promise.all(transactions_db.map(async (transaction) => {
        const cash_back: CashBack | undefined = await getCashBack(transaction.account_id, transaction.category_primary, transaction.category_detailed, transaction.date);
        return {
            id: transaction.id,
            account_name: transaction.account_name,
            account_id: transaction.account_id,
            name: transaction.name,
            merchant_name: transaction.merchant_name,
            currency_code: transaction.currency_code,
            category_primary: formatCategory(transaction.category_primary),
            category_detailed: formatCategory(transaction.category_detailed.replace(transaction.category_primary + '_', '')),
            category_confidence: transaction.category_confidence,
            category_icon: transaction.category_icon,
            amount: Number(transaction.amount) * -1,
            date: transaction.date,
            authorized_date: transaction.authorized_date,
            created_at: transaction.created_at,
            cash_back: cash_back,
        }
    }));

    return transactions;
}

export async function getTransactionsCount(user_id: number, start: Date, end: Date, merchants_filter: string = '', accounts_filter: string[] = [], categories_filter: string[] = []) {
    let accounts = await db.select('id').from('accounts').where('user_id', user_id);
    accounts = accounts.map((account) => account.id);
    let transactions_query = db
        .count('* as count')
        .from('transactions')
        .leftJoin('accounts', (e) => {
            e.on('accounts.id', '=', 'transactions.account_id')
        })
        .whereIn('account_id', accounts)
        .andWhereBetween('date', [start, end]);

    if (merchants_filter) {
        transactions_query = transactions_query.andWhereLike('transactions.merchant_name', '%' + merchants_filter + '%');
    }

    if (accounts_filter.length > 0) {
        transactions_query = transactions_query.whereIn('account_id', accounts_filter);
    }

    if (categories_filter.length > 0) {
        transactions_query = transactions_query.whereIn('category_primary', categories_filter);
    }

    let transactions_db = await transactions_query.first();

    return typeof transactions_db?.count == 'string' ? parseInt(transactions_db.count) : transactions_db?.count ?? 0;
}

export async function syncTransactions(user_id: number) {
    console.log("Syncing transactions for user " + user_id);
    let tokens: { access_token: string, cursor: string }[] = await db.select('access_token', 'cursor').from('accounts').where('user_id', user_id).distinct('access_token');

    for (let token of tokens) {
        let hasMore = true;
        let cursor = token.cursor;

        while (hasMore) {
            let response;
            try {
                response = await plaidClient.transactionsSync({
                    access_token: token.access_token,
                    cursor: cursor,
                });
            } catch (err: any) {
                if (err.response.data.error_code === 'TRANSACTIONS_SYNC_LIMIT') {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    continue;
                } else {
                    return false;
                }
            }

            for (let transaction of response.data.added) {
                if (!await db.select('id').from('accounts').where('id', transaction.account_id).first()) {
                    continue;
                }

                await db('transactions').insert({
                    id: transaction.transaction_id,
                    account_id: transaction.account_id,
                    name: transaction.name,
                    merchant_name: transaction.merchant_name,
                    currency_code: transaction.iso_currency_code ?? transaction.unofficial_currency_code,
                    category_primary: transaction.personal_finance_category?.primary,
                    category_detailed: transaction.personal_finance_category?.detailed,
                    category_confidence: transaction.personal_finance_category?.confidence_level,
                    category_icon: transaction.personal_finance_category_icon_url,
                    amount: transaction.amount,
                    date: transaction.datetime ?? transaction.date,
                    authorized_date: transaction.authorized_datetime ?? transaction.authorized_date,
                });
            }

            for (let transaction of response.data.modified) {
                await db('transactions').update({
                    name: transaction.name,
                    merchant_name: transaction.merchant_name,
                    currency_code: transaction.iso_currency_code ?? transaction.unofficial_currency_code,
                    category_primary: transaction.personal_finance_category?.primary,
                    category_detailed: transaction.personal_finance_category?.detailed,
                    category_confidence: transaction.personal_finance_category?.confidence_level,
                    category_icon: transaction.personal_finance_category_icon_url,
                    amount: transaction.amount,
                    date: transaction.datetime ?? transaction.date,
                    authorized_date: transaction.authorized_datetime ?? transaction.authorized_date,
                }).where('id', transaction.transaction_id);
            }

            for (let transaction of response.data.removed) {
                await db('transactions').delete().where('id', transaction.transaction_id);
            }

            hasMore = response.data.has_more;
            cursor = response.data.next_cursor;
        }

        await db('accounts').update({ cursor }).where('access_token', token.access_token);
    }

    return true;
}