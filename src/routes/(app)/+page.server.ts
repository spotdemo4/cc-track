import { redirect } from '@sveltejs/kit';
import { getAccounts } from '$lib/db/accounts';
import { getRevenue, getExpenses, getProfit, getTransactions, getTransactionsCount, getCategories, getSubcategories } from '$lib/db/transactions';
import { getWarningLimits } from '$lib/db/warnings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    let start = new Date();
    start.setFullYear(new Date().getFullYear() - 1);
    let end = new Date();

    return {
        stream: {
            revenue: getRevenue(locals.user.id, start, end),
            expenses: getExpenses(locals.user.id, start, end),
            profit: getProfit(locals.user.id, start, end),
            accounts: getAccounts(locals.user.id),
            categories: getCategories(locals.user.id, start, end),
            subcategories: getSubcategories(locals.user.id, start, end),
            transactions: getTransactions(locals.user.id, start, end),
            transactions_count: getTransactionsCount(locals.user.id, start, end),
            warnings: getWarningLimits(locals.user.id)
        }
    };
};