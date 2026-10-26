
from pathlib import Path
import pymupdf

project_root = Path(__file__).resolve().parent.parent
data_folder = project_root / "data"

pdf_files = sorted(data_folder.rglob("*.pdf"))

for pdf_file in pdf_files:
    empty_pages = []

    with pymupdf.open(pdf_file) as pdf:
        for page_number, page in enumerate(pdf, start=1):
            if not page.get_text("text").strip():
                empty_pages.append(page_number)

    if empty_pages:
        print(f"\n{pdf_file.name}")
        print(f"Pages needing OCR: {empty_pages}")

print("\nOCR page list completed.")
