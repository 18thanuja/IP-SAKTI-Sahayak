
import logging
import os
import traceback
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from services.rag_service import ask_question


# --------------------------------------------------
# Logging configuration
# --------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ip_sakti")

# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"

# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="IP-SAKTI Sahayak API",
    description=(
        "Multilingual, source-cited research assistant for "
        "Ayurveda-related intellectual property and regulation."
    ),
    version="2.0.0",
)

# --------------------------------------------------
# CORS configuration
# --------------------------------------------------

frontend_urls = os.getenv("FRONTEND_URL", "")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

allowed_origins.extend(
    url.strip().rstrip("/")
    for url in frontend_urls.split(",")
    if url.strip()
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(allowed_origins)),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# --------------------------------------------------
# Request model
# --------------------------------------------------

class AskRequest(BaseModel):
    question: str
    language: str = "English"


# --------------------------------------------------
# Home endpoint
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "name": "IP-SAKTI Sahayak",
        "status": "running",
        "scope": "National and international",
    }


# --------------------------------------------------
# Health endpoint
# --------------------------------------------------

@app.get("/health")
def health():
    return {"status": "healthy"}


# --------------------------------------------------
# Ask endpoint
# --------------------------------------------------

@app.post("/ask")
def ask(request: AskRequest):
    question = request.question.strip()
    language = request.language.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    if not language:
        language = "English"

    try:
        logger.info(
            "Received question. Language: %s, question length: %d",
            language,
            len(question),
        )

        result = ask_question(question, language)

        logger.info("Question answered successfully.")
        return result

    except ValueError as exc:
        logger.warning("Invalid request: %s", exc)
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception:
        # Print the complete traceback to the backend terminal.
        # Do not expose internal errors or credentials to the browser.
        logger.error(
            "Error while processing /ask request:\n%s",
            traceback.format_exc(),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "The request could not be completed. "
                "Check the backend terminal for the detailed error."
            ),
        )


# --------------------------------------------------
# Document endpoint
# --------------------------------------------------

@app.get("/documents/{filename}")
def get_document(filename: str):
    if (
        not filename.lower().endswith(".pdf")
        or Path(filename).name != filename
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF filename.",
        )

    matches = (
        [
            path
            for path in DATA_DIR.rglob(filename)
            if path.is_file()
        ]
        if DATA_DIR.is_dir()
        else []
    )

    if len(matches) != 1:
        raise HTTPException(
            status_code=404,
            detail="PDF not found or filename is ambiguous.",
        )

    return FileResponse(
        matches[0],
        media_type="application/pdf",
        headers={"Content-Disposition": "inline"},
    )
