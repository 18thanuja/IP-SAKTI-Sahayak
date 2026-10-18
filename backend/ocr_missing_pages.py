
from pathlib import Path
import pymupdf
from services.pdf_extractor import (
    get_ocr_reader,
    save_extracted_text,
)

project_root = Path(__file__).resolve().parent.parent
data_folder = project_root / "data"
output_folder = project_root / "processed_text"

ocr_reader = get_ocr_reader()

pdf_files = sorted(data_folder.rglob("*.pdf"))

for pdf_file in pdf_files:
    pages_to_ocr = []

    with pymupdf.open(pdf_file) as pdf:
        for page_number, page in enumerate(pdf, start=1):
            if not page.get_text("text").strip():
                pages_to_ocr.append(page_number)

        if not pages_to_ocr:
            continue

        print(f"\nProcessing: {pdf_file.name}", flush=True)

        text_file = (
            output_folder / f"{pdf_file.stem}.txt"
        )

        existing_text = {}

        if text_file.exists():
            content = text_file.read_text(
                encoding="utf-8"
            ).splitlines()

            current_page = None
            current_lines = []

            for line in content:
                if line.startswith("--- Page ") and line.endswith(" ---"):
                    if current_page is not None:
                        existing_text[current_page] = "\n".join(current_lines).strip()

                    current_page = int(
                        line.replace("--- Page ", "").replace(" ---", "")
                    )
                    current_lines = []
                elif line.startswith("Extraction method: "):
                    continue
                else:
                    current_lines.append(line)

            if current_page is not None:
                existing_text[current_page] = "\n".join(current_lines).strip()

        for page_number in pages_to_ocr:
            page = pdf[page_number - 1]

            pix = page.get_pixmap(
                matrix=pymupdf.Matrix(1.5, 1.5),
                alpha=False,
            )

            results = ocr_reader.readtext(
                pix.tobytes("png"),
                detail=0,
            )

            ocr_text = "\n".join(results).strip()

            existing_text[page_number] = ocr_text

            print(
                f"  OCR completed: page {page_number}",
                flush=True,
            )

        with text_file.open("w", encoding="utf-8") as file:
            file.write(f"Source document: {pdf_file.name}\n\n")

            for page_number in range(1, len(pdf) + 1):
                page_text = existing_text.get(page_number, "")

                method = (
                    "ocr"
                    if page_number in pages_to_ocr
                    else "text"
                )

                file.write(f"--- Page {page_number} ---\n")
                file.write(f"Extraction method: {method}\n")
                file.write(page_text)
                file.write("\n\n")

        print(f"Saved updated text: {text_file}", flush=True)

print("\nOCR processing completed.", flush=True)
