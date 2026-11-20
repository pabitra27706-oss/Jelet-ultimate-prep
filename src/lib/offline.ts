/**
 * Offline packs.
 *
 * A pack is a named, versioned bundle of the site's own files that a learner
 * chooses to keep on their device so a paper or a chapter works with no
 * connection. Two rules shape everything here:
 *
 * 1. **Opt-in and visible.** Nothing is downloaded until the learner asks,
 *    and the pack manifest states exactly what is in the pack, its version
 *    and its byte size before anything is fetched.
 * 2. **Failure-safe.** A download is staged and only becomes "ready" when
 *    every file in it has arrived. A failed or interrupted download leaves
 *    the previous complete version exactly as it was, and it never reports
 *    itself as ready.
 *
 * Downloaded resources and study state are kept apart. Packs live in the
 * Cache Storage API under their own cache names; attempts, the review queue
 * and notes live in localStorage under their own keys. Removing a pack
 * therefore cannot erase a learner's work.
 */

/** The schema version of the pack manifest itself. */
export const PACK_MANIFEST_SCHEMA = 1;

/**
 * One file inside a pack.
 *
 * `path` is relative to the site root and is the only thing the service
 * worker fetches. `bytes` is measured at build time from the real file, so
 * the size a learner is shown before downloading is the size they get.
 */
export type PackFile = {
  path: string;
  bytes: number;
};

/**
 * One pack a learner can download.
 *
 * `version` is the site's release version at the time the pack was built.
 * A pack with an older version than the one already installed is never
 * installed over it.
 */
export type Pack = {
  /** A stable identifier, e.g. `paper-2025`. */
  id: string;
  /** A human title. */
  title: string;
  /** What the pack contains, in one line. */
  summary: string;
  /** The site release this pack was built from. */
  version: string;
  /** The files in the pack. */
  files: PackFile[];
  /** The total byte size of the pack. */
  bytes: number;
  /**
   * Whether the pack can be completed with no connection.
   *
   * A pack whose content depends on something the site does not host — a
   * video, an external lens — cannot be. Such a pack is still offered, but
   * it says so, because a learner needs to know before they rely on it.
   */
  offlineComplete: boolean;
  /** The resources that are online-only, named for the learner. */
  onlineOnly: string[];
};

/** The manifest the service worker and the UI both read. */
export type PackManifest = {
  schema: number;
  /** The site release this manifest was built from. */
  version: string;
  packs: Pack[];
};

export type PackState = 'absent' | 'downloading' | 'ready' | 'failed';

export type InstalledPack = {
  id: string;
  version: string;
  /** The byte size actually stored. */
  bytes: number;
  /** When it was installed. */
  installedAt: number;
  /** How many files are in it. */
  fileCount: number;
};

const MANIFEST_URL = 'data/packs.json';
const STATE_KEY = 'jelet:packs:v1';

/** The cache name a pack's files live in. */
export const packCacheName = (id: string, version: string) => `jelet-pack-${id}-${version}`;

/** The cache name a pack's download is staged into before it is ready. */
export const packStagingCacheName = (id: string, version: string) => `jelet-pack-${id}-${version}.staging`;

