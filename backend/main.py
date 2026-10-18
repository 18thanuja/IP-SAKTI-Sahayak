
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from services.rag_service import ask_question

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"

app = FastAPI(
    title="IP-SAKTI Sahayak API",
    description=(
        "Multilingual, source-cited research assistant for "
        "Ayurveda-related intellectual property and regulation."
    ),
    version="2.0.0",
)

# Set FRONTEND_URL in Render to your deployed Vercel website URL.
# Multiple URLs can be separated by commas.
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


class AskRequest(BaseModel):
    question: str
    language: str = "English"


@app.get("/")
def home():
    return {
        "name": "IP-SAKTI Sahayak",
        "status": "running",
        "scope": "National and international",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/ask")
def ask(request: AskRequest):
    try:
        return ask_question(
            request.question,
            request.language,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
    except Exception:
        # Keep internal errors and credentials out of browser responses.
        raise HTTPException(
            status_code=500,
            detail=(
                "The request could not be completed. "
                "Check the backend logs for details."
            ),
        )


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
