
from pathlib import Path
from services.pdf_extractor import (
    extract_text_from_pdf,
    save_extracted_text,
)

project_root = Path(__file__).resolve().parent.parent
data_folder = project_root / "data"
output_folder = project_root / "processed_text"

pdf_files = sorted(data_folder.rglob("*.pdf"))

print(f"PDF files found: {len(pdf_files)}", flush=True)

for pdf_file in pdf_files:
    print(f"\nProcessing: {pdf_file.name}", flush=True)

    try:
        result = extract_text_from_pdf(
            str(pdf_file),
            use_ocr=False,
        )

        saved_file = save_extracted_text(
            result,
            str(output_folder),
        )

        pages_with_text = sum(
            bool(page["text"].strip())
            for page in result["pages"]
        )

        pages_needing_ocr = sum(
            page["method"] == "no_text"
            for page in result["pages"]
        )

        print(f"Total pages: {result['total_pages']}")
        print(f"Pages with extracted text: {pages_with_text}")
        print(f"Pages needing OCR: {pages_needing_ocr}")
        print(f"Saved to: {saved_file}")

    except Exception as error:
        print(f"ERROR processing {pdf_file.name}: {error}")

print("\nBatch extraction completed.", flush=True)
