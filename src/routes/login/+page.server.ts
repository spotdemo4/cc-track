import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { db } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import { rpID } from '$lib/auth';
import { JWT_SECRET } from '$env/static/private';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import type { PageServerLoad, Actions } from './$types';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import type { AuthenticatorTransportFuture, PublicKeyCredentialDescriptorFuture } from '@simplewebauthn/types';

const schema = z.object({
    email: z.string().email().min(5),
    password: z.string().min(5),
    confirm_password: z.string().min(5).optional(),
});

function formatAuthenticators(authenticators: {
    counter: string;
    credentialBackedUp: boolean;
    credentialDeviceType: string;
    credentialID: string;
    credentialPublicKey: Buffer;
    transports: string | null;
    user_id: number;
}[]
) {
    let excludeCredentials: PublicKeyCredentialDescriptorFuture[] = [];
    for (let authenticator of authenticators) {
        const id = Buffer.from(authenticator.credentialID, 'utf-8');
        const type = 'public-key';
        if (authenticator.transports) {
            const transports = authenticator.transports.includes(',') ? authenticator.transports.split(',') as AuthenticatorTransportFuture[] : [authenticator.transports] as AuthenticatorTransportFuture[];
            excludeCredentials.push({ id, type, transports });
        } else {
            excludeCredentials.push({ id, type });
        }
    }

    return excludeCredentials;
}

export const load: PageServerLoad = async ({ locals, cookies }) => {
    if (locals.user) {
        throw redirect(302, '/');
    }

    const user_email = cookies.get('user_email');

    let user;
    if (user_email) {
        user = await db.selectFrom('users')
            .select(['id', 'email'])
            .where('users.email', '=', user_email)
            .executeTakeFirst();
    }

    let options;
    if (user) {
        const userAuthenticators = await db.selectFrom('authenticator')
            .selectAll()
            .where('user_id', '=', user.id)
            .execute();

        options = await generateAuthenticationOptions({
            rpID: rpID,
            allowCredentials: formatAuthenticators(userAuthenticators),
            userVerification: 'preferred',
        });

        await db.updateTable('users')
            .set('currentChallenge', options.challenge)
            .where('id', '=', user.id)
            .execute();
    }

    const form = await superValidate(schema);
    form.data.email = user?.email || '';

    return {
        form,
        options
    };
};

export const actions = {
    login: async ({ request, cookies }) => {
        const form = await superValidate(request, schema);

        if (!form.valid) {
            return fail(400, { form })
        }

        const user = await db.selectFrom('users').selectAll().where('email', '=', form.data.email).executeTakeFirst();
        form.errors.password = ['Invalid email or password.'];

        if (!user) {
            return fail(400, { form })
        }

        const password_valid = await bcrypt.compare(form.data.password, user.password);

        if (!password_valid) {
            return fail(400, { form })
        }

        const token = jsonwebtoken.sign(
            { email: user.email, name: user.name, id: user.id },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        cookies.set('jwt', token, { path: '/', secure: true });
        cookies.set('user_email', user.email, { path: '/', secure: true })
        console.log('User ' + user.email + ' logged in.')

        redirect(303, '/');
    },
    register: async ({ request, cookies }) => {
        const form = await superValidate(request, schema);

        if (!form.valid) {
            return fail(400, { form })
        }

        if (form.data.password !== form.data.confirm_password) {
            form.errors.confirm_password = ['Passwords do not match.'];
            return fail(400, { form })
        }

        const user = await db.selectFrom('users').selectAll().where('email', '=', form.data.email).executeTakeFirst();

        if (user) {
            form.errors.email = ['Email already in use.'];
            return fail(400, { form })
        }

        const password = await bcrypt.hash(form.data.password, 10);

        const user_insert = await db.insertInto('users')
            .values({
                email: form.data.email,
                password: password,
                name: form.data.email,
            })
            .returning('id')
            .executeTakeFirst();

        const token = jsonwebtoken.sign(
            { email: form.data.email, name: form.data.email, id: user_insert?.id },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        cookies.set('jwt', token, { path: '/', secure: true });
        cookies.set('user_email', form.data.email, { path: '/', secure: true })
        console.log('User ' + form.data.email + ' registered.')

        redirect(303, '/');
    }
} as Actions;