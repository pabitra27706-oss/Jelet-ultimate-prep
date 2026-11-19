/*
 * Offline service worker for JELET Ultimate Prep.
 *
 * Two caches with two jobs:
 *
 * - The **shell** cache holds the small set of files the site needs to start
 *   at all. It is refreshed in the background and is never a pack.
 * - The **pack** caches hold files a learner explicitly chose to keep on
 *   their device. A pack is versioned, and a pack that is being updated is
 *   staged in its own cache and only swapped into place once every file has
 *   arrived. A failed download never replaces a working pack.
 *
 * Study state — attempts, the review queue, notes — lives in localStorage
 * and is never touched here. Removing a pack cannot erase a learner's work.
 *
 * The worker never sends anything anywhere. There is no analytics, no
 * telemetry and no account.
 */
const SHELL_CACHE = 'jelet-shell-v2';
const PRECACHE = [
  './',
  './library/',
  './practice/',
  './review/',
  './search/',
  './syllabus/',
  './coverage/',
  './workspace/topics/',
  './data/keys.json',
  './data/packs.json',
  './search-index.json',
  './manifest.webmanifest',
  './icon.svg',
];

/** The prefix every pack cache name starts with. */
const PACK_PREFIX = 'jelet-pack-';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && !key.startsWith(PACK_PREFIX))
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

/**
 * The pack caches this worker is holding, newest version of each pack.
 *
 * A staging cache is not a pack: it is a download that has not finished, so
 * it is never served.
 */
async function packCaches() {
  const keys = await caches.keys();
  const packs = new Map();
  for (const key of keys) {
    if (!key.startsWith(PACK_PREFIX)) continue;
    if (key.endsWith('.staging')) continue;
    const rest = key.slice(PACK_PREFIX.length);
    const dash = rest.lastIndexOf('-');
    if (dash < 0) continue;
    const id = rest.slice(0, dash);
    const version = rest.slice(dash + 1);
    const existing = packs.get(id);
    // Keep the newest version when several are present.
    if (!existing || existing.version < version) packs.set(id, { version, cache: key });
  }
  return packs;
}

/**
 * Handle a pack request from the page.
 *
 * The page drives the download itself — it needs the byte counts and the
 * progress — and then tells the worker the pack is complete. The worker
 * only has to answer "which caches hold packs" and "delete this cache".
 */
self.addEventListener('message', (event) => {
  const data = event.data ?? {};
  if (data.type === 'jelet:pack-state') {
    event.waitUntil((async () => {
      const packs = [...(await packCaches()).entries()].map(([id, entry]) => ({ id, version: entry.version }));
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clients) client.postMessage({ type: 'jelet:pack-state', packs });
    })());
    return;
  }
  if (data.type === 'jelet:drop-cache') {
    event.waitUntil(caches.delete(data.cache));
    return;
  }
  if (data.type === 'jelet:skip-waiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // A pack file is served from its pack cache when it is there, and from
  // the network otherwise. A pack that is only half downloaded is never
  // consulted, so an interrupted download cannot serve a partial file.
  event.respondWith((async () => {
    const packs = await packCaches();
    for (const entry of packs.values()) {
      const cache = await caches.open(entry.cache);
      const hit = await cache.match(request, { ignoreSearch: false });
      if (hit) return hit;
    }

    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
        }
        return response;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        const shell = await caches.match('./');
        if (shell) return shell;
        return new Response(
          '<!doctype html><meta charset="utf-8"><title>Offline</title>'
          + '<body style="font:16px system-ui;padding:2rem;max-width:34rem;margin:auto">'
          + '<h1>This page is not on your device</h1>'
          + '<p>You are offline and this page was never downloaded. Open a paper you have saved as an offline pack, '
          + 'or reconnect and try again.</p>',
          { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
        );
      }
    }

    try {
      const response = await fetch(request);
      if (response.ok) {
        const copy = response.clone();
        caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
      }
      return response;
    } catch {
      const cached = await caches.match(request);
      if (cached) return cached;
      return new Response('', { status: 504, statusText: 'Offline and not cached' });
    }
  })());
});
