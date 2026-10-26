from pathlib import Path
import pymupdf
import easyocr

project_root = Path(__file__).resolve().parent.parent

pdf_path = (
    project_root
    / "data"
    / "india"
    / "Trade_Marks_Act_1999.pdf"
)

print("Loading OCR model...", flush=True)
reader = easyocr.Reader(["en"], gpu=False)

print("Opening PDF...", flush=True)

with pymupdf.open(pdf_path) as pdf:
    for page_number in [1, 2]:
        page = pdf[page_number - 1]

        print(f"Processing page {page_number}...", flush=True)

        pix = page.get_pixmap(
            matrix=pymupdf.Matrix(1.5, 1.5),
            alpha=False,
        )

        image_bytes = pix.tobytes("png")
        results = reader.readtext(image_bytes, detail=0)

        print(f"\n--- PAGE {page_number} ---")
        print("\n".join(results)[:1000])

print("\nOCR test completed.")