/** Read the pack manifest. */
export async function readManifest(base = '/'): Promise<PackManifest> {
  const response = await fetch(`${base.replace(/\/$/, '')}/${MANIFEST_URL}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`The pack manifest could not be loaded (${response.status}).`);
  const data = (await response.json()) as PackManifest;
  if (!data || data.schema !== PACK_MANIFEST_SCHEMA || !Array.isArray(data.packs)) {
    throw new Error('The pack manifest is not in a format this build understands.');
  }
  return data;
}

/** The packs the learner has installed, from local storage. */
export function readInstalled(): InstalledPack[] {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { schema?: number; packs?: InstalledPack[] };
    if (parsed?.schema !== 1 || !Array.isArray(parsed.packs)) return [];
    return parsed.packs;
  } catch {
    return [];
  }
}

function writeInstalled(packs: InstalledPack[]): boolean {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({ schema: 1, packs }));
    return true;
  } catch {
    return false;
  }
}

/** The state of one pack on this device. */
export function stateOf(pack: Pack): PackState {
  if (typeof caches === 'undefined') return 'absent';
  const installed = readInstalled();
  if (installed.some((entry) => entry.id === pack.id)) return 'ready';
  return 'absent';
}

/**
 * Install a pack.
 *
 * The download is staged in its own cache. Only when every file has arrived
 * is the staged cache renamed into place and the install recorded. If any
 * file fails, the staging cache is thrown away and the previous version —
 * if there was one — is untouched.
 */
export async function installPack(pack: Pack, base = '/', onProgress?: (done: number, total: number) => void): Promise<InstalledPack> {
  if (typeof caches === 'undefined') throw new Error('This browser cannot store offline packs.');
  const root = base.replace(/\/$/, '');
  const staging = packStagingCacheName(pack.id, pack.version);
  const target = packCacheName(pack.id, pack.version);

  // A failed download must not disturb a complete pack that is already here.
  const previous = readInstalled().find((entry) => entry.id === pack.id) ?? null;
  if (previous && previous.version > pack.version) {
    throw new Error(`Version ${previous.version} is already installed. It is newer than ${pack.version}.`);
  }

  const cache = await caches.open(staging);
  let done = 0;
  try {
    for (const file of pack.files) {
      const response = await fetch(`${root}/${file.path}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${file.path} could not be downloaded (${response.status}).`);
      await cache.put(`${root}/${file.path}`, response.clone());
      // A directory route is requested as `/path/`, not `/path/index.html`.
      // Both forms are stored so the browser finds the file either way.
      if (file.path.endsWith('/index.html')) {
        const directory = `${root}/${file.path.slice(0, -'index.html'.length)}`;
        await cache.put(directory, response.clone());
      }
      done += 1;
      onProgress?.(done, pack.files.length);
    }
  } catch (error) {
    // Throw the staging cache away. Nothing was renamed, so the previous
    // complete pack is still there and still works.
    await caches.delete(staging);
    const reason = (error as Error).message;
    throw new Error(
      previous
        ? `The update failed: ${reason} Version ${previous.version} is still on this device and still works.`
        : `Not ready: ${reason}`,
    );
  }

  // Every file arrived. Only now does the pack become the installed one.
  const stagedRequests = await cache.keys();
  const targetCache = await caches.open(target);
  await Promise.all(stagedRequests.map(async (request) => {
    const response = await cache.match(request);
    if (response) await targetCache.put(request, response);
  }));
  await caches.delete(staging);

  const installed: InstalledPack = {
    id: pack.id,
    version: pack.version,
    bytes: pack.bytes,
    installedAt: Date.now(),
    fileCount: pack.files.length,
  };
  const all = readInstalled();
  // The older versions of this pack are removed only now, once the new one is
  // complete and in place. Until this point the learner still had the old
  // one working.
  for (const entry of all) {
    if (entry.id !== pack.id) continue;
    if (entry.version === pack.version) continue;
    await caches.delete(packCacheName(entry.id, entry.version));
  }
  writeInstalled([...all.filter((entry) => entry.id !== pack.id), installed]);
  return installed;
}

/**
 * Remove a pack's downloaded files.
 *
 * Study state — attempts, the review queue, notes — is not touched. It
 * lives in localStorage under its own keys and survives the removal, so a
 * learner who removes a pack does not lose their work.
 */
export async function removePack(pack: Pack): Promise<void> {
  if (typeof caches !== 'undefined') {
    await caches.delete(packCacheName(pack.id, pack.version));
    await caches.delete(packStagingCacheName(pack.id, pack.version));
    for (const entry of readInstalled()) {
      if (entry.id === pack.id) await caches.delete(packCacheName(entry.id, entry.version));
    }
  }
  writeInstalled(readInstalled().filter((entry) => entry.id !== pack.id));
}

/** How much storage the packs are using, as the browser reports it. */
export async function storageEstimate(): Promise<{ usage: number; quota: number } | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return null;
  const estimate = await navigator.storage.estimate();
  return { usage: estimate.usage ?? 0, quota: estimate.quota ?? 0 };
}

/**
 * Ask the browser to keep the stored packs.
 *
 * Without this a browser may evict the packs under storage pressure, which
 * would silently break an offline paper. A refusal is reported rather than
 * hidden.
 */
export async function requestPersistence(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

/** Whether the browser is already treating this origin's storage as persistent. */
export async function isPersisted(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persisted) return false;
  try {
    return await navigator.storage.persisted();
  } catch {
    return false;
  }
}

/** A readable size for the pack list. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
