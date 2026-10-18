import json
import uuid
from pathlib import Path

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct


BASE_DIR = Path(__file__).resolve().parent.parent

EMBEDDINGS_FILE = (
    BASE_DIR
    / "processed_text"
    / "all_document_embeddings.jsonl"
)

QDRANT_PATH = BASE_DIR / "qdrant_storage"

COLLECTION_NAME = "ip_sakti_documents"

VECTOR_SIZE = 384
BATCH_SIZE = 100


def main():
    print("Loading embeddings...", flush=True)

    if not EMBEDDINGS_FILE.exists():
        raise FileNotFoundError(
            f"Embeddings file not found: {EMBEDDINGS_FILE}"
        )

    with EMBEDDINGS_FILE.open("r", encoding="utf-8") as file:
        records = [
            json.loads(line)
            for line in file
            if line.strip()
        ]

    print(f"Total embeddings: {len(records)}", flush=True)

    print("Starting Qdrant...", flush=True)

    client = QdrantClient(
        path=str(QDRANT_PATH)
    )

    # Recreate the collection if it already exists.
    if client.collection_exists(COLLECTION_NAME):
        print(
            f"Collection '{COLLECTION_NAME}' already exists.",
            flush=True,
        )
        print("Deleting old collection...", flush=True)

        client.delete_collection(COLLECTION_NAME)

    print(
        f"Creating collection: {COLLECTION_NAME}",
        flush=True,
    )

    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE,
        ),
    )

    print("Uploading vectors...", flush=True)

    for start in range(0, len(records), BATCH_SIZE):
        batch = records[start:start + BATCH_SIZE]

        points = []

        for record in batch:
            point_id = str(
                uuid.uuid5(
                    uuid.NAMESPACE_URL,
                    record["chunk_id"],
                )
            )

            points.append(
                PointStruct(
                    id=point_id,
                    vector=record["embedding"],
                    payload={
                        "chunk_id": record["chunk_id"],
                        "source": record["source"],
                        "page": record["page"],
                        "chunk": record["chunk"],
                        "extraction_method": record[
                            "extraction_method"
                        ],
                        "text": record["text"],
                    },
                )
            )

        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points,
        )

        completed = min(
            start + BATCH_SIZE,
            len(records),
        )

        print(
            f"Uploaded {completed}/{len(records)} vectors",
            flush=True,
        )

    collection_info = client.get_collection(
        COLLECTION_NAME
    )

    print("\nQdrant database created successfully!")
    print(f"Collection: {COLLECTION_NAME}")
    print(
        f"Vectors stored: "
        f"{collection_info.points_count}"
    )
    print(f"Database location: {QDRANT_PATH}")


if __name__ == "__main__":
    main()