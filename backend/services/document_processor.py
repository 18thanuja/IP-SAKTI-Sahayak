
from pathlib import Path
from services.text_chunker import chunk_text


def load_document_pages(text_file: Path) -> list[dict]:
    """Load extracted text while preserving original page numbers."""
    content = text_file.read_text(encoding="utf-8")

    pages = []
    current_page = None
    current_method = "text"
    current_lines = []

    def save_current_page():
        if current_page is not None:
            page_text = "\n".join(current_lines).strip()

            if page_text:
                pages.append({
                    "source": text_file.stem + ".pdf",
                    "page": current_page,
                    "extraction_method": current_method,
                    "text": page_text,
                })

    for line in content.splitlines():
        if line.startswith("--- Page ") and line.endswith(" ---"):
            save_current_page()

            page_number = line[len("--- Page "):-len(" ---")]
            current_page = int(page_number)
            current_method = "text"
            current_lines = []

        elif line.startswith("Extraction method: "):
            current_method = line.split(":", 1)[1].strip()

        else:
            current_lines.append(line)

    save_current_page()
    return pages


def process_document(
    text_file: Path,
    chunk_size: int = 1000,
    overlap: int = 150,
) -> list[dict]:
    """Create searchable chunks with source and page metadata."""
    page_records = load_document_pages(text_file)
    records = []

    for page_record in page_records:
        chunks = chunk_text(
            page_record["text"],
            chunk_size=chunk_size,
            overlap=overlap,
        )

        for chunk_number, chunk in enumerate(chunks, start=1):
            records.append({
                "source": page_record["source"],
                "page": page_record["page"],
                "chunk": chunk_number,
                "extraction_method": page_record["extraction_method"],
                "text": chunk,
            })

    return records
