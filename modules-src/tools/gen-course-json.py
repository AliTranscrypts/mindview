#!/usr/bin/env python3
"""Generate modules-src/courses/<course>/course.json from the module plans.

Usage: python3 modules-src/tools/gen-course-json.py [course ...]
Plans live outside the repo at /Users/ali/Desktop/MV/Modules/<course>/plan/modules/.
Keeps any "status" fields already present in an existing course.json.
"""
import json, re, sys
from pathlib import Path

PLANS = Path("/Users/ali/Desktop/MV/Modules")
OUT = Path(__file__).resolve().parent.parent / "courses"

COURSES = {
    "mhf4u": dict(site="mhf4u", code="MHF4U", title="Advanced Functions"),
    "mcv4u": dict(site="mcv4u", code="MCV4U", title="Calculus and Vectors"),
    "mdm4u": dict(site="mdm4u", code="MDM4U", title="Mathematics of Data Management"),
    "sbi4u": dict(site="sbi4u", code="SBI4U", title="Biology"),
    "sch4u": dict(site="sch4u", code="SCH4U", title="Chemistry"),
    "eng4u": dict(site="eng4u", code="ENG4U", title="English"),
    # Plans are written for HFA4U; the site's matching course is HFA4M.
    "hfa4u": dict(site="hfa4m", code="HFA4M", title="Nutrition and Health"),
}

def site_chapter(course, n, group_id):
    if course == "mhf4u":
        if group_id == "6-7":
            return 6 if n <= 42 else 7
        return int(group_id)
    if course == "mdm4u":
        for hi, ch in [(5, 1), (10, 2), (15, 3), (20, 4), (24, 5), (28, 6), (33, 7), (39, 8)]:
            if n <= hi:
                return ch
    if course == "sbi4u":
        return {"1": 2, "2": 2}.get(group_id, int(group_id))
    if course == "eng4u":
        if group_id == "1":
            return 1 if n <= 4 else 2
        return int(group_id) + 1
    return int(group_id)

def parse(course, path):
    lines = path.read_text().splitlines()
    m = re.match(r"#\s+(\d+)\.\s+(.*)", lines[0])
    nn, title = m.group(1).zfill(2), m.group(2).strip()
    head = lines[1]
    g = re.match(r"(Chapters?|Unit)\s+([\d–-]+):\s+(.*?)\s+·", head)
    label_word, gid_raw, gname = g.group(1), g.group(2), g.group(3).replace("*", "")
    gid = gid_raw.replace("–", "-")
    size = (re.search(r"Size:\s*([SML])", head) or [None, ""])[1]
    trivium = (re.search(r"Trivium:\s*(.*)$", head) or [None, None])[1]
    text = "\n".join(lines[:60])
    slug = re.search(r"File `\d+-(.+?)\.html`", text).group(1)
    p3 = re.search(r"Part 3 address `#([\w-]+)`", text)
    kind = "review" if ("Review module" in head or re.search(r"\breview\b", title, re.I)) else "topic"
    pre = re.search(r"\*\*Prerequisites:?\*\*:?(.*?)(\*\*Leads to|\n---)", "\n".join(lines[:120]), re.S)
    prereqs = []
    if pre:
        blk = re.sub(r"Grades?\s+\d+(\s*[–-]\s*\d+)?", "", pre.group(1))
        for x in re.findall(r"(?<![\w.])(\d{2})(?![\w.])", blk):
            if int(x) < int(nn) and x not in prereqs:
                prereqs.append(x)
    mod = dict(nn=nn, slug=slug, title=title, kind=kind, group=gid,
               siteChapter=site_chapter(course, int(nn), gid), size=size,
               part3=(p3.group(1) if p3 else None), prereqs=prereqs)
    if trivium:
        mod["trivium"] = trivium.strip()
    group = dict(id=gid, label=f"{label_word} {gid_raw}", name=gname)
    return mod, group

def build(course):
    meta = COURSES[course]
    files = sorted((PLANS / course / "plan" / "modules").glob("[0-9][0-9]-*.md"))
    mods, groups = [], {}
    for f in files:
        if f.name.endswith("-backport.md"):
            continue
        mod, grp = parse(course, f)
        mods.append(mod)
        groups.setdefault(grp["id"], grp)
    if course == "mhf4u":  # module 01 is the reference; its plan file is only the back-port
        mods.insert(0, dict(nn="01", slug="power-functions", title="Power Functions", kind="topic",
                            group="1", siteChapter=1, size="S", part3="symmetry", prereqs=[]))
    for m in mods:  # a review builds on every topic module in its chapter/unit
        if m["kind"] == "review":
            m["prereqs"] = [x["nn"] for x in mods if x["group"] == m["group"] and x["kind"] == "topic"]
    out = OUT / course / "course.json"
    old = {}
    if out.exists():
        old = {m["nn"]: m for m in json.loads(out.read_text()).get("modules", [])}
    for m in mods:
        if m["nn"] in old and "status" in old[m["nn"]]:
            m["status"] = old[m["nn"]]["status"]
    data = dict(course=course, site=meta["site"], code=meta["code"], title=meta["title"],
                groupLabel=("Unit" if list(groups.values())[0]["label"].startswith("Unit") else "Chapter"),
                groups=list(groups.values()), modules=mods)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n")
    return data

if __name__ == "__main__":
    for c in (sys.argv[1:] or COURSES):
        d = build(c)
        print(f"{c}: {len(d['modules'])} modules, {len(d['groups'])} groups, "
              f"reviews={sum(m['kind']=='review' for m in d['modules'])}, "
              f"siteChapters={sorted(set(m['siteChapter'] for m in d['modules']))}")
