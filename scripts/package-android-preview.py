"""Wrap the built pilot in its Pages subpath for an on-phone static preview.

Regenerate after each build; the tracked device-test snapshot lives under
docs/phases/03-library/device-test/. This file is also a watched rebuild path.
"""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
base = 'Jelet-ultimate-prep'
required = {
    'index.html', 'learn/index.html', 'learn/parallel-circuits/index.html', 'parallel-circuit.svg',
    'practice/index.html', 'practice/orig-parallel-independent-v1/index.html',
    'search/index.html', 'search-index.json', 'workspace/index.html',
}
output = root / 'downloads' / 'jelet-android-preview.zip'


def package():
    if not dist.is_dir():
        raise SystemExit('Run npm run build before packaging the Android preview.')
    files = []
    for path in sorted(dist.rglob('*')):
        rel = path.relative_to(dist)
        if path.is_symlink():
            raise SystemExit(f'No symlinks allowed in public output: {rel}')
        if path.is_dir():
            continue
        if rel.as_posix() not in required and not (
            len(rel.parts) == 2 and rel.parts[0] == '_astro'
            and not rel.name.startswith('.') and rel.suffix in {'.js', '.css'}
        ):
            raise SystemExit(f'Unexpected file in public output: {rel}')
        files.append((rel.as_posix(), path))
    missing = required - {rel for rel, _ in files}
    if missing:
        raise SystemExit(f'Missing public files: {", ".join(sorted(missing))}')

    output.parent.mkdir(exist_ok=True)
    with ZipFile(output, 'w') as bundle:
        for rel, path in files:
            entry = ZipInfo(f'{base}/{rel}')
            entry.external_attr = 0o100644 << 16
            bundle.writestr(entry, path.read_bytes(), compress_type=ZIP_DEFLATED)
    print(f'{output.relative_to(root)}: {len(files)} files, {output.stat().st_size} bytes')


if __name__ == '__main__':
    package()
