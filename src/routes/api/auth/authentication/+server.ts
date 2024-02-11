import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { origin, rpID } from '$lib/auth';
import { JWT_SECRET } from '$env/static/private';
import { bufferToBase64URLString } from '@simplewebauthn/browser';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import jsonwebtoken from 'jsonwebtoken';
import type { RequestHandler } from "./$types";
import type { AuthenticationResponseJSON, AuthenticatorTransportFuture } from '@simplewebauthn/types';

// Format the authenticator for the verification
function formatAuthenticator(authenticator: {
    counter: string;
    credentialBackedUp: boolean;
    credentialDeviceType: string;
    credentialID: Buffer;
    credentialPublicKey: Buffer;
    transports: string | null;
    user_id: number;
}) {
    const credentialID = authenticator.credentialID;
    const credentialPublicKey = authenticator.credentialPublicKey;
    const credentialBackedUp = authenticator.credentialBackedUp;
    const counter = Number(authenticator.counter);
    const credentialDeviceType = authenticator.credentialDeviceType;
    if (authenticator.transports) {
        const transports = authenticator.transports.includes(',') ? authenticator.transports.split(',') as AuthenticatorTransportFuture[] : [authenticator.transports] as AuthenticatorTransportFuture[];
        return { credentialID, credentialPublicKey, credentialBackedUp, counter, credentialDeviceType, transports };
    } else {
        return { credentialID, credentialPublicKey, credentialBackedUp, counter, credentialDeviceType };
    }
}

export const POST: RequestHandler = async ({ request, cookies }) => {
    // Get the user's email from the cookies
    const user_email = cookies.get('user_email');
    if (!user_email) {
        return json({ success: false, error: 'Username not saved!' })
    }

    // Get the user and their current challenge
    const user = await db.selectFrom('users')
        .select(['currentChallenge', 'id', 'email', 'name'])
        .where('email', '=', user_email)
        .executeTakeFirst();
    if (!user || !user.currentChallenge) {
        return json({ success: false, error: 'No user or challenge exists!' })
    }

    // Get the authenticator
    const body = await request.json() as AuthenticationResponseJSON;
    const authenticator_db = await db.selectFrom('authenticator')
        .selectAll()
        .where('user_id', '=', user.id)
        .execute();
    const authenticator = authenticator_db.filter((auth) => {
        return bufferToBase64URLString(auth.credentialID) === body.id;
    })?.at(0);
    if (!authenticator) {
        return json({ success: false, error: 'No authenticators!' })
    }

    // Verify the response
    let verification;
    try {
        verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge: user.currentChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: formatAuthenticator(authenticator),
        });
    } catch (err: any) {
        return json({ success: false, error: JSON.stringify(err) })
    }

    console.log(verification);

    if (verification.verified) {
        // Set the cookies to login
        const token = jsonwebtoken.sign(
            { email: user.email, name: user.name, id: user.id },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        cookies.set('jwt', token, { path: '/', secure: true });
        cookies.set('user_email', user.email, { path: '/', secure: true });
        console.log('User ' + user.email + ' logged in.')

        // Increment the counter
        await db.updateTable('authenticator')
            .set('counter', String(Number(authenticator.counter) + 1))
            .where('user_id', '=', user.id)
            .where('credentialID', '=', authenticator.credentialID)
            .execute();
    }

    return json({ success: verification.verified })
};