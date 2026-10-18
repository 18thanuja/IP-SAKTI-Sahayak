from pathlib import Path

from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer


BASE_DIR = Path(__file__).resolve().parent.parent

QDRANT_PATH = BASE_DIR / "qdrant_storage"

COLLECTION_NAME = "ip_sakti_documents"

MODEL_NAME = "BAAI/bge-small-en-v1.5"


def main():
    print("Loading embedding model...", flush=True)

    model = SentenceTransformer(MODEL_NAME)

    print("Connecting to Qdrant...", flush=True)

    client = QdrantClient(
        path=str(QDRANT_PATH)
    )

    question = input(
        "\nEnter your question: "
    ).strip()

    if not question:
        print("Question cannot be empty.")
        return

    print("\nCreating query embedding...", flush=True)

    query_vector = model.encode(
        question,
        normalize_embeddings=True,
    ).tolist()

    print("Searching documents...", flush=True)

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=5,
    ).points

    print("\n" + "=" * 70)
    print("TOP 5 RETRIEVED RESULTS")
    print("=" * 70)

    for index, result in enumerate(results, start=1):
        payload = result.payload

        print(f"\nResult {index}")
        print("-" * 70)

        print(f"Score: {result.score:.4f}")
        print(f"Source: {payload['source']}")
        print(f"Page: {payload['page']}")
        print(f"Chunk ID: {payload['chunk_id']}")
        print(
            f"Extraction: "
            f"{payload['extraction_method']}"
        )

        print("\nText:")
        print(payload["text"][:1000])

    print("\n" + "=" * 70)
    print("Retrieval test completed!")
    print("=" * 70)


if __name__ == "__main__":
    main()