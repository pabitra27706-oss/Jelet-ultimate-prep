import { buildLibraryIndex } from '../library';

export async function GET() {
  const entries = await buildLibraryIndex();
  return new Response(JSON.stringify({ version: 1, entries }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
