import { redirect } from '@sveltejs/kit';
import { getAccounts, getBalance, getDebt, getNetWorth } from '$lib/db/accounts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    return {
        stream: {
            accounts: getAccounts(locals.user.id),
            balance: getBalance(locals.user.id),
            debt: getDebt(locals.user.id),
            net_worth: getNetWorth(locals.user.id),
        },
    };
};