import { redirect } from '@sveltejs/kit';
import { getAccounts } from '$lib/db/accounts';
import { getRevenue, getExpenses, getProfit, getTransactions, getTransactionsCount, getCategories } from '$lib/db/transactions';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    let start = new Date(url.searchParams.get('start') ?? new Date().setFullYear(new Date().getFullYear() - 1));
    let end = new Date(url.searchParams.get('end') ?? new Date());
    let merchants_filter = url.searchParams.get('merchants') ?? '';
    let accounts_filter = url.searchParams.get('accounts')?.split(',') ?? [];
    let categories_filter = url.searchParams.get('categories')?.split(',') ?? [];
    let page_size = parseInt(url.searchParams.get('page_size') ?? '10');
    let page_current = parseInt(url.searchParams.get('page_current') ?? '1');

    return {
        card_stream: {
            revenue: getRevenue(locals.user.id, start, end),
            expenses: getExpenses(locals.user.id, start, end),
            profit: getProfit(locals.user.id, start, end),
        },
        filter_stream: {
            accounts: getAccounts(locals.user.id),
            categories: getCategories(locals.user.id, start, end),
        },
        table_stream: {
            transactions: getTransactions(locals.user.id, start, end, merchants_filter, accounts_filter, categories_filter, page_size, page_current),
            transactions_count: getTransactionsCount(locals.user.id, start, end, merchants_filter, accounts_filter, categories_filter),
        }
    };
};