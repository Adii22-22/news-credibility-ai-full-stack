from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()  # <--- This must run before os.getenv("GEMINI_API_KEY")

import os
import sys
from pathlib import Path

# Add parent directory to path to import services
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.scraper import scrape_article_text
from services.search import get_verification_context
from services.ai_agent import analyze_credibility
from services.news_feed import fetch_top_news

app = FastAPI(title="AI News Credibility Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Vite dev server (updated port)
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite default port (fallback)
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisRequest(BaseModel):
    text: str


@app.post("/analyze")
def analyze_news(req: AnalysisRequest):
    user_input = req.text.strip()
    if not user_input:
        raise HTTPException(status_code=400, detail="Empty input")

    try:
        if user_input.startswith(("http://", "https://")):
            article_text = scrape_article_text(user_input)
            if article_text.startswith("ERROR"):
                raise HTTPException(status_code=400, detail=article_text)
            search_query = article_text[:120]
        else:
            article_text = f"User Claim: {user_input}"
            search_query = user_input

        evidence = get_verification_context(search_query)

        if evidence == "NO_EVIDENCE_FOUND":
            evidence = "No reliable external evidence was found."

        # Get structured analysis from AI
        analysis_result = analyze_credibility(article_text, evidence)

        return {
            "status": "success",
            "input": user_input,
            **analysis_result  # Spread the analysis result directly
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/")
def home():
    return {"message": "AI News Credibility Agent is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/news")
def get_news():
    """
    Returns a lightweight list of top news articles from Google News RSS.
    No AI calls here – the frontend can choose specific articles to analyze
    with /analyze when the user asks (saves tokens).
    """
    articles = fetch_top_news()
    return {"articles": articles}
