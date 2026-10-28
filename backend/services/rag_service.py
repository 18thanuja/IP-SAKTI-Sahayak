import os
import logging
from pathlib import Path
from urllib.parse import quote

from dotenv import load_dotenv
from groq import Groq
from qdrant_client import QdrantClient
from fastembed import TextEmbedding


# ============================================================
# Logging
# ============================================================

logger = logging.getLogger("ip_sakti.rag")


# ============================================================
# Paths and environment variables
# ============================================================

BACKEND_DIR = Path(__file__).resolve().parents[1]
BASE_DIR = BACKEND_DIR.parent
DATA_DIR = BASE_DIR / "data"

# .env is inside the backend folder
load_dotenv(BACKEND_DIR / ".env")


# ============================================================
# Configuration
# ============================================================

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

COLLECTION_NAME = "ip_sakti_documents"

# Embedding model used for semantic search
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"

# LLM used for answer generation
LLM_MODEL = "openai/gpt-oss-20b"

# Backend URL used for opening source PDFs
API_BASE_URL = os.getenv(
    "API_BASE_URL",
    "http://127.0.0.1:8000"
).rstrip("/")

# Number of document chunks retrieved from Qdrant
TOP_K = 5


# ============================================================
# Supported languages
# ============================================================

LANGUAGES = {
    "English": "English",
    "Telugu": "Telugu",
    "Hindi": "Hindi",
    "Tamil": "Tamil",
    "Kannada": "Kannada",
}


# ============================================================
# Cached clients/models
# ============================================================

_embedding_model = None
_qdrant_client = None
_groq_client = None


# ============================================================
# Embedding model
# ============================================================

def get_embedding_model():
    """
    Load the embedding model once and reuse it.
    """

    global _embedding_model

    if _embedding_model is None:
        logger.info(
            "Loading embedding model: %s",
            EMBEDDING_MODEL
        )

        _embedding_model = TextEmbedding(
            model_name=EMBEDDING_MODEL
        )

    return _embedding_model


# ============================================================
# Qdrant client
# ============================================================

def get_qdrant_client():
    """
    Create and cache the Qdrant client.
    """

    global _qdrant_client

    if _qdrant_client is None:

        if not QDRANT_URL or not QDRANT_API_KEY:
            raise RuntimeError(
                "QDRANT_URL or QDRANT_API_KEY is missing "
                "from the environment variables. "
                "Check backend/.env."
            )

        _qdrant_client = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
        )

    return _qdrant_client


# ============================================================
# Groq client
# ============================================================

def get_groq_client():
    """
    Create and cache the Groq client.
    """

    global _groq_client

    if _groq_client is None:

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is missing. "
                "Check backend/.env and ensure it contains "
                "GROQ_API_KEY=your_key."
            )

        _groq_client = Groq(
            api_key=api_key
        )

    return _groq_client


# ============================================================
# Translate multilingual query into English
# ============================================================

def translate_query_to_english(question: str) -> str:
    """
    Convert a multilingual question into a concise English
    search query so that English source documents can be retrieved.
    """

    if not question or not question.strip():
        return question

    try:

        client = get_groq_client()

        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Convert the user's question into a concise "
                        "English search query for retrieving relevant "
                        "official intellectual property, Ayurveda, "
                        "legal, regulatory, or international documents. "
                        "Preserve important names, legal terms, "
                        "technical terms, and intended meaning. "
                        "Output ONLY the English search query. "
                        "Do not answer the question."
                    ),
                },
                {
                    "role": "user",
                    "content": question,
                },
            ],
            max_completion_tokens=180,
            reasoning_effort="low",
        )

        translated = response.choices[0].message.content

        if translated and translated.strip():
            return translated.strip()

        return question

    except Exception:
        logger.exception(
            "Query translation failed. "
            "Using original question for retrieval."
        )

        return question


# ============================================================
# Build local PDF URL
# ============================================================

def build_pdf_url(
    source: str,
    page
) -> str | None:
    """
    Build a URL to a local PDF document and page.

    Example:
    /documents/Patents_Act.pdf#page=12
    """

    if not source or source == "Unknown source":
        return None

    filename = Path(source).name

    # Prevent invalid/non-PDF source paths
    if filename != source:
        return None

    if not filename.lower().endswith(".pdf"):
        return None

    if not DATA_DIR.is_dir():
        return None

    matches = [
        path
        for path in DATA_DIR.rglob(filename)
        if path.is_file()
    ]

    # Only create a URL when exactly one matching PDF exists
    if len(matches) != 1:
        return None

    try:
        page_number = max(
            1,
            int(page)
        )
    except (TypeError, ValueError):
        page_number = 1

    return (
        f"{API_BASE_URL}/documents/{quote(filename)}"
        f"#page={page_number}"
    )


