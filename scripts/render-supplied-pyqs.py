#!/usr/bin/env python3
"""Render supplied, checksum-pinned PYQ PDFs locally (requires PyMuPDF)."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile

import fitz


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--manifest', type=Path, default=Path('docs/phases/10-derived-audit/UPLOAD-MANIFEST-2026-11-20.json'))
    args = parser.parse_args()
    files = json.loads(args.manifest.read_text())['files']
    # Validate every source before producing any output.
    for entry in files:
        source = args.input / entry['file']
        if hashlib.sha256(source.read_bytes()).hexdigest() != entry['sha256']:
            raise ValueError(f'Source checksum mismatch: {source}')
    args.output.mkdir(parents=True, exist_ok=True)
    records = []
    for entry in files:
        year = str(entry['year'])
        folder = args.output / year
        folder.mkdir(exist_ok=True)
        with fitz.open(args.input / entry['file']) as doc:
            if len(doc) != entry['pages'] or doc.needs_pass:
                raise ValueError(f'Unexpected PDF structure: {entry["file"]}')
            for index, page in enumerate(doc, 1):
                path = folder / f'JELET-{year}-pdf-page-{index:03d}.png'
                pix = page.get_pixmap(dpi=180, colorspace=fitz.csRGB, alpha=False)
                pix.save(str(path))
                # Decode the output to verify dimensions and successful PNG writing.
                check = fitz.Pixmap(str(path))
                assert (check.width, check.height) == (pix.width, pix.height)
                records.append({'year': int(year), 'pdfPage': index,
                                'image': path.relative_to(args.output).as_posix(),
                                'width': pix.width, 'height': pix.height,
                                'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                                'sourceSha256': entry['sha256']})
        print(f'{year}: {entry["pages"]} images generated and decoded', flush=True)
    (args.output / 'manifest.json').write_text(json.dumps(records, indent=2) + '\n')
    (args.output / 'README.txt').write_text(
        'JELET supplied PYQs — original PDF pages rendered at 180 DPI in RGB PNG.\n'
        '183 full-page images, grouped by year. No AI reconstruction or OCR.\n'
        'Names use 1-based PDF sheet numbers, NOT printed page or question numbers.\n'
        'Includes covers, instructions, rough-work pages and alternate streams.\n'
        'Repeated question numbers across streams must not be conflated.\n'
        'Rendering does not certify answers or repair source scan defects.\n'
        'manifest.json records image and source checksums.\n')
    for year in sorted({str(e['year']) for e in files}):
        with zipfile.ZipFile(args.output / f'JELET-{year}-page-images.zip', 'w', zipfile.ZIP_STORED) as archive:
            for path in sorted((args.output / year).glob('*.png')):
                archive.write(path, path.relative_to(args.output))
            archive.write(args.output / 'README.txt', 'README.txt')
    print(f'Total: {len(records)} verified images; seven year-wise ZIPs.', flush=True)


if __name__ == '__main__':
    main()
