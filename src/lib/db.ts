import knex from 'knex';
import { DB_HOST, DB_USER, DB_PORT, DB_PASS, DB_NAME } from '$env/static/private';

export const db = knex({
    client: 'pg',
    connection: {
        host: DB_HOST,
        port: parseInt(DB_PORT),
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
    }
});