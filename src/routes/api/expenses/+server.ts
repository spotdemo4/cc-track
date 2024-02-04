import { json } from '@sveltejs/kit';
import { getExpenses } from '$lib/db/transactions';
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

    const expenses = await getExpenses(locals.user.id, form.data.start, form.data.end,);

    return new Response(devalue.stringify(expenses));
};