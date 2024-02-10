import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { origin, rpID } from '$lib/auth';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
    if (!locals.user) {
        return json({ success: false, error: 'Not logged in' })
    }

    const expectedChallenge = (await db.selectFrom('users')
        .select('currentChallenge')
        .where('id', '=', locals.user.id)
        .executeTakeFirst())?.currentChallenge;

    if (!expectedChallenge) {
        return json({ success: false, error: 'No current challenge!' })
    }

    const body = await request.json();

    let verification;
    try {
        verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge: expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });
    } catch (error) {
        return json({ success: false })
    }

    if (verification.verified && verification.registrationInfo) {
        await db.insertInto('authenticator')
            .values({
                user_id: locals.user.id,
                credentialID: String(verification.registrationInfo.credentialID),
                credentialPublicKey: Buffer.from(verification.registrationInfo.credentialPublicKey),
                counter: verification.registrationInfo.counter,
                transports: body.transports,
                credentialDeviceType: verification.registrationInfo.credentialDeviceType,
                credentialBackedUp: verification.registrationInfo.credentialBackedUp,
            })
            .execute();
    }

    return json({ success: verification.verified })
};