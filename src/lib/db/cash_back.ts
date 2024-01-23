import { db } from '$lib/db';
import type { CashBack } from '$lib/types';

export async function getCashBacks(account_id: string) {
    let cash_back_db = await db
        .select('id', 'account_id', 'category', 'percentage', 'start', 'end', 'created_at')
        .from('cash_back')
        .where('account_id', account_id);

    let cash_back: CashBack[] = cash_back_db.map((cash_back) => {
        return {
            id: cash_back.id,
            account_id: cash_back.account_id,
            category: cash_back.category,
            percentage: cash_back.percentage,
            start: cash_back.start ? new Date(cash_back.start) : undefined,
            end: cash_back.end ? new Date(cash_back.end) : undefined,
            created_at: cash_back.created_at,
        }
    });

    return cash_back;
}

export async function getCashBack(account_id: string, category_primary: string, category_detailed: string, date: Date) {
    let cash_back_db = await db
        .select('id', 'account_id', 'category', 'percentage', 'start', 'end', 'created_at')
        .from('cash_back')
        .where('account_id', account_id)
        .andWhere((builder) => {
            builder
                .where('start', '<=', date)
                .orWhereNull('start'); // Only compare if 'start' is defined
        })
        .andWhere((builder) => {
            builder
                .where('end', '>=', date)
                .orWhereNull('end'); // Only compare if 'end' is defined
        })
        .andWhere((builder) => {
            builder
                .where('category', category_primary)
                .orWhere('category', category_detailed);
        })
        .first();

    if (!cash_back_db) {
        return undefined;
    }

    let cash_back: CashBack = {
        id: cash_back_db.id,
        account_id: cash_back_db.account_id,
        category: cash_back_db.category,
        percentage: cash_back_db.percentage,
        start: cash_back_db.start ? new Date(cash_back_db.start) : undefined,
        end: cash_back_db.end ? new Date(cash_back_db.end) : undefined,
        created_at: cash_back_db.created_at,
    }

    return cash_back;
}