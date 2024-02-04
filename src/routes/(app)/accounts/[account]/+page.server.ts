import { fail, redirect } from '@sveltejs/kit';
import { getAccount, getAccounts } from '$lib/db/accounts';
import { getCashBacks } from '$lib/db/cash_back';
import { db } from '$lib/db';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { categories } from '$lib/categories';
import type { PageServerLoad, Actions } from './$types';

const schema = z.object({
    id: z.string(),
    name: z.string().min(1),
    mask: z.string().optional(),
    official_name: z.string().nullish(),
    type: z.string().min(1),
    subtype: z.string().min(1),
    institution: z.string().min(1),
    cash_back: z.object({
        category: z.string().min(1),
        percentage: z.coerce.number().min(0).max(100),
        start: z.date().nullish(),
        end: z.date().nullish(),
    }).array().default([]),
});

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const form = await superValidate(schema);
    const account = await getAccount(params.account);

    if (account) {
        form.data.id = account.id;
        form.data.name = account.name;
        form.data.mask = account.mask ?? '';
        form.data.official_name = account.official_name;
        form.data.type = account.type;
        form.data.subtype = account.subtype ?? '';
        form.data.institution = account.institution;
        form.data.cash_back = (await getCashBacks(account.id)).map((cash_back) => {
            return {
                category: cash_back.category,
                percentage: Number(cash_back.percentage),
                start: cash_back.start,
                end: cash_back.end,
            }
        });
    }

    return {
        form,
        categories,
    };
};

export const actions = {
    edit: async ({ request, locals }) => {
        if (!locals.user) {
            throw redirect(302, '/login');
        }

        const form = await superValidate(request, schema);
        const accounts = await getAccounts(locals.user.id);

        if (!form.valid) {
            console.log(form.data.cash_back);
            return fail(400, { form })
        }

        if (!accounts.find((account) => account.id == form.data.id)) {
            return fail(400, { form })
        }

        await db.deleteFrom('cash_back')
            .where('account_id', '=', form.data.id)
            .execute();

        for (let cash_back of form.data.cash_back) {
            await db.insertInto('cash_back')
                .values({
                    account_id: form.data.id,
                    category: cash_back.category,
                    percentage: cash_back.percentage,
                    start: cash_back.start,
                    end: cash_back.end,
                })
                .execute();
        }

        await db.updateTable('accounts')
            .set({
                name: form.data.name,
                mask: form.data.mask,
                official_name: form.data.official_name,
                type: form.data.type,
                subtype: form.data.subtype,
                institution: form.data.institution,
            })
            .where('id', '=', form.data.id)
            .execute();

        redirect(303, '/accounts');
    },

    delete: async ({ request, locals }) => {
        if (!locals.user) {
            throw redirect(302, '/login');
        }

        const form = await superValidate(request, schema);
        const accounts = await getAccounts(locals.user.id);

        if (!form.valid) {
            return fail(400, { form })
        }

        if (!accounts.find((account) => account.id == form.data.id)) {
            return fail(400, { form })
        }

        await db.deleteFrom('transactions')
            .where('account_id', '=', form.data.id)
            .execute();

        await db.deleteFrom('accounts')
            .where('id', '=', form.data.id)
            .execute();

        redirect(303, '/accounts');
    }
} as Actions;