# ============================================================
# Retrieve documents from Qdrant
# ============================================================

def retrieve_documents(
    question: str,
    limit: int = TOP_K,
) -> list[dict]:
    """
    Retrieve the most relevant document chunks from Qdrant.
    """

    if not question or not question.strip():
        return []

    # --------------------------------------------------------
    # Translate question into English for retrieval
    # --------------------------------------------------------

    search_query = translate_query_to_english(
        question
    )

    logger.info(
        "Original question: %s",
        question
    )

    logger.info(
        "Retrieval query: %s",
        search_query
    )

    # --------------------------------------------------------
    # Generate embedding
    # --------------------------------------------------------

    model = get_embedding_model()

    vector = list(
        model.query_embed(search_query)
    )[0].tolist()

    # --------------------------------------------------------
    # Search Qdrant
    # --------------------------------------------------------

    results = get_qdrant_client().query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=max(1, limit),
        with_payload=True,
    ).points

    # --------------------------------------------------------
    # Convert Qdrant results into clean documents
    # --------------------------------------------------------

    documents = []

    for result in results:

        payload = result.payload or {}

        passage = payload.get(
            "text",
            ""
        )

        if (
            not isinstance(passage, str)
            or not passage.strip()
        ):
            continue

        documents.append(
            {
                "score": result.score,
                "source": payload.get(
                    "source",
                    "Unknown source"
                ),
                "page": payload.get(
                    "page",
                    "Unknown"
                ),
                "chunk_id": payload.get(
                    "chunk_id",
                    ""
                ),
                "text": passage.strip(),
            }
        )

    logger.info(
        "Retrieved %d document chunks.",
        len(documents)
    )

    return documents


# ============================================================
# Generate evidence-based answer
# ============================================================

def generate_answer(
    question: str,
    documents: list[dict],
    language: str = "English",
) -> str:
    """
    Generate a concise, question-focused answer using
    retrieved evidence.
    """

    language = LANGUAGES.get(
        language,
        "English"
    )

    # --------------------------------------------------------
    # No evidence found
    # --------------------------------------------------------

    if not documents:

        if language == "English":
            return (
                "I could not find enough evidence in the indexed "
                "documents to answer this question reliably."
            )

        return (
            "The indexed documents did not provide enough evidence "
            "to answer this question reliably."
        )

    # --------------------------------------------------------
    # Prepare retrieved context
    # --------------------------------------------------------

    context_parts = []

    for index, doc in enumerate(
        documents,
        start=1
    ):

        context_parts.append(
            f"[Source {index}]\n"
            f"Document: {doc['source']}\n"
            f"Page: {doc['page']}\n"
            f"Passage:\n{doc['text']}"
        )

    context = "\n\n".join(
        context_parts
    )

    # --------------------------------------------------------
    # Strong answer-control prompt
    # --------------------------------------------------------

    system_prompt = f"""
You are IP-SAKTI Sahayak, an AI research assistant for
Ayurveda-related Intellectual Property and regulatory guidance.

Answer entirely in {language}.

============================================================
PRIMARY INSTRUCTION
============================================================

Answer EXACTLY what the user asks.

Do NOT automatically provide additional information that the
user did not request.

For example:

- "What is X?" → Give the definition of X.
- "What are the types of X?" → Give the types of X.
- "What is X and its types?" → Give the definition and types.
- "Explain X." → Give a concise explanation.
- "How do I do X?" → Give the required steps.
- "Compare X and Y." → Give a comparison.
- "What are the advantages of X?" → Give advantages.
- "What are the disadvantages of X?" → Give disadvantages.
- "Give examples of X." → Give examples.

Do not automatically add:

- History
- Applications
- Advantages
- Disadvantages
- Examples
- Types
- Procedures
- Conclusions
- Background information

unless they are relevant to or explicitly requested by the user.

Keep answers concise and focused.

Use bullet points when the user asks for a list.

Use numbered steps when the user asks for a procedure.

Use a table only when a comparison or structured presentation
would genuinely improve the answer.

Do not repeat the user's question.

Do not add a generic conclusion.

Provide additional detail only when the user asks for more detail.

============================================================
PROJECT SCOPE
============================================================

IP-SAKTI Sahayak covers:

1. Indian/national intellectual property laws and regulations.
2. International intellectual property treaties and frameworks.
3. Ayurveda-related intellectual property.
4. Traditional knowledge.
5. Regulatory guidance relevant to Ayurveda.
6. Relevant official national and international sources.

============================================================
EVIDENCE RULES
============================================================

Use the retrieved document passages as the primary evidence.

For document-specific claims:

- Cite the supporting passage using [Source 1], [Source 2], etc.
- Only use source numbers that actually exist.
- Put the citation immediately after the supported claim.
- Every citation must genuinely support the claim.

Never invent:

- Laws
- Acts
- Sections
- Rules
- Regulations
- Treaty articles
- Court decisions
- Dates
- Procedures
- Quotations
- Statistics
- URLs
- Sources

If the retrieved evidence is insufficient, clearly say that the
information could not be verified from the indexed documents.

Do not pretend to have reviewed an entire law or document when
only selected passages were retrieved.

Distinguish clearly between:

- Indian law
- International treaties/frameworks
- Regulatory requirements
- Patentability
- Traditional knowledge
- Traditional knowledge databases

Do not assume that every Ayurvedic formulation is patentable.

Do not treat a traditional knowledge database as equivalent to
legal ownership.

This system provides informational research guidance and is not
a substitute for professional legal advice.

============================================================
CITATION FORMAT
============================================================

Use citations like:

A patent provides exclusive rights subject to applicable legal
requirements. [Source 1]

Do not create a separate "Sources" section in the answer.
The application displays source information separately.

============================================================
ANSWER STYLE
============================================================

- Clear
- Concise
- Professional
- Direct
- Evidence-based
- Easy to understand
- No unnecessary repetition
- No unnecessary background information

============================================================
RETRIEVED EVIDENCE
============================================================

{context}
"""

    # --------------------------------------------------------
    # User prompt
    # --------------------------------------------------------

    user_prompt = f"""
User question:

{question}

Answer ONLY the question above.

Use the retrieved evidence where relevant.

Keep the answer focused and concise.

Use [Source N] citations for document-based claims.

Never invent legal references or unsupported information.
"""

    # --------------------------------------------------------
    # Call LLM
    # --------------------------------------------------------

    response = get_groq_client().chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        max_completion_tokens=900,
        reasoning_effort="low",
    )

    # --------------------------------------------------------
    # Extract answer
    # --------------------------------------------------------

    answer = response.choices[0].message.content

    if answer and answer.strip():
        return answer.strip()

    return (
        "The model returned an empty answer. "
        "Please try again."
    )


