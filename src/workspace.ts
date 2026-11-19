export const WORKSPACE_SCHEMA = 1;
export const APP_ID = 'jelet-ultimate-prep';
export const MAX_IMPORT_BYTES = 200_000;
const DB_NAME = 'jelet-workspace';
const DB_VERSION = 1;
const STORES = ['bookmarks', 'notes', 'resume'] as const;

export type Bookmark = { id: string; itemId: string; title: string; url: string; createdAt: string };
export type Note = { id: string; itemId: string; text: string; updatedAt: string };
export type Resume = { id: 'current'; itemId: string; title: string; url: string; updatedAt: string };
export type WorkspaceData = {
  schemaVersion: typeof WORKSPACE_SCHEMA;
  appId: typeof APP_ID;
  exportedAt: string;
  items: { bookmarks: Bookmark[]; notes: Note[]; resume: Resume[] };
};
export type LibraryItem = { id: string; title: string; url: string };

export const emptyWorkspace = (): WorkspaceData => ({
  schemaVersion: WORKSPACE_SCHEMA,
  appId: APP_ID,
  exportedAt: '',
  items: { bookmarks: [], notes: [], resume: [] },
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isArrayOf<T>(value: unknown, check: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(check);
}
const isBookmark = (v: unknown): v is Bookmark => isRecord(v)
  && ['id', 'itemId', 'title', 'url', 'createdAt'].every((k) => typeof v[k] === 'string');
const isNote = (v: unknown): v is Note => isRecord(v)
  && ['id', 'itemId', 'text', 'updatedAt'].every((k) => typeof v[k] === 'string');
const isResume = (v: unknown): v is Resume => isRecord(v) && v.id === 'current'
  && ['itemId', 'title', 'url', 'updatedAt'].every((k) => typeof v[k] === 'string');

export function validateImport(raw: unknown, size = 0): { ok: true; data: WorkspaceData } | { ok: false; error: string } {
  if (size > MAX_IMPORT_BYTES) return { ok: false, error: 'File is too large. Nothing changed.' };
  if (!isRecord(raw)) return { ok: false, error: 'Not a workspace file. Nothing changed.' };
  if (raw.schemaVersion !== WORKSPACE_SCHEMA) return { ok: false, error: 'Unsupported workspace version. Nothing changed.' };
  if (raw.appId !== APP_ID || !isRecord(raw.items)) return { ok: false, error: 'Wrong app or missing data. Nothing changed.' };
  const { bookmarks, notes, resume } = raw.items;
  if (!isArrayOf(bookmarks, isBookmark) || !isArrayOf(notes, isNote) || !isArrayOf(resume, isResume)) {
    return { ok: false, error: 'Invalid item shape. Nothing changed.' };
  }
  return { ok: true, data: {
    schemaVersion: WORKSPACE_SCHEMA, appId: APP_ID,
    exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : '',
    items: { bookmarks: [...bookmarks], notes: [...notes], resume: [...resume] },
  } };
}

function dedupe<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => !seen.has(item.id) && !!seen.add(item.id));
}

/** Merge never overwrites an existing local item with the same stable ID. */
export function mergeWorkspace(current: WorkspaceData, incoming: WorkspaceData): WorkspaceData {
  return {
    ...current,
    items: {
      bookmarks: dedupe([...current.items.bookmarks, ...incoming.items.bookmarks]),
      notes: dedupe([...current.items.notes, ...incoming.items.notes]),
      resume: current.items.resume.length > 0 ? current.items.resume : incoming.items.resume,
    },
  };
}

export function makeBookmark(item: LibraryItem): Bookmark {
  return { id: `bookmark:${item.id}`, itemId: item.id, title: item.title, url: item.url, createdAt: new Date().toISOString() };
}
export function makeNote(item: LibraryItem, text: string): Note {
  return { id: `note:${item.id}`, itemId: item.id, text, updatedAt: new Date().toISOString() };
}
export function makeResume(item: LibraryItem): Resume {
  return { id: 'current', itemId: item.id, title: item.title, url: item.url, updatedAt: new Date().toISOString() };
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('Storage unavailable')); return; }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      for (const store of STORES) {
        if (!request.result.objectStoreNames.contains(store)) request.result.createObjectStore(store, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Storage unavailable'));
  });
}

function requestAll<T>(store: IDBObjectStore): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error ?? new Error('Read failed'));
  });
}

export async function readWorkspace(): Promise<WorkspaceData> {
  const db = await openDB();
  try {
    const tx = db.transaction(STORES, 'readonly');
    const [bookmarks, notes, resume] = await Promise.all([
      requestAll<Bookmark>(tx.objectStore('bookmarks')),
      requestAll<Note>(tx.objectStore('notes')),
      requestAll<Resume>(tx.objectStore('resume')),
    ]);
    return { schemaVersion: WORKSPACE_SCHEMA, appId: APP_ID, exportedAt: '', items: { bookmarks, notes, resume } };
  } finally { db.close(); }
}

export async function writeWorkspace(data: WorkspaceData): Promise<void> {
  const db = await openDB();
  try {
    const tx = db.transaction(STORES, 'readwrite');
    for (const store of STORES) tx.objectStore(store).clear();
    for (const item of data.items.bookmarks) tx.objectStore('bookmarks').put(item);
    for (const item of data.items.notes) tx.objectStore('notes').put(item);
    for (const item of data.items.resume) tx.objectStore('resume').put(item);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Write failed'));
      tx.onabort = () => reject(tx.error ?? new Error('Write aborted'));
    });
  } finally { db.close(); }
}

export async function readWorkspaceSafe(): Promise<{ available: boolean; data?: WorkspaceData }> {
  try { return { available: true, data: await readWorkspace() }; }
  catch { return { available: false }; }
}
