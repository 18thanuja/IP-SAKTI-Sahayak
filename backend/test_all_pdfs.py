
from pathlib import Path
import pymupdf

project_root = Path(__file__).resolve().parent.parent
data_folder = project_root / "data"

pdf_files = list(data_folder.rglob("*.pdf"))

print(f"Total PDF files found: {len(pdf_files)}\n")

for pdf_path in pdf_files:
    try:
        with pymupdf.open(pdf_path) as pdf:
            total_pages = len(pdf)
            extracted_pages = sum(
                1 for page in pdf
                if page.get_text("text").strip()
            )

        print(f"File: {pdf_path.name}")
        print(f"Pages: {total_pages}")
        print(f"Pages with text: {extracted_pages}")
        print("Status: Text extraction checked\n")

    except Exception as error:
        print(f"File: {pdf_path.name}")
        print(f"Status: FAILED - {error}\n")
