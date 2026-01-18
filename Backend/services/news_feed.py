import datetime as _dt
import html
import re
import xml.etree.ElementTree as ET

import requests


GOOGLE_NEWS_RSS = (
    "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en"
)


def _clean_html(text: str) -> str:
    if not text:
        return ""
    # Unescape basic HTML entities and strip tags.
    text = html.unescape(text)
    return re.sub(r"<[^>]+>", "", text).strip()


def fetch_top_news(max_items: int = 12):
    """
    Fetches top headlines from Google News RSS.
    Returns a list of dicts with {title, link, summary, published}.
    No AI calls here (cheap).
    """
    try:
        resp = requests.get(GOOGLE_NEWS_RSS, timeout=10)
        resp.raise_for_status()
    except Exception:
        return []

    try:
        root = ET.fromstring(resp.content)
    except Exception:
        return []

    channel = root.find("channel")
    if channel is None:
        return []

    articles = []
    for item in channel.findall("item")[:max_items]:
        title = _clean_html(item.findtext("title", default=""))
        link = item.findtext("link", default="") or ""
        description = _clean_html(item.findtext("description", default=""))
        pub_date_raw = item.findtext("pubDate", default="") or ""

        # Try to keep published human-readable; fallback to raw string.
        published = pub_date_raw
        try:
            dt = _dt.datetime.strptime(pub_date_raw, "%a, %d %b %Y %H:%M:%S %Z")
            published = dt.strftime("%Y-%m-%d %H:%M")
        except Exception:
            pass

        articles.append(
            {
                "title": title,
                "link": link,
                "summary": description,
                "published": published,
            }
        )

    return articles

