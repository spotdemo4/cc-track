import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';
import { JWT_SECRET } from '$env/static/private';
import { db } from '$lib/db';
import { sql } from 'kysely';
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
            const tables = await db.introspection.getTables();

            if (!tables.find((table) => table.name == 'users')) {
                await db.schema.createTable('users')
                    .addColumn('id', 'serial', col => col.primaryKey())
                    .addColumn('email', 'text', col => col.unique().notNull())
                    .addColumn('password', 'text', col => col.notNull())
                    .addColumn('name', 'text', col => col.notNull())
                    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`NOW()`))
                    .execute();
            }

            if (!tables.find((table) => table.name == 'accounts')) {
                await db.schema.createTable('accounts')
                    .addColumn('id', 'text', col => col.primaryKey())
                    .addColumn('name', 'text', col => col.notNull())
                    .addColumn('mask', 'text')
                    .addColumn('official_name', 'text')
                    .addColumn('type', 'text', col => col.notNull())
                    .addColumn('subtype', 'text')
                    .addColumn('institution', 'text', col => col.notNull())
                    .addColumn('access_token', 'text', col => col.notNull())
                    .addColumn('cursor', 'text')
                    .addColumn('balance_available', 'numeric(14, 2)')
                    .addColumn('balance_current', 'numeric(14, 2)')
                    .addColumn('balance_limit', 'numeric(14, 2)')
                    .addColumn('balance_currency_code', 'text')
                    .addColumn('user_id', 'integer', col => col.notNull().references('users.id').onDelete('cascade'))
                    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`NOW()`))
                    .execute();
            }

            if (!tables.find((table) => table.name == 'transactions')) {
                await db.schema.createTable('transactions')
                    .addColumn('id', 'text', col => col.primaryKey())
                    .addColumn('account_id', 'text', col => col.notNull().references('accounts.id').onDelete('cascade'))
                    .addColumn('name', 'text', col => col.notNull())
                    .addColumn('merchant_name', 'text')
                    .addColumn('currency_code', 'text')
                    .addColumn('category_primary', 'text')
                    .addColumn('category_detailed', 'text')
                    .addColumn('category_confidence', 'text')
                    .addColumn('category_icon', 'text')
                    .addColumn('amount', 'numeric(14, 2)', col => col.notNull())
                    .addColumn('date', 'timestamp', col => col.notNull())
                    .addColumn('authorized_date', 'timestamp')
                    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`NOW()`))
                    .execute();
            }

            if (!tables.find((table) => table.name == 'cash_back')) {
                await db.schema.createTable('cash_back')
                    .addColumn('id', 'serial', col => col.primaryKey())
                    .addColumn('account_id', 'text', col => col.notNull().references('accounts.id').onDelete('cascade'))
                    .addColumn('category', 'text', col => col.notNull())
                    .addColumn('percentage', 'numeric(14, 2)', col => col.notNull())
                    .addColumn('start', 'timestamp')
                    .addColumn('end', 'timestamp')
                    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`NOW()`))
                    .execute();
            }

            // Migration
            if (!tables.find((table) => table.name == 'accounts')?.columns.find((column) => column.name == 'limit')) {
                await db.schema.alterTable('accounts')
                    .addColumn('limit', 'numeric(14, 2)')
                    .execute();
            }
            if (!tables.find((table) => table.name == 'accounts')?.columns.find((column) => column.name == 'limit_timeframe')) {
                await db.schema.alterTable('accounts')
                    .addColumn('limit_timeframe', 'text')
                    .execute();
            }

            connected = true;
        } catch (e) {
            console.log(e);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}