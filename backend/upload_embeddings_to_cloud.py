
import json
import os
import uuid
from pathlib import Path

from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

BASE_DIR = Path(__file__).resolve().parents[1]
EMBEDDINGS_FILE = (
    BASE_DIR / "processed_text" / "all_document_embeddings.jsonl"
)

load_dotenv(BASE_DIR / ".env")

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

COLLECTION_NAME = "ip_sakti_documents"
VECTOR_SIZE = 384
BATCH_SIZE = 100


def main():
    if not QDRANT_URL or not QDRANT_API_KEY:
        raise RuntimeError(
            "Set QDRANT_URL and QDRANT_API_KEY in the project .env file."
        )

    if not EMBEDDINGS_FILE.exists():
        raise FileNotFoundError(
            f"Embeddings file not found: {EMBEDDINGS_FILE}"
        )

    client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )

    # Never delete or recreate an existing cloud collection automatically.
    if client.collection_exists(COLLECTION_NAME):
        raise RuntimeError(
            f"Collection '{COLLECTION_NAME}' already exists in Qdrant Cloud. "
            "Stopping to protect existing cloud data."
        )

    print("Reading embeddings...", flush=True)

    with EMBEDDINGS_FILE.open("r", encoding="utf-8") as file:
        records = [
            json.loads(line)
            for line in file
            if line.strip()
        ]

    if not records:
        raise RuntimeError("The embeddings file contains no records.")

    for index, record in enumerate(records, start=1):
        embedding = record.get("embedding")

        if not isinstance(embedding, list) or len(embedding) != VECTOR_SIZE:
            raise ValueError(
                f"Record {index} does not contain a "
                f"{VECTOR_SIZE}-dimension embedding."
            )

        if not record.get("chunk_id"):
            raise ValueError(f"Record {index} has no chunk_id.")

    print(f"Validated {len(records)} records.", flush=True)

    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE,
        ),
    )

    print("Uploading vectors to Qdrant Cloud...", flush=True)

    for start in range(0, len(records), BATCH_SIZE):
        batch = records[start : start + BATCH_SIZE]
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
                        "extraction_method": record["extraction_method"],
                        "text": record["text"],
                    },
                )
            )

        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points,
            wait=True,
        )

        completed = min(start + len(batch), len(records))
        print(f"Uploaded {completed}/{len(records)}", flush=True)

    info = client.get_collection(COLLECTION_NAME)
    print("Cloud upload finished.")
    print(f"Collection: {COLLECTION_NAME}")
    print(f"Points reported by Qdrant: {info.points_count}")


if __name__ == "__main__":
    main()
