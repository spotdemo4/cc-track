import { db } from '$lib/db';
import { sql } from 'kysely';
import { plaidClient } from '$lib/plaid';
import { getAccounts } from '$lib/db/accounts';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

export async function getRevenue(user_id: number, start: Date, end: Date) {
    const account_ids = (await getAccounts(user_id)).map((account) => account.id);
    if (account_ids.length === 0) {
        return [];
    }

    return await db.selectFrom('transactions')
        .select(({ fn }) => [
            sql<Date>`DATE_TRUNC('month', date)`.as('month'),
            fn.sum('amount').as('amount')
        ])
        .where('account_id', 'in', account_ids)
        .where('amount', '<', '0')
        .where('date', '>=', start)
        .where('date', '<=', end)
        .where('category_primary', '!=', 'LOAN_PAYMENTS')
        .groupBy(sql`DATE_TRUNC('month', date)`)
        .orderBy('month', 'asc')
        .execute();
}

export async function getExpenses(user_id: number, start: Date, end: Date) {
    const account_ids = (await getAccounts(user_id)).map((account) => account.id);
    if (account_ids.length === 0) {
        return [];
    }

    return await db.selectFrom('transactions')
        .select(({ fn }) => [
            sql<Date>`DATE_TRUNC('month', date)`.as('month'),
            fn.sum('amount').as('amount')
        ])
        .where('account_id', 'in', account_ids)
        .where('amount', '>', '0')
        .where('date', '>=', start)
        .where('date', '<=', end)
        .where('category_primary', '!=', 'LOAN_PAYMENTS')
        .groupBy(sql`DATE_TRUNC('month', date)`)
        .orderBy('month', 'asc')
        .execute();
}

export async function getProfit(user_id: number, start: Date, end: Date) {
    const revenue = await getRevenue(user_id, start, end);
    const expenses = await getExpenses(user_id, start, end);

    const length = Math.max(revenue.length, expenses.length);

    let profit = [];
    for (let i = 0; i < length; i++) {
        const month = revenue[i]?.month ?? expenses[i]?.month;
        const amount = (Number(revenue[i]?.amount ?? 0)) + (Number(expenses[i]?.amount ?? 0));
        profit.push({
            month: month,
            amount: amount
        });
    }

    return profit;
}


export async function getCategories(user_id: number, start: Date, end: Date) {
    const account_ids = (await getAccounts(user_id)).map((account) => account.id);
    if (account_ids.length === 0) {
        return [];
    }

    return await db.selectFrom('transactions')
        .select(({ fn }) => [
            'category_primary',
            fn.sum<number>('amount').as('amount')
        ])
        .where('account_id', 'in', account_ids)
        .where('amount', '>', '0')
        .where('date', '>=', start)
        .where('date', '<=', end)
        .where('category_primary', '!=', 'LOAN_PAYMENTS')
        .groupBy('category_primary')
        .orderBy('amount', 'desc')
        .execute();
}

export async function getSubcategories(user_id: number, start: Date, end: Date) {
    const account_ids = (await getAccounts(user_id)).map((account) => account.id);
    if (account_ids.length === 0) {
        return [];
    }

    return await db.selectFrom('transactions')
        .select(({ fn }) => [
            'category_detailed',
            'category_primary',
            fn.sum<number>('amount').as('amount')
        ])
        .where('account_id', 'in', account_ids)
        .where('amount', '>', '0')
        .where('date', '>=', start)
        .where('date', '<=', end)
        .where('category_primary', '!=', 'LOAN_PAYMENTS')
        .groupBy('category_detailed')
        .groupBy('category_primary')
        .orderBy('amount', 'desc')
        .execute();
}

