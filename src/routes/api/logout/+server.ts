import { json } from '@sveltejs/kit';
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, cookies }) => {
    if (!locals.user) {
        return json({ success: false });
    }

    cookies.delete('jwt', { path: '/', secure: true });
	return json({ success: true });
};