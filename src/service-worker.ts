/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `cache${version}`;
const ASSETS = [...build, ...files];

// Install service worker
self.addEventListener('install', (event) => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }

    event.waitUntil(addFilesToCache());
});

// Activate service worker
self.addEventListener('activate', (event) => {
    async function removeOldCaches() {
        const keys = await caches.keys();
        for (const key of keys) {
            if (key !== CACHE) {
                await caches.delete(key);
            }
        }
    }

    event.waitUntil(removeOldCaches());
});

// Listen to fetch requests
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    async function getResponseFromCache() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        // Serve build files from cache
        if (ASSETS.includes(url.pathname)) {
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        // Try the network first
        try {
            const response = await fetch(event.request);
            const isNotExtension = url.protocol === 'http:' || url.protocol === 'https:';
            const isSuccess = response.status == 200;

            if (isNotExtension && isSuccess) {
                cache.put(event.request, response.clone());
            }

            return response;

        } catch (error) {

            // Fall back to cache
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        return new Response('Not found', { status: 404 });
    }

    event.respondWith(getResponseFromCache());
});

self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});