export async function getTransactions(
    user_id: number,
    start: Date,
    end: Date,
    merchants_filter: string = '',
    accounts_filter: string[] = [],
    categories_filter: string[] = [],
    page_size: number = 10,
    page_current: number = 1
) {
    const account_ids = (await getAccounts(user_id)).map((account) => account.id);
    if (account_ids.length === 0) {
        return [];
    }

    let query = db.selectFrom('transactions')
        .innerJoin('accounts', 'transactions.account_id', 'accounts.id')
        .select((eb) => [
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
            jsonObjectFrom(
                eb.selectFrom('cash_back')
                    .selectAll()
                    .whereRef('cash_back.account_id', '=', 'transactions.account_id')
                    .where((eb) => eb.or([
                        eb('cash_back.start', '<=', eb.ref('transactions.date')),
                        eb('cash_back.start', 'is', null)
                    ]))
                    .where((eb) => eb.or([
                        eb('cash_back.end', '>=', eb.ref('transactions.date')),
                        eb('cash_back.end', 'is', null)
                    ]))
                    .where((eb) => eb.or([
                        eb('cash_back.category', '=', eb.ref('transactions.category_primary')),
                        eb('cash_back.category', '=', eb.ref('transactions.category_detailed'))
                    ]))
            ).as('cash_back')
        ])
        .limit(page_size)
        .offset((page_current - 1) * page_size)
        .orderBy('transactions.date', 'desc')
        .where('transactions.account_id', 'in', account_ids)
        .where('transactions.date', '>=', start)
        .where('transactions.date', '<=', end);

    if (merchants_filter) {
        query = query.where(({ fn }) => fn('lower', ['transactions.merchant_name']), 'like', '%' + merchants_filter.toLowerCase() + '%');
    }

    if (accounts_filter.length > 0) {
        query = query.where('transactions.account_id', 'in', accounts_filter);
    }

    if (categories_filter.length > 0) {
        query = query.where('transactions.category_primary', 'in', categories_filter);
    }

    return await query.execute();
}

export async function getTransactionsCount(user_id: number, start: Date, end: Date, merchants_filter: string = '', accounts_filter: string[] = [], categories_filter: string[] = []) {
    const account_ids = (await getAccounts(user_id)).map((account) => account.id);
    if (account_ids.length === 0) {
        return 1;
    }

    let query = db.selectFrom('transactions')
        .select((eb) => eb.fn.count<number>('transactions.id').as('count'))
        .where('transactions.account_id', 'in', account_ids)
        .where('transactions.date', '>=', start)
        .where('transactions.date', '<=', end);

    if (merchants_filter) {
        query = query.where(({ fn }) => fn('lower', ['transactions.merchant_name']), 'like', '%' + merchants_filter.toLowerCase() + '%');
    }

    if (accounts_filter.length > 0) {
        query = query.where('transactions.account_id', 'in', accounts_filter);
    }

    if (categories_filter.length > 0) {
        query = query.where('transactions.category_primary', 'in', categories_filter);
    }

    let count = await query.executeTakeFirst();

    if (count) {
        return count.count;
    } else {
        return 1;
    }
}

export async function syncTransactions(user_id: number) {
    console.log("Syncing transactions for user " + user_id);
    let tokens = await db.selectFrom('accounts')
        .select(['access_token', 'cursor'])
        .where('user_id', '=', user_id)
        .distinct()
        .execute();

    for (const token of tokens) {
        let hasMore = true;
        let cursor = token.cursor;

        while (hasMore) {
            let response;
            try {
                response = await plaidClient.transactionsSync({
                    access_token: token.access_token,
                    cursor: cursor ?? undefined,
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
                if (!await db.selectFrom('accounts').select('id').where('id', '=', transaction.account_id).executeTakeFirst()) {
                    continue;
                }

                await db.insertInto('transactions')
                    .values({
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
                    }).execute();
            }

            for (let transaction of response.data.modified) {
                await db.updateTable('transactions')
                    .set({
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
                    })
                    .where('id', '=', transaction.transaction_id)
                    .execute();
            }

            for (let transaction of response.data.removed) {
                if (transaction.transaction_id === undefined) {
                    continue;
                }

                await db.deleteFrom('transactions')
                    .where('id', '=', transaction.transaction_id)
                    .execute();
            }

            hasMore = response.data.has_more;
            cursor = response.data.next_cursor;
        }

        await db.updateTable('accounts')
            .set({ cursor: cursor })
            .where('access_token', '=', token.access_token)
            .execute();
    }

    return true;
}