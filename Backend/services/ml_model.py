from transformers import pipeline


_classifier = pipeline(
    "text-classification",
    model="therealcyberlord/fake-news-classification-distilbert"
)

def predict_credibility(text: str) -> float:
    """
    Returns credibility probability (0–100).
    """
    result = _classifier(text[:1000])[0]
    label = result["label"].lower()
    score = result["score"]

    if "real" in label:
        return round(score * 100, 2)
    else:
        return round((1 - score) * 100, 2)
