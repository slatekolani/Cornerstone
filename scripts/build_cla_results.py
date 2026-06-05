from __future__ import annotations

import html
import json
import re
import shutil
import unicodedata
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

import openpyxl
from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import white
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path("/Users/os/Downloads")
WORKBOOK = DOWNLOADS / "CLA LIST 2026 FOR WEB.xlsx"
PASSED_TEMPLATE = DOWNLOADS / "Passed Student Document.pdf"
REJECTED_TEMPLATE = DOWNLOADS / "REJECTED Student.pdf"
RESULTS_DIR = ROOT / "public" / "results-2026"
LETTERS_DIR = RESULTS_DIR / "letters"
COMBINATION_OVERRIDES = {
    "SELEMAN ALLY NASSORO": "HKL",
}


@dataclass(frozen=True)
class Applicant:
    gender: str
    region: str
    sn: int
    name: str
    combination: str
    passed: bool
    filename: str


def slugify(value: str) -> str:
    ascii_value = (
        unicodedata.normalize("NFKD", value)
        .encode("ascii", "ignore")
        .decode("ascii")
    )
    normalized = re.sub(r"[^A-Za-z0-9]+", "-", ascii_value.strip().lower())
    return normalized.strip("-") or "student"


def cell_is_yellow(cell) -> bool:
    color = cell.fill.fgColor
    rgb = color.rgb
    return isinstance(rgb, str) and rgb.upper() == "FFFFFF00"


def row_is_rejected(row) -> bool:
    return any(cell_is_yellow(cell) for cell in row)


def read_applicants() -> list[Applicant]:
    workbook = openpyxl.load_workbook(WORKBOOK, data_only=True)
    applicants: list[Applicant] = []

    for sheet_name in ["BOYS", "GIRLS"]:
        ws = workbook[sheet_name]
        gender = "Boys" if sheet_name == "BOYS" else "Girls"
        region = ""
        used_filenames: set[str] = set()

        for row in ws.iter_rows(min_row=3):
            region_value = row[1].value
            name_value = row[4].value
            combination_value = row[5].value

            if region_value:
                region = str(region_value).strip()

            if not name_value or not combination_value:
                continue

            name = " ".join(str(name_value).split())
            combination = " ".join(str(combination_value).split())
            combination = COMBINATION_OVERRIDES.get(name, combination)
            sn = int(row[3].value or len(applicants) + 1)
            passed = not row_is_rejected(row)

            base = slugify(name)
            filename = f"{base}.pdf"
            if filename in used_filenames:
                filename = f"{base}-{sheet_name.lower()}-{sn}.pdf"
            used_filenames.add(filename)

            applicants.append(
                Applicant(
                    gender=gender,
                    region=region,
                    sn=sn,
                    name=name,
                    combination=combination,
                    passed=passed,
                    filename=filename if passed else "rejected-student.pdf",
                )
            )

    return applicants


def overlay_pdf(template_path: Path, output_path: Path, name: str, combination: str) -> None:
    reader = PdfReader(str(template_path))
    first_page = reader.pages[0]
    width = float(first_page.mediabox.width)
    height = float(first_page.mediabox.height)

    packet = BytesIO()
    c = canvas.Canvas(packet, pagesize=(width, height))
    c.setFont("Helvetica", 10)

    c.setFillColor(white)
    c.rect(31, 604, 170, 13, fill=1, stroke=0)
    c.setFillColorRGB(0, 0, 0)
    c.drawString(34, 607.5, name)

    c.setFillColor(white)
    c.rect(323, 491.1, 205, 12, fill=1, stroke=0)
    c.setFillColorRGB(0, 0, 0)
    c.setFont("Times-Roman", 10)
    c.drawString(331, 493.9, combination)
    c.drawString(331 + stringWidth(combination, "Times-Roman", 10) + 14, 493.9, "and it will not be changed.")
    c.save()

    packet.seek(0)
    overlay = PdfReader(packet).pages[0]
    first_page.merge_page(overlay)

    writer = PdfWriter()
    for index, page in enumerate(reader.pages):
        writer.add_page(first_page if index == 0 else page)

    with output_path.open("wb") as file:
        writer.write(file)


