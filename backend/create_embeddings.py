
import json
from pathlib import Path

from sentence_transformers import SentenceTransformer

BASE_DIR = Path(__file__).resolve().parent.parent
CHUNKS_FILE = BASE_DIR / "processed_text" / "all_document_chunks.jsonl"
OUTPUT_FILE = BASE_DIR / "processed_text" / "all_document_embeddings.jsonl"

BATCH_SIZE = 8
MODEL_NAME = "BAAI/bge-small-en-v1.5"


def main():
    print("Loading document chunks...", flush=True)

    if not CHUNKS_FILE.exists():
        raise FileNotFoundError(
            f"Chunk file not found: {CHUNKS_FILE}"
        )

    with CHUNKS_FILE.open("r", encoding="utf-8") as file:
        chunks = [
            json.loads(line)
            for line in file
            if line.strip()
        ]

    print(f"Total chunks: {len(chunks)}", flush=True)
    print(f"Loading model: {MODEL_NAME}", flush=True)

    model = SentenceTransformer(MODEL_NAME)

    print(
        f"Embedding dimensions: {model.get_sentence_embedding_dimension()}",
        flush=True,
    )

    # This starts a fresh output file and replaces any partial old embeddings.
    with OUTPUT_FILE.open("w", encoding="utf-8") as output_file:
        for start in range(0, len(chunks), BATCH_SIZE):
            batch = chunks[start:start + BATCH_SIZE]
            texts = [item["text"] for item in batch]

            vectors = model.encode(
                texts,
                batch_size=BATCH_SIZE,
                normalize_embeddings=True,
                show_progress_bar=False,
            )

            for item, vector in zip(batch, vectors):
                record = {
                    "chunk_id": item["chunk_id"],
                    "source": item["source"],
                    "page": item["page"],
                    "chunk": item["chunk"],
                    "extraction_method": item["extraction_method"],
                    "text": item["text"],
                    "embedding": vector.tolist(),
                }

                output_file.write(
                    json.dumps(record, ensure_ascii=False) + "\n"
                )

            output_file.flush()

            completed = min(start + BATCH_SIZE, len(chunks))
            print(
                f"Processed {completed}/{len(chunks)} chunks",
                flush=True,
            )

    print(f"\nEmbeddings saved to: {OUTPUT_FILE}")
    print("Embedding generation completed!")


if __name__ == "__main__":
    main()
