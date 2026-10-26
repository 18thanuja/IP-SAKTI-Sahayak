from pathlib import Path
from services.pdf_extractor import extract_text_from_pdf

project_root = Path(__file__).resolve().parent.parent
data_folder = project_root / "data"

pdf_files = sorted(data_folder.rglob("*.pdf"))

print("PDF files found:", len(pdf_files))
print("-" * 60)

for pdf_file in pdf_files:
    try:
        result = extract_text_from_pdf(str(pdf_file))

        text_pages = sum(
            bool(page["text"].strip())
            for page in result["pages"]
        )

        ocr_pages = sum(
            page["method"] == "ocr"
            for page in result["pages"]
        )

        print(f"\nPDF: {result['filename']}")
        print(f"Total pages: {result['total_pages']}")
        print(f"Pages with text: {text_pages}")
        print(f"OCR pages: {ocr_pages}")

    except Exception as error:
        print(f"\nERROR: {pdf_file.name}")
        print(error)

print("\nAll PDF tests completed.")