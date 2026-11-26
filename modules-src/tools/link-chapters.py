#!/usr/bin/env python3
"""Write the "Interactive modules" block into each chapter page.

Usage: python3 modules-src/tools/link-chapters.py [course ...]   (default: all courses)

For every course in modules-src/courses/<course>/course.json, each chapter page
courses/<site>/ch<N>.html gets a block listing the modules mapped to that chapter
(module "siteChapter") whose status is built/live and whose page courses/<site>/modules/NN-slug.html exists.

The block sits between <!-- mv-modules:start --> and <!-- mv-modules:end -->,
directly after the chapter's unit header (before the first topic), so it never disturbs the
locked order (hero → topics → AS/FOR/OF strip → prev/next). Re-running replaces it;
a chapter with no built modules gets no block. Idempotent.
"""
import html, json, re, sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "modules-src" / "courses"
START, END = "<!-- mv-modules:start -->", "<!-- mv-modules:end -->"
BLOCK_RE = re.compile(r"[ \t]*" + re.escape(START) + r".*?" + re.escape(END) + r"\n?", re.S)
HOURS = {"S": "≈ 2 h", "M": "≈ 3 h", "L": "≈ 4 h"}


def card(m):
    tag = "Review" if m["kind"] == "review" else "Module"
    size = HOURS.get(m.get("size") or "", "")
    meta = f'{tag} {m["nn"]}' + (f" · {size}" if size else "")
    return (
        f'<a class="mv-module-card" href="modules/{m["nn"]}-{m["slug"]}.html" '
        'style="display:block;background:#fff;border:1px solid #c7d2fe;border-left:5px solid #4f46e5;'
        'border-radius:10px;padding:12px 14px;text-decoration:none;color:#1e1b4b;">'
        f'<div style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#4f46e5;">{html.escape(meta)}</div>'
        f'<div style="font-size:15px;font-weight:700;margin-top:4px;line-height:1.3;">{html.escape(m["title"])}</div>'
        "</a>"
    )


def block(course, mods, indent):
    cards = "\n".join(f"{indent}        {card(m)}" for m in mods)
    n = len(mods)
    return (
        f"{indent}{START}\n"
        f'{indent}<div class="mv-modules" style="margin:4px 0 28px;padding:18px 18px 16px;'
        'background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:1px solid #c7d2fe;border-radius:12px;">\n'
        f'{indent}    <div style="display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 16px;margin-bottom:12px;">\n'
        f'{indent}        <div style="font-size:13px;font-weight:800;color:#1e1b4b;text-transform:uppercase;letter-spacing:1.5px;">'
        f'🧩 Interactive Modules ({n})</div>\n'
        f'{indent}        <a href="modules/index.html" style="font-size:13px;font-weight:700;color:#4338ca;text-decoration:none;">'
        f'All {html.escape(course["code"])} modules &amp; your progress →</a>\n'
        f"{indent}    </div>\n"
        f'{indent}    <p style="font-size:13.5px;color:#3730a3;margin:0 0 12px;line-height:1.5;">'
        "Self-paced lessons you explore, practise and check yourself in. "
        "Your work saves in this browser as you go.</p>\n"
        f'{indent}    <div class="mv-modules-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;">\n'
        f"{cards}\n"
        f"{indent}    </div>\n"
        f"{indent}</div>\n"
        f"{indent}{END}\n"
    )


def anchor(text, page):
    """Insertion point just after the chapter's unit-header block (every course's chapter pages
    have one: title, subtitle, meta), so the modules block is the first thing under the header.
    Returns (offset of the line to insert before, indentation to use)."""
    at = text.find('<div class="unit-header"')
    if at < 0:
        raise SystemExit(f"{page}: no unit-header to anchor the modules block")
    line_start = text.rfind("\n", 0, at) + 1
    indent = text[line_start:at]
    depth, i = 0, at
    tag = re.compile(r"<div\b|</div>")
    for m in tag.finditer(text, at):
        depth += 1 if m.group(0) != "</div>" else -1
        if depth == 0:
            i = m.end()
            break
    else:
        raise SystemExit(f"{page}: unbalanced unit-header block")
    nl = text.find("\n", i)
    return (nl + 1 if nl >= 0 else len(text)), indent


def link_course(name):
    course = json.loads((SRC / name / "course.json").read_text())
    site = course["site"]
    changed = []
    chapters = sorted({m["siteChapter"] for m in course["modules"]})
    for ch in chapters:
        page = REPO / "courses" / site / f"ch{ch}.html"
        text = page.read_text()
        base = BLOCK_RE.sub("", text)
        mods = [m for m in course["modules"] if m["siteChapter"] == ch
                and m.get("status") in ("built", "live")
                and (REPO / "courses" / site / "modules" / f'{m["nn"]}-{m["slug"]}.html').exists()]
        if mods:
            line_start, indent = anchor(base, page)
            new = base[:line_start] + block(course, mods, indent) + base[line_start:]
        else:
            new = base
        if new != text:
            page.write_text(new)
            changed.append(f"ch{ch}({len(mods)})")
    print(f"{name} → courses/{site}: " + (", ".join(changed) if changed else "no changes"))


if __name__ == "__main__":
    names = sys.argv[1:] or sorted(p.name for p in SRC.iterdir() if (p / "course.json").exists())
    for n in names:
        link_course(n)
