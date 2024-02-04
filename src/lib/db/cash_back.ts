import { db } from '$lib/db';

export async function getCashBacks(account_id: string) {
    return await db.selectFrom('cash_back')
        .selectAll()
        .where('account_id', '=', account_id)
        .execute();
}