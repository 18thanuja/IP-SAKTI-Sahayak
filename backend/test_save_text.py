
from pathlib import Path
from services.pdf_extractor import (
    extract_text_from_pdf,
    save_extracted_text,
)

project_root = Path(__file__).resolve().parent.parent

pdf_path = (
    project_root
    / "data"
    / "india"
    / "Patents_Act_1970.pdf"
)

output_folder = project_root / "processed_text"

print("Extracting PDF text...", flush=True)

result = extract_text_from_pdf(str(pdf_path))

saved_file = save_extracted_text(
    result,
    str(output_folder),
)

print("PDF:", result["filename"])
print("Pages:", result["total_pages"])
print("Saved text file:", saved_file)
print("File exists:", saved_file.exists())
print("Test completed!")
