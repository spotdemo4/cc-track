import { json } from '@sveltejs/kit';
import { syncTransactions } from '$lib/db/transactions';
import { syncAccounts } from '$lib/db/accounts';
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ sync_transaction_success: false, sync_account_success: false });
	}

	let sync_account_success = await syncAccounts(locals.user.id);
	let sync_transaction_success = await syncTransactions(locals.user.id);
	return json({ sync_transaction_success: sync_transaction_success, sync_account_success: sync_account_success });
};