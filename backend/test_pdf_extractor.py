
from pathlib import Path
from services.pdf_extractor import extract_text_from_pdf

project_root = Path(__file__).resolve().parent.parent

pdf_path = (
    project_root
    / "data"
    / "india"
    / "Patents_Act_1970.pdf"
)

result = extract_text_from_pdf(str(pdf_path))

print("PDF:", result["filename"])
print("Total pages:", result["total_pages"])

for page in result["pages"][:2]:
    print(f"\n--- Page {page['page']} ---")
    print(page["text"][:1000])