def build_index(applicants: list[Applicant]) -> None:
    total = len(applicants)
    passed = sum(1 for applicant in applicants if applicant.passed)
    rejected = total - passed

    def row(applicant: Applicant) -> str:
        status = "Passed" if applicant.passed else "Not selected"
        status_class = "passed" if applicant.passed else "rejected"
        filename = html.escape(applicant.filename)
        return f"""
            <tr data-status="{status_class}" data-search="{html.escape(applicant.name.lower())} {html.escape(applicant.region.lower())} {html.escape(applicant.gender.lower())}">
                <td class="name">{html.escape(applicant.name)}</td>
                <td><span class="pill {status_class}">{status}</span></td>
                <td class="actions">
                    <a href="letters/{filename}" target="_blank" rel="noopener">View</a>
                    <a href="letters/{filename}" download>Download</a>
                </td>
            </tr>
        """

    rows = "\n".join(row(applicant) for applicant in applicants)
    html_text = f"""<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CLA Practical Interview Results 2026</title>
    <style>
        * {{ box-sizing: border-box; }}
        body {{ margin: 0; font-family: Inter, Arial, sans-serif; background: #f6f8fb; color: #17233c; }}
        .site-nav {{ background: #0d2b6e; color: white; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 24px rgba(13, 43, 110, 0.18); }}
        .nav-inner {{ max-width: 1180px; margin: 0 auto; padding: 13px 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px; }}
        .brand {{ display: flex; align-items: center; gap: 10px; color: white; text-decoration: none; }}
        .brand img {{ width: auto; height: 48px; object-fit: contain; }}
        .brand-title {{ font-family: Georgia, serif; font-weight: 700; line-height: 1.2; }}
        .brand-subtitle {{ color: #e8d5a8; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; }}
        .nav-links {{ display: flex; align-items: center; gap: 18px; flex-wrap: wrap; justify-content: flex-end; }}
        .nav-links a {{ color: rgba(255, 255, 255, .82); font-size: 14px; font-weight: 700; text-decoration: none; }}
        .nav-links a:hover {{ color: #e8d5a8; }}
        header {{ background: linear-gradient(135deg, #0d2b6e, #1a4a9e); color: white; padding: 46px 20px 38px; }}
        .wrap {{ max-width: 1180px; margin: 0 auto; }}
        h1 {{ margin: 0 0 10px; font-family: Georgia, serif; font-size: clamp(28px, 4vw, 44px); }}
        p {{ margin: 0; line-height: 1.6; }}
        .summary {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin: 22px 0; }}
        .card {{ background: white; border: 1px solid #e7ecf4; border-radius: 8px; padding: 18px; }}
        .metric {{ display: block; font-size: 30px; font-weight: 800; color: #0d2b6e; }}
        .tools {{ display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 20px 0; }}
        input, select {{ border: 1px solid #cfd7e6; border-radius: 6px; padding: 11px 12px; font-size: 15px; background: white; }}
        input {{ flex: 1; min-width: 240px; }}
        table {{ width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 28px rgba(13, 43, 110, 0.08); }}
        th, td {{ text-align: left; padding: 12px 14px; border-bottom: 1px solid #edf1f7; font-size: 14px; vertical-align: middle; }}
        th {{ background: #102f75; color: white; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }}
        tr:hover td {{ background: #f8fbff; }}
        a {{ color: #0d2b6e; font-weight: 700; text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
        .name {{ font-weight: 700; color: #0d2b6e; }}
        .actions {{ display: flex; gap: 10px; flex-wrap: wrap; }}
        .actions a {{ display: inline-flex; align-items: center; justify-content: center; min-height: 34px; padding: 8px 12px; border-radius: 6px; background: #eef4ff; }}
        .actions a:first-child {{ background: #0d2b6e; color: white; }}
        .pill {{ display: inline-block; border-radius: 999px; padding: 5px 10px; font-size: 12px; font-weight: 800; white-space: nowrap; }}
        .pill.passed {{ background: #dcfce7; color: #166534; }}
        .pill.rejected {{ background: #fee2e2; color: #991b1b; }}
        .note {{ margin: 22px 0 32px; color: #526079; }}
        .site-footer {{ background: linear-gradient(180deg, #0a1f52 0%, #06122e 100%); color: white; margin-top: 54px; padding: 48px 20px 28px; }}
        .footer-grid {{ display: grid; grid-template-columns: minmax(220px, 2fr) repeat(2, minmax(180px, 1fr)); gap: 32px; padding-bottom: 34px; border-bottom: 1px solid rgba(255, 255, 255, .12); }}
        .footer-logo {{ display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }}
        .footer-logo img {{ height: 52px; width: auto; object-fit: contain; }}
        .footer-title {{ font-family: Georgia, serif; font-weight: 700; }}
        .footer-kicker {{ color: #e8d5a8; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; }}
        .footer-copy {{ color: rgba(255, 255, 255, .58); line-height: 1.7; max-width: 340px; font-size: 14px; }}
        .footer-heading {{ margin: 0 0 14px; color: white; font-size: 13px; text-transform: uppercase; letter-spacing: .1em; }}
        .footer-list {{ list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }}
        .footer-list a, .footer-list span {{ color: rgba(255, 255, 255, .58); font-size: 14px; text-decoration: none; }}
        .footer-list a:hover {{ color: #e8d5a8; }}
        .footer-bottom {{ display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; padding-top: 22px; color: rgba(255, 255, 255, .38); font-size: 13px; }}
        @media (max-width: 760px) {{
            .nav-inner {{ align-items: flex-start; flex-direction: column; }}
            .nav-links {{ justify-content: flex-start; gap: 13px; }}
            .brand img {{ height: 42px; }}
            table, thead, tbody, th, td, tr {{ display: block; }}
            thead {{ display: none; }}
            tr {{ margin-bottom: 12px; border: 1px solid #e7ecf4; border-radius: 8px; overflow: hidden; background: white; }}
            td {{ display: flex; justify-content: space-between; gap: 18px; align-items: center; }}
            td.actions {{ justify-content: flex-end; }}
            td::before {{ content: attr(data-label); font-weight: 800; color: #526079; }}
            td.actions::before {{ display: none; }}
            .footer-grid {{ grid-template-columns: 1fr; }}
        }}
    </style>
</head>
<body>
    <nav class="site-nav" aria-label="Main navigation">
        <div class="nav-inner">
            <a class="brand" href="/">
                <img src="/Logo/CLA_Tanzania_logo_color.gif" alt="CLA Tanzania Logo">
                <span>
                    <span class="brand-title">Cornerstone Leadership</span><br>
                    <span class="brand-subtitle">Academy Tanzania</span>
                </span>
            </a>
            <div class="nav-links">
                <a href="/#about">About</a>
                <a href="/#programs">Programs</a>
                <a href="/#admissions">Admissions</a>
                <a href="/results-2026/">Results</a>
                <a href="/#contact">Contact</a>
            </div>
        </div>
    </nav>
    <header>
        <div class="wrap">
            <h1>CLA Practical Interview Results 2026</h1>
            <p>Admission letters are available for successful applicants. Applicants not selected share the general result letter.</p>
        </div>
    </header>
    <main class="wrap" style="padding: 24px 20px 12px;">
        <section class="summary" aria-label="Result summary">
            <div class="card"><span class="metric">{total}</span>Total applicants</div>
            <div class="card"><span class="metric">{passed}</span>Admission letters</div>
            <div class="card"><span class="metric">{rejected}</span>General result letters</div>
        </section>
        <div class="tools">
            <input id="search" type="search" placeholder="Search name" aria-label="Search applicants">
            <select id="status" aria-label="Filter by status">
                <option value="all">All results</option>
                <option value="passed">Passed only</option>
                <option value="rejected">Not selected only</option>
            </select>
        </div>
        <p class="note">Use the action column to view the letter in your browser or download a copy.</p>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="rows">
                {rows}
            </tbody>
        </table>
    </main>
    <footer class="site-footer">
        <div class="wrap">
            <div class="footer-grid">
                <div>
                    <div class="footer-logo">
                        <img src="/Logo/CLA_Tanzania_logo_color.gif" alt="CLA Tanzania Logo">
                        <div>
                            <div class="footer-title">Cornerstone Leadership Academy</div>
                            <div class="footer-kicker">Tanzania</div>
                        </div>
                    </div>
                    <p class="footer-copy">Transforming brilliant young Tanzanians into Africa's next generation of visionary leaders through scholarship, character, and service.</p>
                </div>
                <div>
                    <h2 class="footer-heading">Quick Links</h2>
                    <ul class="footer-list">
                        <li><a href="/">Home</a></li>
                        <li><a href="/#admissions">Admissions</a></li>
                        <li><a href="/results-2026/">Results</a></li>
                        <li><a href="/#contact">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h2 class="footer-heading">Contact</h2>
                    <ul class="footer-list">
                        <li><span>Plot #2773, Lenjani Village, Arusha</span></li>
                        <li><span>+255 743 720 672</span></li>
                        <li><span>+255 620 301 954</span></li>
                        <li><span>headmaster@cornerstoneschooltanzania.ac.tz</span></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <span>© 2026 Cornerstone Leadership Academy Tanzania.</span>
                <span>Part of Cornerstone Development Africa.</span>
            </div>
        </div>
    </footer>
    <script>
        const search = document.getElementById('search');
        const status = document.getElementById('status');
        const rows = Array.from(document.querySelectorAll('tbody tr'));
        document.querySelectorAll('tbody tr').forEach(row => {{
            Array.from(row.children).forEach((cell, index) => {{
                cell.dataset.label = ['Name', 'Status', 'Action'][index];
            }});
        }});
        function filterRows() {{
            const q = search.value.trim().toLowerCase();
            const selected = status.value;
            rows.forEach(row => {{
                const matchesSearch = !q || row.dataset.search.includes(q);
                const matchesStatus = selected === 'all' || row.dataset.status === selected;
                row.style.display = matchesSearch && matchesStatus ? '' : 'none';
            }});
        }}
        search.addEventListener('input', filterRows);
        status.addEventListener('change', filterRows);
    </script>
</body>
</html>
"""
    redirect_text = """<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=/?view=results-2026">
    <title>CLA Practical Interview Results 2026</title>
    <script>window.location.replace('/?view=results-2026');</script>
</head>
<body>
    <p><a href="/?view=results-2026">View CLA Practical Interview Results 2026</a></p>
</body>
</html>
"""
    (RESULTS_DIR / "index.html").write_text(redirect_text, encoding="utf-8")


def main() -> None:
    applicants = read_applicants()
    if RESULTS_DIR.exists():
        shutil.rmtree(RESULTS_DIR)
    LETTERS_DIR.mkdir(parents=True, exist_ok=True)

    shutil.copyfile(REJECTED_TEMPLATE, LETTERS_DIR / "rejected-student.pdf")

    for applicant in applicants:
        if applicant.passed:
            overlay_pdf(PASSED_TEMPLATE, LETTERS_DIR / applicant.filename, applicant.name, applicant.combination)

    build_index(applicants)
    manifest = {
        "total": len(applicants),
        "passed": sum(1 for applicant in applicants if applicant.passed),
        "rejected": sum(1 for applicant in applicants if not applicant.passed),
        "applicants": [applicant.__dict__ for applicant in applicants],
    }
    (RESULTS_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps({key: manifest[key] for key in ["total", "passed", "rejected"]}, indent=2))


if __name__ == "__main__":
    main()
