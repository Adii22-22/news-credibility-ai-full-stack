import trafilatura


def scrape_article_text(url: str) -> str:
    """
    Scrapes and extracts main article text from a URL.
    Always returns a string.
    """

    try:
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            return "ERROR: Failed to download article."

        extracted = trafilatura.extract(downloaded)
        if not extracted or len(extracted.strip()) < 300:
            return "ERROR: Article content too short or unreadable."

        return extracted.strip()

    except Exception as e:
        return f"ERROR: Scraping failed ({e})"
