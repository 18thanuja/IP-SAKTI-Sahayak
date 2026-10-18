
from pathlib import Path
from services.document_processor import process_document

project_root = Path(__file__).resolve().parent.parent

text_file = (
    project_root
    / "processed_text"
    / "Patents_Act_1970.txt"
)

print("Processing:", text_file.name)

records = process_document(text_file)

print("Total chunks:", len(records))

for record in records[:3]:
    print("\n--- Chunk ---")
    print("Source:", record["source"])
    print("Page:", record["page"])
    print("Chunk number:", record["chunk"])
    print("Extraction method:", record["extraction_method"])
    print("Text preview:", record["text"][:200])

print("\nDocument processor test completed!")
