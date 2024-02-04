// import knex from 'knex';
import type { DB } from './types';
import { DB_HOST, DB_USER, DB_PORT, DB_PASS, DB_NAME } from '$env/static/private';
import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

const dialect = new PostgresDialect({
    pool: new pg.Pool({
        host: DB_HOST,
        port: parseInt(DB_PORT),
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        max: 10
    }),
});

export const db = new Kysely<DB>({
    dialect
});