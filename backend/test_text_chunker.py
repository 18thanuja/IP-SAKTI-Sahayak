
from services.text_chunker import chunk_text

sample_text = """
The Patents Act, 1970 provides the legal framework for patents in India.

Traditional knowledge can raise important questions about intellectual property
protection and the rights of local and Indigenous communities.

International agreements can also influence how traditional knowledge is protected.
"""

chunks = chunk_text(
    sample_text,
    chunk_size=150,
    overlap=30,
)

print("Original text length:", len(sample_text))
print("Number of chunks:", len(chunks))

for index, chunk in enumerate(chunks, start=1):
    print(f"\n--- Chunk {index} ---")
    print(chunk)

print("\nChunking test completed!")
