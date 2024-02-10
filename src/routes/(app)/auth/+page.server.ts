import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { rpName, rpID } from '$lib/auth';
import { base64URLStringToBuffer } from '@simplewebauthn/browser';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import type { AuthenticatorTransportFuture, PublicKeyCredentialDescriptorFuture } from '@simplewebauthn/types';
import type { PageServerLoad } from './$types';

function formatAuthenticators(authenticators: {
    counter: string;
    credentialBackedUp: boolean;
    credentialDeviceType: string;
    credentialID: Buffer;
    credentialPublicKey: Buffer;
    transports: string | null;
    user_id: number;
}[]
) {
    let excludeCredentials: PublicKeyCredentialDescriptorFuture[] = [];
    for (let authenticator of authenticators) {
        const id = authenticator.credentialID;
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

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const userAuthenticators = await db.selectFrom('authenticator')
        .selectAll()
        .where('user_id', '=', locals.user.id)
        .execute();

    const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: String(locals.user.id),
        userName: locals.user.email,
        attestationType: 'none',
        excludeCredentials: formatAuthenticators(userAuthenticators),
        authenticatorSelection: {
            residentKey: 'preferred',
            userVerification: 'required',
            authenticatorAttachment: 'platform',
        },
    });

    await db.updateTable('users')
        .set('currentChallenge', options.challenge)
        .where('id', '=', locals.user.id)
        .execute();

    return {
        options
    };
};