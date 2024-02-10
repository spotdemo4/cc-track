import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { origin, rpID } from '$lib/auth';
import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { bufferToBase64URLString } from '@simplewebauthn/browser';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import type { RequestHandler } from "./$types";
import type { AuthenticatorTransportFuture } from '@simplewebauthn/types';

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
    const user_email = cookies.get('user_email');

    if (!user_email) {
        return json({ success: false, error: 'Username not saved!' })
    }

    const user = await db.selectFrom('users')
        .select(['currentChallenge', 'id', 'email', 'name'])
        .where('email', '=', user_email)
        .executeTakeFirst();

    if (!user || !user.currentChallenge) {
        return json({ success: false, error: 'No user or challenge exists!' })
    }

    const body = await request.json();

    let authenticator = await db.selectFrom('authenticator')
        .selectAll()
        .where('user_id', '=', user.id)
        .execute();
    
    console.log(body);
    for (let auth of authenticator) {
        console.log(auth.credentialID);
        console.log(bufferToBase64URLString(auth.credentialID));
    }
    
    authenticator = authenticator.filter((auth) => {
        return bufferToBase64URLString(auth.credentialID) === body.id;
    });

    console.log(authenticator);
    
    if (!authenticator[0]) {
        return json({ success: false, error: 'No authenticators!' })
    }

    let verification;
    try {
        verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge: user.currentChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: formatAuthenticator(authenticator[0]),
        });
    } catch (error) {
        return json({ success: false })
    }

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
            .set('counter', String(Number(authenticator[0].counter) + 1))
            .where('user_id', '=', user.id)
            .where('credentialID', '=', body.id)
            .execute();
    }

    return json({ success: verification.verified })
};