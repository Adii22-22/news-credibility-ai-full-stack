from ddgs import DDGS

def _run_news_search(query: str, max_results: int):
    # Use 'with' to ensure the session closes properly
    with DDGS() as ddgs:
        return list(
            ddgs.news(
                query=query,          # CHANGED: 'keywords' is now 'query'
                region="wt-wt",       # "wt-wt" = Global (no region)
                safesearch="moderate", 
                max_results=max_results
            )
        )

def get_verification_context(query: str, max_results: int = 10) -> str:
    """
    Searches DuckDuckGo News using the modern 'ddgs' library.
    """
    try:
        results = _run_news_search(query, max_results)

        # Retry with shorter query if no results
        if not results:
            short_query = " ".join(query.split()[:8])
            results = _run_news_search(short_query, max_results)

        if not results:
            return "NO_EVIDENCE_FOUND"

        context = []
        for i, r in enumerate(results):
            # Using .get() is safe in case keys change in future API updates
            source = r.get('source', 'Unknown')
            date = r.get('date', 'Unknown')
            title = r.get('title', '')
            body = r.get('body', '')
            url = r.get('url', '')

            context.append(
                f"SOURCE {i+1}: {source} ({date})\n"
                f"HEADLINE: {title}\n"
                f"SNIPPET: {body}\n"
                f"LINK: {url}\n"
            )

        return "\n".join(context).strip()

    except Exception as e:
        return f"NO_EVIDENCE_FOUND {e}"