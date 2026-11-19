/**
 * Prepare the shared libraries that headless Chromium needs.
 *
 * The pinned `@sparticuz/chromium` package ships an Amazon Linux 2023
 * library bundle. On a machine that already has libnss/libnspr the browser
 * runs as-is; on a slim CI image it does not, and the browser dies with
 * "libnspr4.so: cannot open shared object file".
 *
 * This module extracts that bundle into the OS temp directory and points
 * LD_LIBRARY_PATH at it, but only when the libraries are genuinely missing.
 * It never downloads anything: everything comes from node_modules.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliDecompressSync } from 'node:zlib';

const here = dirname(fileURLToPath(import.meta.url));

/** A shared library is usable when the loader can already find it. */
function loaderFinds(name) {
  try {
    const output = execFileSync('ldconfig', ['-p'], { encoding: 'utf8' });
    return output.includes(name);
  } catch {
    return false;
  }
}

/** Extract the brotli-compressed tar bundle that ships with the package. */
function inflateBundle(bundlePath, targetDir) {
  const tar = brotliDecompressSync(readFileSync(bundlePath));
  mkdirSync(targetDir, { recursive: true });
  const tarPath = join(targetDir, 'bundle.tar');
  writeFileSync(tarPath, tar);
  execFileSync('tar', ['-xf', tarPath, '-C', targetDir], { stdio: 'ignore' });
  rmSync(tarPath, { force: true });
}

/**
 * @returns {string|undefined} the directory added to LD_LIBRARY_PATH,
 * or undefined when the system libraries are already usable.
 */
export function prepareChromiumLibraries() {
  if (process.env.JELET_SKIP_CHROMIUM_LIBS === '1') return undefined;
  if (loaderFinds('libnspr4.so')) return undefined;

  const bundle = resolve(here, '../node_modules/@sparticuz/chromium/bin/al2023.tar.br');
  if (!existsSync(bundle)) return undefined;

  const target = join(tmpdir(), 'jelet-chromium-libs');
  const libDir = join(target, 'lib');
  if (!existsSync(libDir) || readdirSync(libDir).length === 0) {
    mkdirSync(target, { recursive: true });
    inflateBundle(bundle, target);
  }
  if (!existsSync(join(libDir, 'libnspr4.so'))) return undefined;

  const current = process.env.LD_LIBRARY_PATH;
  process.env.LD_LIBRARY_PATH = current ? `${libDir}:${current}` : libDir;
  return libDir;
}
