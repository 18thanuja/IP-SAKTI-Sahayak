
import json
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent

chunks_file = (
    project_root
    / "processed_text"
    / "all_document_chunks.jsonl"
)

total_chunks = 0
invalid_records = 0
sources = set()

print("Checking chunk dataset...\n")

with chunks_file.open("r", encoding="utf-8") as file:
    for line_number, line in enumerate(file, start=1):
        try:
            record = json.loads(line)
            total_chunks += 1

            if not all(
                key in record
                for key in [
                    "chunk_id",
                    "source",
                    "page",
                    "chunk",
                    "text",
                ]
            ):
                invalid_records += 1
                print(f"Missing fields on line {line_number}")

            if not record.get("text", "").strip():
                invalid_records += 1
                print(f"Empty text on line {line_number}")

            sources.add(record.get("source", "Unknown"))

        except json.JSONDecodeError:
            invalid_records += 1
            print(f"Invalid JSON on line {line_number}")

print("\nVerification results")
print("--------------------")
print("Total chunks:", total_chunks)
print("Unique source documents:", len(sources))
print("Invalid records:", invalid_records)
print("Dataset exists:", chunks_file.exists())

print("\nSource documents:")
for source in sorted(sources):
    print("-", source)

if invalid_records == 0 and total_chunks > 0:
    print("\nDataset verification passed!")
else:
    print("\nPlease check the reported errors.")
