import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';
import { db } from '$lib/db';
import { JWT_SECRET } from '$env/static/private';
import jsonwebtoken from 'jsonwebtoken';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
    const jwt = event.cookies.get('jwt');

    if (jwt) {
        try {
            const decoded = jsonwebtoken.verify(jwt, JWT_SECRET ?? 'shhsecret') as App.User;

            if (decoded) {
                event.locals.user = decoded;
            }
        } catch (e) {
            if (
                e instanceof jsonwebtoken.TokenExpiredError ||
                e instanceof jsonwebtoken.JsonWebTokenError
            ) {
                event.cookies.delete('jwt', { path: '/', secure: true });
                event.locals.user = undefined;
            } else {
                console.log(e);
            }
        }
    }

    if (event.url.pathname != '/login' && !event.locals.user) {
        throw redirect(302, '/login');
    }

    return await resolve(event);
}) satisfies Handle;

if (!building) {
    let connected = false;
    while (!connected) {
        try {
            if (!await db.schema.hasTable('users')) {
                await db.schema.createTable('users', (table) => {
                    table.increments('id');
                    table.string('email').notNullable().unique();
                    table.string('password').notNullable();
                    table.string('name').notNullable();
                    table.timestamp('created_at').defaultTo(db.fn.now());
                });
            }

            if (!await db.schema.hasTable('accounts')) {
                await db.schema.createTable('accounts', (table) => {
                    table.string('id').notNullable().unique().primary();
                    table.string('name').notNullable();
                    table.string('mask');
                    table.string('official_name')
                    table.string('type').notNullable();
                    table.string('subtype');
                    table.string('institution').notNullable();
                    table.string('access_token').notNullable();
                    table.string('cursor');
                    table.decimal('balance_available', 14, 2);
                    table.decimal('balance_current', 14, 2);
                    table.decimal('balance_limit', 14, 2);
                    table.string('balance_currency_code');
                    table.integer('user_id').unsigned().notNullable();
                    table.foreign('user_id').references('users.id');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                });
            }

            if (!await db.schema.hasTable('transactions')) {
                await db.schema.createTable('transactions', (table) => {
                    table.string('id').notNullable().unique().primary();
                    table.string('account_id').notNullable();
                    table.foreign('account_id').references('accounts.id');
                    table.string('name').notNullable();
                    table.string('merchant_name');
                    table.string('currency_code');
                    table.string('category_primary');
                    table.string('category_detailed');
                    table.string('category_confidence');
                    table.string('category_icon');
                    table.decimal('amount', 14, 2).notNullable();
                    table.timestamp('date').notNullable();
                    table.timestamp('authorized_date');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                });
            }

            if (!await db.schema.hasTable('cash_back')) {
                await db.schema.createTable('cash_back', (table) => {
                    table.increments('id');
                    table.string('account_id').notNullable();
                    table.foreign('account_id').references('accounts.id');
                    table.string('category').notNullable();
                    table.decimal('percentage', 14, 2).notNullable();
                    table.timestamp('start');
                    table.timestamp('end');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                });
            }

            connected = true;
        } catch (e) {
            console.log(e);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}