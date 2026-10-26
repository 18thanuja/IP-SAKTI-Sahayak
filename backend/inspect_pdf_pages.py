
from pathlib import Path
import pymupdf

project_root = Path(__file__).resolve().parent.parent
data_folder = project_root / "data"

pages_to_check = {
    "Patents_Rules_2003.pdf": [152, 153, 177, 181, 191, 196],
    "Trade_Marks_Act_1999.pdf": [1, 2],
    "WHO_Global_Traditional_Medicine_Strategy_2025_2034.pdf": [2, 37],
}

for filename, page_numbers in pages_to_check.items():
    pdf_path = next(data_folder.rglob(filename), None)

    if pdf_path is None:
        print(f"\nPDF not found: {filename}")
        continue

    print(f"\n--- {filename} ---")

    with pymupdf.open(pdf_path) as pdf:
        for page_number in page_numbers:
            page = pdf[page_number - 1]
            text = page.get_text("text").strip()
            images = page.get_images(full=True)

            print(
                f"Page {page_number}: "
                f"text characters={len(text)}, "
                f"images={len(images)}, "
                f"page size={page.rect.width:.0f}x{page.rect.height:.0f}"
            )
