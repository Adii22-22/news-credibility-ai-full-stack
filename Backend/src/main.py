from services.scraper import scrape_article_text
from services.search import get_verification_context
from services.ai_agent import analyze_credibility


def is_valid_url(text: str) -> bool:
    return text.startswith(("http://", "https://"))


def run_news_assistant():
    print("\n--- AI NEWS CREDIBILITY ASSISTANT ---")

    user_input = input("\n>> Enter URL or Claim: ").strip()
    if not user_input:
        print("ERROR: Empty input.")
        return

    if is_valid_url(user_input):
        print("[Mode: URL]")
        article_text = scrape_article_text(user_input)
        if article_text.startswith("ERROR"):
            print(article_text)
            return
        search_query = article_text[:120]
    else:
        print("[Mode: TEXT CLAIM]")
        article_text = f"User Claim: {user_input}"
        search_query = user_input

    print("Searching evidence...")
    evidence = get_verification_context(search_query)

    if evidence == "NO_EVIDENCE_FOUND":
        evidence = "No reliable external evidence was found."

    print("Analyzing with AI...\n")
    try:
        result = analyze_credibility(article_text, evidence)
        
        print("=" * 45)
        print("FINAL INTELLIGENCE REPORT")
        print("=" * 45)
        print(f"Trust Score: {result['trustScore']}%")
        print(f"Factual Accuracy: {result['factualAccuracy']}")
        print(f"Bias Rating: {result['biasRating']}")
        print(f"\nHeadline: {result['headline']}")
        print(f"\nSummary:\n{result['summary']}")
        print(f"\nTags: {', '.join(result['tags'])}")
        if result.get('crossReferences'):
            print(f"\nCross-References:")
            for ref in result['crossReferences']:
                print(f"  - {ref['source']} ({ref['timeAgo']})")
        print("=" * 45)
    except Exception as e:
        print(f"ERROR: {e}")
        print("=" * 45)


if __name__ == "__main__":
    run_news_assistant()