# ============================================================
# Main question-answer function
# ============================================================

def ask_question(
    question: str,
    language: str = "English",
) -> dict:
    """
    Main RAG pipeline.

    Flow:

    Question
       ↓
    English query translation
       ↓
    Embedding
       ↓
    Qdrant retrieval
       ↓
    Evidence context
       ↓
    GPT-OSS 20B
       ↓
    Answer + citations
    """

    # --------------------------------------------------------
    # Validate question
    # --------------------------------------------------------

    if (
        not isinstance(question, str)
        or not question.strip()
    ):
        raise ValueError(
            "Please enter a valid question."
        )

    question = question.strip()

    language = LANGUAGES.get(
        language,
        "English"
    )

    # --------------------------------------------------------
    # Retrieve evidence
    # --------------------------------------------------------

    documents = retrieve_documents(
        question
    )

    # --------------------------------------------------------
    # Generate answer
    # --------------------------------------------------------

    answer = generate_answer(
        question,
        documents,
        language
    )

    # --------------------------------------------------------
    # Build citation objects
    # --------------------------------------------------------

    citations = []

    for doc in documents:

        try:
            score = round(
                float(
                    doc.get(
                        "score",
                        0
                    ) or 0
                ),
                4
            )

        except (
            TypeError,
            ValueError
        ):
            score = 0.0

        source = doc.get(
            "source",
            "Unknown source"
        )

        page = doc.get(
            "page",
            "Unknown"
        )

        passage = doc.get(
            "text",
            ""
        )

        citations.append(
            {
                "source": source,

                "page": page,

                "chunk_id": doc.get(
                    "chunk_id",
                    ""
                ),

                "score": score,

                "text": (
                    passage.strip()
                    if isinstance(
                        passage,
                        str
                    )
                    else ""
                ),

                "pdf_url": build_pdf_url(
                    source,
                    page
                ),
            }
        )

    # --------------------------------------------------------
    # Return API response
    # --------------------------------------------------------

    return {
        "question": question,

        "answer": answer,

        "citations": citations,

        "model": LLM_MODEL,

        "language": language,
    }