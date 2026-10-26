
from pathlib import Path
import pymupdf
import easyocr


_ocr_reader = None


def get_ocr_reader():
    global _ocr_reader

    if _ocr_reader is None:
        _ocr_reader = easyocr.Reader(["en"], gpu=False)

    return _ocr_reader


def extract_text_from_pdf(
    pdf_path: str,
    use_ocr: bool = True,
) -> dict:
    """Extract PDF text, optionally using OCR for scanned pages."""
    file_path = Path(pdf_path)

    if not file_path.exists():
        raise FileNotFoundError(f"PDF not found: {file_path}")

    if file_path.suffix.lower() != ".pdf":
        raise ValueError("The supplied file must be a PDF.")

    pages = []

    with pymupdf.open(file_path) as pdf:
        for page_number, page in enumerate(pdf, start=1):
            text = page.get_text("text").strip()
            method = "text"

            if not text and use_ocr:
                pix = page.get_pixmap(
                    matrix=pymupdf.Matrix(1.5, 1.5),
                    alpha=False,
                )

                results = get_ocr_reader().readtext(
                    pix.tobytes("png"),
                    detail=0,
                )

                text = "\n".join(results).strip()
                method = "ocr"

            elif not text:
                method = "no_text"

            pages.append({
                "page": page_number,
                "text": text,
                "method": method,
            })

    return {
        "filename": file_path.name,
        "total_pages": len(pages),
        "pages": pages,
    }


def save_extracted_text(result: dict, output_folder: str) -> Path:
    """Save extracted text with page numbers for future citations."""
    output_path = Path(output_folder)
    output_path.mkdir(parents=True, exist_ok=True)

    text_file = output_path / f"{Path(result['filename']).stem}.txt"

    with text_file.open("w", encoding="utf-8") as file:
        file.write(f"Source document: {result['filename']}\n\n")

        for page in result["pages"]:
            file.write(f"\n--- Page {page['page']} ---\n")
            file.write(f"Extraction method: {page['method']}\n")
            file.write(page["text"])
            file.write("\n")

    return text_file
