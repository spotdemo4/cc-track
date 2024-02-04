import { json } from '@sveltejs/kit';
import { getTransactionsCount } from '$lib/db/transactions';
import { z } from 'zod';
import * as devalue from 'devalue';
import type { RequestHandler } from "./$types";

const schema = z.object({
    start: z.date(),
    end: z.date(),
    merchants_filter: z.string().optional(),
    accounts_filter: z.string().array().optional(),
    categories_filter: z.string().array().optional(),
    page_size: z.coerce.number().default(10),
    page_current: z.coerce.number().default(1),
});

export const POST: RequestHandler = async ({ locals, request }) => {
    if (!locals.user) {
        return json([]);
    }

    const form = schema.safeParse(devalue.parse(await request.text()));

    if (!form.success) {
        console.log(form);
        return json([]);
    }

    const transactionsCount = await getTransactionsCount(locals.user.id, form.data.start, form.data.end, form.data.merchants_filter, form.data.accounts_filter, form.data.categories_filter);

    return new Response(devalue.stringify(transactionsCount));
};