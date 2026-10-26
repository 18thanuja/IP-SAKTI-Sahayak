
from FlagEmbedding import BGEM3FlagModel

print("Loading BGE-M3 model...", flush=True)

model = BGEM3FlagModel(
    "BAAI/bge-m3",
    use_fp16=False,
)

texts = [
    "The Patents Act, 1970 provides the legal framework for patents in India.",
    "Traditional knowledge may raise intellectual property protection questions.",
]

print("Generating embeddings...", flush=True)

embeddings = model.encode(
    texts,
    batch_size=2,
    max_length=512,
)["dense_vecs"]

print("Number of embeddings:", len(embeddings))
print("Vector dimensions:", len(embeddings[0]))
print("First vector values:", embeddings[0][:5])
print("Embedding test completed!")
