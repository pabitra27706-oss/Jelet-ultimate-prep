"""Check the 01.1 inventory tables and local Markdown link targets (stdlib only)."""

import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urlsplit


PHASE = Path(__file__).resolve().parent
SUBJECTS = {
    "Mathematics": ("mathematics", ["23"] * 5 + ["23–24"] + ["24"] * 5),
    "Physics": ("physics", ["25"] * 14 + ["26"]),
    "Chemistry": ("chemistry", ["27"] * 7 + ["27–28"]),
    "Fundamentals of Electrical & Electronics Engineering": (
        "electrical-and-electronics", ["28"] * 8
    ),
}


def check_tables(text):
    subject = None
    ids, rows, status_counts = Counter(), Counter(), Counter()
    errors = []
    for line_no, line in enumerate(text.splitlines(), 1):
        if line.startswith("## "):
            subject = line[3:]
        if subject not in SUBJECTS or not line.startswith("|"):
            continue
        if line.startswith(("| Official row |", "| --- |")):
            continue
        rows[subject] += 1
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) != 8 or not all(cells):
            errors.append(f"line {line_no}: expected eight nonempty cells")
            continue
        letter, _, page, topic_id, _, *statuses = cells
        ids[topic_id] += 1
        slug, pages = SUBJECTS[subject]
        i = rows[subject] - 1
        if i >= len(pages) or (letter, page, topic_id) != (
            chr(ord("A") + i), pages[i], f"`jelet-syllabus:{slug}:t{i + 1:02}`"
        ):
            errors.append(f"line {line_no}: unexpected Appendix row, page or ID")
        for kind, status in zip(("lessons", "figures", "practice"), statuses):
            if not re.fullmatch(r"[MGN](?: — .+)?", status) or status == "M":
                errors.append(f"line {line_no}: invalid {kind} status/evidence")
            status_counts[kind, status[0]] += 1
    for topic_id, count in ids.items():
        if count > 1:
            errors.append(f"duplicate ID: {topic_id}")
    for name, (_, pages) in SUBJECTS.items():
        if rows[name] != len(pages):
            errors.append(f"{name}: found {rows[name]} rows, expected {len(pages)}")
    return errors, rows, status_counts


def check_links(paths):
    errors, count = [], 0
    for path in paths:
        # In-scope documents use inline Markdown links without nested destinations.
        for dest in re.findall(r"\]\(([^)\s]+)\)", path.read_text(encoding="utf-8")):
            url = urlsplit(dest)
            if url.scheme or url.netloc:
                continue
            count += 1
            target = path.parent / unquote(url.path) if url.path else path
            if not target.exists():
                errors.append(f"{path.name}: missing target {dest}")
            elif url.fragment:
                errors.append(f"{path.name}: local fragment not supported by this check: {dest}")
    return errors, count


def main():
    inventory = PHASE / "inventory.md"
    errors, rows, statuses = check_tables(inventory.read_text(encoding="utf-8"))
    linked_docs = (inventory, PHASE / "2026-11-19-01.1.md", PHASE.parent.parent / "ROADMAP.md")
    link_errors, count = check_links(linked_docs)
    errors.extend(link_errors)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"PASS: {sum(rows.values())} rows, unique IDs and all required fields; {count} local link targets")
    for kind in ("lessons", "figures", "practice"):
        print(f"{kind}: " + ", ".join(f"{status}={statuses[kind, status]}" for status in "MGN"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
