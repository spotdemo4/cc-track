import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { plaidClient, plaidProducts, plaidCountryCodes } from '$lib/plaid';
import { db } from '$lib/db';
import type { PageServerLoad, Actions } from './$types';

const schema = z.object({
    accounts: z.object({
        id: z.string(),
        name: z.string().min(1),
        mask: z.string().optional(),
        type: z.string().min(1),
        subtype: z.string().min(1),
    }).array(),
    institution: z.string().min(1),
    public_token: z.string().min(1),
});

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const form = await superValidate(schema);
    const tokenResponse = await plaidClient.linkTokenCreate({
        user: { client_user_id: locals.user.id.toString() },
        client_name: 'CC Track',
        language: 'en',
        products: plaidProducts,
        country_codes: plaidCountryCodes,
    });

    return {
        form,
        link_token: tokenResponse.data.link_token
    };
};

export const actions = {
    add: async ({ request, locals }) => {
        if (!locals.user) {
            throw redirect(302, '/login');
        }

        const form = await superValidate(request, schema);

        if (!form.valid) {
            return fail(400, { form })
        }

        const tokenResponse = await plaidClient.itemPublicTokenExchange({
            public_token: form.data.public_token,
        });

        form.data.accounts.forEach(async (account) => {
            await db.insertInto('accounts')
                .values({
                    id: account.id,
                    name: account.name,
                    mask: account.mask,
                    type: account.type,
                    subtype: account.subtype,
                    institution: form.data.institution,
                    access_token: tokenResponse.data.access_token,
                    user_id: locals.user!.id,
                })
                .execute();
        });

        redirect(303, '/accounts');
    }
} as Actions;