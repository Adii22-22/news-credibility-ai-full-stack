import os
import json
from typing import Dict, Any
from google import genai
from dotenv import load_dotenv

load_dotenv()


GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash")

def _get_gemini_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception(
            "GEMINI_API_KEY is not set. Please set it in your environment before running the app."
        )
    return genai.Client(api_key=api_key)

def analyze_credibility(article_text: str, external_evidence: str) -> Dict[str, Any]:
    """
    Uses Google Gemini to analyze credibility with structured JSON output.
    Returns a dictionary matching the frontend AnalysisResult interface.
    """
    max_chars_article = 4000
    max_chars_evidence = 3000

    article_snippet = (article_text or "")[:max_chars_article]
    evidence_snippet = (external_evidence or "")[:max_chars_evidence]

    # Extract headline from article text
    headline = article_snippet.split('\n')[0][:100] if article_snippet else "News Analysis"
    if len(headline) > 100:
        headline = headline[:97] + "..."

    prompt = f"""You are an expert AI News Analyst specializing in fact-checking, bias detection, and credibility assessment.

TASK: Analyze the following news content for credibility, factual accuracy, bias, and provide a comprehensive analysis.

IMPORTANT:
If the input claim is incorrect or misleading, explicitly state that it is false
and provide the correct verified information in the summary.
Do not only summarize — correct the misinformation.


--- INPUT TEXT / CLAIM ---
{article_snippet}

--- EXTERNAL NEWS EVIDENCE ---
{evidence_snippet}

--- ANALYSIS REQUIREMENTS ---
1. CREDIBILITY ASSESSMENT: Score from 0-100 based on:
   - Factual accuracy and verification against evidence
   - Source reliability and cross-referencing
   - Consistency with trusted sources (BBC, Reuters, AP, etc.)
   - Absence of manipulative language or disinformation patterns

2. FACTUAL ACCURACY: Rate as "High", "Medium", or "Low" based on:
   - How well claims match verified evidence
   - Presence of factual errors or unverified claims

3. BIAS RATING: Determine as "Left", "Right", "Neutral", or "Mixed" by analyzing:
   - Political framing and language
   - Selective presentation of facts
   - Emotional manipulation techniques

4. ANALYSIS SUMMARY:
Provide a 2–3 sentence analysis.
If the claim is false or misleading, clearly state the correction with verified facts.


5. TAGS: Identify 3 relevant topic categories (e.g., Technology, Finance, Politics, Science, Health, Sports, Entertainment)

6. CROSS-REFERENCES: Extract up to 3 trusted sources mentioned in the evidence with their reliability indicators.

7. MULTILINGUAL OUTPUT:
   Provide the same summary translated into:
   - Hindi
   - Marathi


Be thorough, objective, and base your assessment on the evidence provided."""

    # Define the JSON schema for structured output
    response_schema = {
        "type": "object",
        "properties": {
            "trustScore": {
                "type": "integer",
                "description": "Credibility score from 0-100",
                "minimum": 0,
                "maximum": 100
            },
            "factualAccuracy": {
                "type": "string",
                "enum": ["High", "Medium", "Low"],
                "description": "Level of factual accuracy"
            },
            "biasRating": {
                "type": "string",
                "enum": ["Left", "Right", "Neutral", "Mixed"],
                "description": "Political bias assessment"
            },
            "headline": {
                "type": "string",
                "description": "A concise headline summarizing the analyzed content"
            },
            "summary": {
                "type": "string",
                "description": "A 2-3 sentence comprehensive analysis of credibility, factual accuracy, bias, and key findings"
            },
            "summary_hi": {
                "type": "string",
                "description": "Hindi translation of the summary"
            },
            "summary_mr": {
                "type": "string",
                "description": "Marathi translation of the summary"
            },
            "tags": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 3,
                "maxItems": 3,
                "description": "Exactly 3 relevant topic tags"
            },
            "crossReferences": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "source": {"type": "string"},
                        "sourceInitials": {"type": "string"},
                        "timeAgo": {"type": "string"},
                        "trustColor": {
                            "type": "string",
                            "enum": ["primary", "yellow", "red", "gray"]
                        }
                    }
                },
                "maxItems": 3
            }
        },
        "required": ["trustScore", "factualAccuracy", "biasRating", "headline", "summary", "tags", "crossReferences"]
    }

    try:
        client = _get_gemini_client()
        
        # Use generate_content with JSON response format
        # The google-genai library uses a different format for structured output
        try:
            # Try with structured output first (for newer API versions)
            response = client.models.generate_content(
                model=GEMINI_MODEL_NAME,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": response_schema
                }
            )
        except (TypeError, AttributeError):
            # Fallback: request JSON in prompt and parse manually
            json_prompt = f"""{prompt}

IMPORTANT: Respond ONLY with valid JSON matching this exact structure:
{json.dumps({
    "trustScore": 85,
    "factualAccuracy": "High",
    "biasRating": "Neutral",
    "headline": "Example Headline",
    "summary": "Example summary",
    "tags": ["Technology", "Finance", "Politics"],
    "crossReferences": [
        {{"source": "Reuters", "sourceInitials": "RT", "timeAgo": "2 hours ago", "trustColor": "primary"}}
    ]
}, indent=2)}

Do not include any text before or after the JSON."""
            
            response = client.models.generate_content(
                model=GEMINI_MODEL_NAME,
                contents=json_prompt
            )
        
        # Parse the JSON response
        text = getattr(response, "text", None)
        if not text:
            raise Exception("Gemini returned no text.")
        
        # Clean up the response (remove markdown code blocks if present)
        cleaned_text = text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.startswith("```"):
            cleaned_text = cleaned_text[3:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        cleaned_text = cleaned_text.strip()
        
        result = json.loads(cleaned_text)
        result.setdefault("summary_hi", result["summary"])
        result.setdefault("summary_mr", result["summary"])

        
        # Ensure headline is set (use provided or extract from article)
        if not result.get("headline") or result["headline"].strip() == "":
            result["headline"] = headline
        
        # Ensure we have exactly 3 tags
        if len(result.get("tags", [])) != 3:
            tags = result.get("tags", [])
            while len(tags) < 3:
                tags.append("General")
            result["tags"] = tags[:3]
        
        # Ensure crossReferences is a list
        if not isinstance(result.get("crossReferences"), list):
            result["crossReferences"] = []
        
        # Limit crossReferences to 3
        result["crossReferences"] = result["crossReferences"][:3]
        
        return result
        
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse AI response as JSON: {e}")
    except Exception as e:
        raise Exception(f"Gemini analysis failed: {e}")