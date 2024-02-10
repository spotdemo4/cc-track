import { ORIGIN } from "$env/static/private";

const url = new URL(ORIGIN);
export const rpName = 'CCTrack';
export const rpID = url.hostname;
export const origin = url.origin;