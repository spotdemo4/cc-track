import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { origin, rpID } from '$lib/auth';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import type { RequestHandler } from "./$types";
import type { RegistrationResponseJSON } from '@simplewebauthn/types';

export const POST: RequestHandler = async ({ locals, request }) => {
    if (!locals.user) {
        return json({ success: false, error: 'Not logged in.' })
    }

    const expectedChallenge = (await db.selectFrom('users')
        .select('currentChallenge')
        .where('id', '=', locals.user.id)
        .executeTakeFirst())?.currentChallenge;

    if (!expectedChallenge) {
        return json({ success: false, error: 'No current challenge!' })
    }

    const body = await request.json() as RegistrationResponseJSON;

    let verification;
    try {
        verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge: expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });
    } catch (err: any) {
        return json({ success: false, error: JSON.stringify(err) })
    }

    if (verification.verified && verification.registrationInfo) {
        await db.insertInto('authenticator')
            .values({
                user_id: locals.user.id,
                credentialID: Buffer.from(verification.registrationInfo.credentialID),
                credentialPublicKey: Buffer.from(verification.registrationInfo.credentialPublicKey),
                counter: verification.registrationInfo.counter,
                transports: body.response.transports?.join(','),
                credentialDeviceType: verification.registrationInfo.credentialDeviceType,
                credentialBackedUp: verification.registrationInfo.credentialBackedUp,
            })
            .execute();
    }

    return json({ success: verification.verified })
};