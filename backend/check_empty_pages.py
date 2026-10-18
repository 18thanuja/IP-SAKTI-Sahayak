
from pathlib import Path
import pymupdf

project_root = Path(__file__).resolve().parent.parent
data_folder = project_root / "data"

for pdf_path in sorted(data_folder.rglob("*.pdf")):
    try:
        with pymupdf.open(pdf_path) as pdf:
            empty_pages = [
                page.number + 1
                for page in pdf
                if not page.get_text("text").strip()
            ]

        if empty_pages:
            print(f"\n{pdf_path.name}")
            print(f"Pages without extractable text: {empty_pages}")
        else:
            print(f"\n{pdf_path.name}: All pages contain extractable text")

    except Exception as error:
        print(f"\n{pdf_path.name}: ERROR - {error}")
