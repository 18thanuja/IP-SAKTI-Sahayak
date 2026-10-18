
import json
from pathlib import Path
from services.document_processor import process_document

project_root = Path(__file__).resolve().parent.parent
text_folder = project_root / "processed_text"
output_file = text_folder / "all_document_chunks.jsonl"

text_files = sorted(text_folder.glob("*.txt"))

all_chunks = 0
processed_documents = 0

print(f"Text files found: {len(text_files)}", flush=True)

with output_file.open("w", encoding="utf-8") as file:
    for text_file in text_files:
        print(f"\nProcessing: {text_file.name}", flush=True)

        try:
            records = process_document(text_file)

            for record in records:
                record["chunk_id"] = (
                    f"{text_file.stem}"
                    f"_p{record['page']}"
                    f"_c{record['chunk']}"
                )

                file.write(
                    json.dumps(record, ensure_ascii=False) + "\n"
                )

            all_chunks += len(records)
            processed_documents += 1

            print(f"Chunks created: {len(records)}", flush=True)

        except Exception as error:
            print(f"ERROR: {text_file.name}: {error}", flush=True)

print("\nDocument processing completed.")
print(f"Documents processed: {processed_documents}")
print(f"Total chunks created: {all_chunks}")
print(f"Output file: {output_file}")
print(f"Output file exists: {output_file.exists()}")
